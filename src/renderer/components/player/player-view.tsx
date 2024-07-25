import {Component} from "react";
import {Box, Flex, TextField, Text, Checkbox, Theme, Grid, Button} from "@radix-ui/themes";
import {VideoPlayer} from "./video-player";
import {DragTitle} from "../drag-title";
import {getServiceBySymbol} from "../../../common/container/inject-container";
import {IUtilService} from "../../../common/service";
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

                    <Box className={'p-1'}>
                        <Button className={'m-2'} onClick={
                            async () => {
                                const utilService = getServiceBySymbol<IUtilService>(IUtilService)
                                const fileName: string = await utilService.askSelectAVideoFile() as string
                                if (fileName) setVideoUrl(fileName)
                            }
                        }>打开其他文件</Button>
                        <Button className={'m-2'}>另存为</Button>
                    </Box>
                </Theme>
            </div>
        );
    }

}
