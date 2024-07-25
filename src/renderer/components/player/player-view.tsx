import {Component} from "react";
import {Box, Flex, TextField, Text, Checkbox, Theme, Grid, Button,
    Select,
} from "@radix-ui/themes";
import {VideoPlayer} from "./video-player";
import {DragTitle} from "../drag-title";
import {getServiceBySymbol} from "../../../common/container/inject-container";
import {IFileService, IRecordService, IUtilService} from "../../../common/service";
import {IRecordContext, RecordContext} from "../../common/global-context";


export class PlayerView extends Component<any, any>{

    static contextType = RecordContext
    context: IRecordContext

    state = {
        titleShow: true
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
                        <DragTitle title={'Player'}/>
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
                            <Text size={'2'} className={'pr-2'} >文件类型</Text>
                            <Box className={'ml-2 mr-2'} >
                                <Select.Root
                                    size={'1'}
                                    defaultValue="gif">
                                    <Select.Trigger />
                                    <Select.Content
                                        // className={'m-2'}
                                    >
                                        <Select.Group>
                                            <Select.Label>Vide Target</Select.Label>
                                            <Select.Item value="gif">Gif</Select.Item>
                                            <Select.Item value="mp4" disabled>
                                                MP4
                                            </Select.Item>
                                        </Select.Group>
                                        {/*<Select.Separator />*/}
                                        {/*<Select.Group>*/}
                                        {/*    <Select.Label>Vide Size</Select.Label>*/}
                                        {/*    <Select.Item value="HD">1920 x 1080</Select.Item>*/}
                                        {/*</Select.Group>*/}
                                    </Select.Content>
                                </Select.Root>
                            </Box>

                            <Box className={'ml-2 mr-2'}  >

                                <Select.Root
                                    size={'1'}
                                    defaultValue="origin">
                                    <Select.Trigger />
                                    <Select.Content>
                                        <Select.Group>
                                            <Select.Label>视频尺寸</Select.Label>
                                            <Select.Item value="origin">原始</Select.Item>
                                            <Select.Item value="HD" disabled={true}>1920 x 1080</Select.Item>
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </Box>
                        </Box>

                        <Button color={'gold'}
                                size={'1'}
                                className={'m-2 opacity-80'}
                            onClick={() => {
                                const recordService = getServiceBySymbol<IRecordService>(IRecordService)
                                recordService.convertToGif(videoUrl).then((data: string) =>{
                                    const utilService = getServiceBySymbol<IUtilService>(IUtilService)
                                    utilService.showFileInFolder(data).then(() => utilService.askHideWin())
                                })
                            }}
                        >保存</Button>
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
