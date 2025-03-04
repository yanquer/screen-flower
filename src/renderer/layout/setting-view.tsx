import {Component} from "react";
import {Box, TextField, Text, Checkbox, Theme, Grid, Button} from "@radix-ui/themes";
import {IRecordContext, RecordContext} from "../common/global-context";
import {ToolTipWrap} from "../components/radix-ui/tool-tip-wrap";
import {invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {ISettingService, IUtilService} from "../../common/service";
import {DragTitle} from "../components/drag-title";
import {Logger} from "../common/logger";

interface SettingViewStates {
    showDock: boolean
    cachePath: string
    logPath: string
}

export class SettingView extends Component<any, SettingViewStates>{
    // static contextType = RecordContext
    // context: IRecordContext

    state = {
        // showDock: false,
        // cachePath: "",
        // logPath: "",
        showDock: false,
        cachePath: "~/screen-recorder",
        logPath: "~/Log",
    }
    protected setShowDock(showDock: boolean){
        this.setState({showDock})
    }
    protected setCachePath(cachePath: string){
        this.setState({cachePath})
    }
    protected setLogPath(logPath: string){
        this.setState({logPath})
    }

    protected initData(){
        invokeElectronHandlerAsync(async () => {
            const setService = getServiceBySymbol<ISettingService>(ISettingService)
            this.setCachePath(await setService.getCachePath())
            this.setLogPath(await setService.getLogPath())
            const showDock = await setService.getDockShow()
            Logger.info(`>> showDock: ${showDock}`)
            this.setShowDock(showDock)
        }).then()
    }

    componentDidMount() {
        this.initData()
    }

    protected buildButton(text: string, clickEvent: () => void){
        return <Button size={'1'} color={'bronze'}
                       className={'mr-1'}
                       onClick={() => clickEvent()}
        >{text}</Button>
    }
    protected openButton(openUrl: string) {
        return this.buildButton("打开", () => {
            invokeElectronHandlerAsync(async () => {
                const utilService = getServiceBySymbol<IUtilService>(IUtilService)
                await utilService.showFileInFolder(openUrl)
            }).then()
        })
    }

    render() {
        return (<div className={'w-screen h-screen flex items-center justify-center overflow-hidden bg-gray-500'}>
            <Theme appearance={'dark'}
                className={"p-4 pt-1 bg-gray-800 w-[400px]"}
            >
                <DragTitle title={'设置'}/>
                <Grid columns={"2"} gap="3"
                    className="bg-gray-700 p-4 rounded-lg"
                >

                    {/* row1 */}
                    <Box>
                        <Text as="label" size="2">显示dock栏</Text>
                    </Box>

                    {/*<Box>*/}
                    {/*</Box>*/}

                    <Box>
                        <Checkbox defaultChecked={false} color={'bronze'}
                                  checked={this.state.showDock}
                                  onClick={(e) => {
                                      // setShowDock((pre) => !pre)
                                      const checked = !this.state.showDock
                                      Logger.debug(`显示dock栏 checked: ${checked}`)
                                      const setService: ISettingService = getServiceBySymbol(ISettingService);
                                      setService.setDockShow(checked).then()
                                      this.setShowDock(checked)
                                  }}
                        />
                    </Box>

                    {/* row2 */}
                    <Box>
                        <Text as="label" size="2">录制缓存</Text>
                    </Box>
                    <Box>
                        {this.buildButton("选择", () => {
                            const setService: ISettingService = getServiceBySymbol(ISettingService);
                            setService.setOrSelectCachePath().then(
                                (retPath) => retPath && this.setCachePath(retPath)
                            )
                        })}
                        {this.openButton(this.state.cachePath)}
                    </Box>

                    {/* row2 - text */}
                    <Box gridColumn={"1 / span 2"}>
                        <ToolTipWrap title={this.state.cachePath} key={this.state.cachePath}>
                            <TextField.Root
                                size="1"
                                // placeholder="…"
                                readOnly={true}
                                // className={'overflow-x-auto overscroll-contain sm-scroll-bar'}
                                className={'text-nowrap overflow-x-auto sm-scroll-bar'}
                                value={this.state.cachePath}
                            >
                            </TextField.Root>
                        </ToolTipWrap>
                    </Box>

                    <Box/>

                    {/* row3 */}
                    <Box gridColumnStart={"1"}>
                        <Text as="label" size="2">日志</Text>
                    </Box>
                    <Box>
                        {this.openButton(this.state.logPath)}
                    </Box>

                    {/* row3 - text */}
                    <Box gridColumn={"1 / span 2"}>
                        <ToolTipWrap title={this.state.logPath} key={this.state.logPath}>
                            <TextField.Root size="1"
                                            // placeholder="…"
                                            readOnly={true}
                                            className={'overflow-x-auto overscroll-contain sm-scroll-bar'}
                                            value={this.state.logPath}
                            >
                                {/*    if icon*/}
                            </TextField.Root>
                        </ToolTipWrap>
                    </Box>

                </Grid>
            </Theme>
        </div>)
    }
}
