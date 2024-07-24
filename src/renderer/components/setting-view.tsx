import {Component} from "react";
import {Box, Flex, TextField, Text, Checkbox, Theme, Grid, Button} from "@radix-ui/themes";
import {IRecordContext, RecordContext} from "../common/global-context";
import {ToolTipWrap} from "./radix-ui/tool-tip-wrap";
import {invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IUtilService} from "../../common/service";


export class SettingView extends Component<any, any>{
    static contextType = RecordContext
    context: IRecordContext

    render() {
        const {logPath, cachePath, setLogPath, setCachePath, setShowDock} = this.context
        return (<div className={'w-screen h-screen flex items-center justify-center overflow-hidden bg-gray-500'}>
            <Theme appearance={'dark'}
                className={"p-4 pt-10 bg-gray-800"}
            >
                <Grid columns={"3"} gap="3"
                    className="bg-gray-700 p-4 rounded-lg"
                >

                    <Box>
                        <Text as="label" size="2">显示dock栏</Text>
                    </Box>
                    <Box>

                    </Box>
                    <Box>
                        <Checkbox defaultChecked={false} color={'bronze'}
                                  onClick={(e) => {
                                      setShowDock((pre) => !pre)
                                  }}
                        />
                    </Box>

                    <Box>
                        <Text as="label" size="2">录制缓存</Text>
                    </Box>
                    <Box>
                        <ToolTipWrap title={cachePath} key={cachePath}>
                            <TextField.Root
                                size="1" placeholder="…" readOnly={true}
                                className={'overflow-x-auto overscroll-contain sm-scroll-bar'}
                            >
                                {cachePath}
                            </TextField.Root>
                        </ToolTipWrap>
                    </Box>
                    <Box>
                        <Button size={'1'} color={'bronze'}>选择文件夹</Button>
                    </Box>

                    <Box>
                        <Text as="label" size="2">日志</Text>
                    </Box>
                    <Box>
                        <ToolTipWrap title={logPath} key={logPath}>
                            <TextField.Root size="1" placeholder="…" readOnly={true}
                                            className={'overflow-x-auto overscroll-contain sm-scroll-bar'}
                            >
                                {logPath}
                            </TextField.Root>
                        </ToolTipWrap>
                    </Box>
                    <Box>
                        <Button size={'1'} color={'bronze'}
                            onClick={() => {
                                invokeElectronHandlerAsync(async () => {
                                    const utilService = getServiceBySymbol<IUtilService>(IUtilService)
                                    await utilService.showFileInFolder(logPath)
                                }).then()
                            }}
                        >打开</Button>
                    </Box>

                </Grid>
            </Theme>
        </div>)
    }
}
