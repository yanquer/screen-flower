import {Component} from "react";
import {Box, Flex, TextField, Text, Checkbox, Theme, Grid, Button,
    Select,
} from "@radix-ui/themes";
import {VideoPlayer} from "./video-player";
import {DragTitle} from "../drag-title";
import {getServiceBySymbol} from "../../../common/container/inject-container";
import {IRecordService, IUtilService} from "../../../common/service";
import {IRecordContext, RecordContext} from "../../common/global-context";
import {LabelSelect} from "../radix-ui/label-select";
import {VideoArgs, VideoFps} from "../../../common/models";

interface PlayViewState{
    titleShow: boolean,
    videoArgs?: VideoArgs,
}

export class PlayerView extends Component<any, PlayViewState>{

    static contextType = RecordContext
    context: IRecordContext

    state: PlayViewState = {
        titleShow: true,
        videoArgs: {
            videoType: 'gif',
            videoSize: 'origin',
            fps: 'origin',
        },
    }

    protected getUrlName(vUrl: string){
        if (!vUrl) return undefined
        const lastSepI = vUrl.lastIndexOf('/')
        return vUrl.substring(lastSepI + 1)
    }

    render() {
        const {videoUrl, setVideoUrl} = this.context
        return (
            <div className={'w-full bg-gray-500'}>
                <Theme appearance={'dark'}
                       className={"p-0 pt-0 bg-gray-950"}
                >

                    <Box
                        onMouseEnter={() => this.setState({titleShow: true})}
                        onMouseLeave={() => this.setState({titleShow: false})}
                    >
                        <VideoPlayer/>
                    </Box>

                    <Box className={`absolute top-1 w-full text-center 
                        ${this.state.titleShow ? '' : ' hidden '}
                       
                        `}
                         onMouseOver={() => this.setState({titleShow: true})}
                         // onMouseLeave={() => this.setState({titleShow: false})}
                    >
                        <DragTitle title={this.getUrlName(videoUrl) ?? 'Player'}/>
                    </Box>

                    <Box className={'p-1 flex items-center justify-center'}>
                        <Button color={'gold'}
                                size={'1'}
                                className={'m-2 opacity-80'}
                                onClick={
                            async () => {
                                const utilService = getServiceBySymbol<IUtilService>(IUtilService)
                                const fileName: string = await utilService.askSelectAVideoFile(true, false) as string
                                if (fileName) setVideoUrl(fileName)
                            }
                        }>打开其他文件</Button>

                        <Box className={'m-2 flex items-center justify-center'}>

                            <LabelSelect
                                defaultValue={"gif"}
                                label={"类型"}
                                selectLabel={"生成目标类型"}
                                options={[
                                    {value: "gif", disabled: false, text: "GIF"},
                                    {value: "mp4", disabled: true, text: "MP4"},
                                ]}
                                onChange={(value: 'gif' | 'mp4') => {
                                    this.setState((preState) => {
                                        return {videoArgs: {
                                            ...preState.videoArgs,
                                                videoType: value
                                        }}
                                    })
                                }}
                            />

                            <LabelSelect
                                defaultValue={"origin"}
                                label={"尺寸"}
                                selectLabel={"视频尺寸"}
                                options={[
                                    {value: "origin", disabled: false, text: "原始"},
                                    {value: "HD", disabled: false, text: "1920 x 1080"},
                                ]}
                                onChange={(value: 'origin' | 'HD') => {
                                    this.setState((preState) => {
                                        return {videoArgs: {
                                                ...preState.videoArgs,
                                                videoSize: value
                                            }}
                                    })
                                }}
                            />

                            <LabelSelect
                                defaultValue={"origin"}
                                label={"FPS"}
                                selectLabel={"FPS"}
                                options={[
                                    {value: "origin", disabled: false, text: "原始"},
                                    {value: "10", disabled: false, text: "10"},
                                    {value: "15", disabled: false, text: "15"},
                                    {value: "20", disabled: false, text: "20"},
                                    {value: "25", disabled: false, text: "25"},
                                    {value: "30", disabled: false, text: "30"},
                                    {value: "60", disabled: true, text: "60"},
                                ]}
                                onChange={(value: VideoFps) => {
                                    this.setState((preState) => {
                                        return {videoArgs: {
                                                ...preState.videoArgs,
                                                fps: value
                                            }}
                                    })
                                }}
                            />


                        </Box>

                        <Button color={'gold'}
                                size={'1'}
                                className={'m-2 opacity-80'}
                            onClick={() => {
                                const recordService = getServiceBySymbol<IRecordService>(IRecordService)
                                recordService.convertToGif(videoUrl, this.state.videoArgs).then((data: string) =>{
                                    const utilService = getServiceBySymbol<IUtilService>(IUtilService)
                                    utilService.showFileInFolder(data).then(() => utilService.askHideWin())
                                })
                            }}
                        >保存</Button>
                        <Button color={'gold'}
                                size={'1'}
                                className={'m-2 opacity-80'}
                                onClick={() => {
                                    const utilService: IUtilService = getServiceBySymbol(IUtilService)
                                    utilService.showFileInFolder(videoUrl).then()
                                }}
                        >打开所在目录</Button>
                        {/*<Button color={'gold'}*/}
                        {/*        size={'1'}*/}
                        {/*        className={'m-2 opacity-80'}*/}
                        {/*        onClick={() => {*/}
                        {/*            const fileService: IFileService = getServiceBySymbol(IFileService)*/}
                        {/*        }}*/}
                        {/*>删除(此文件)</Button>*/}

                    </Box>


                </Theme>
            </div>
        );
    }

}
