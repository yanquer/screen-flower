import {Component} from "react";
import {Box, TextField, Text, Checkbox, Theme, Grid, Button, Flex} from "@radix-ui/themes";
import {IRecordContext, RecordContext} from "../common/global-context";
import {ToolTipWrap} from "../components/radix-ui/tool-tip-wrap";
import {invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {ISettingService, IUtilService} from "../../common/service";
import {DragTitle} from "../components/drag-title";
import {Logger} from "../common/logger";
import {FormItemInputText} from "../components/radix-ui/form/form-item-input-text";
import {FormItemCheckbox} from "../components/radix-ui/form/form-item-checkbox";

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
                <Flex gap="3"
                      direction={"column"}
                    className="bg-gray-700 p-4 rounded-lg"
                >


                    <FormItemCheckbox
                        label={"显示dock栏"}
                        value={this.state.showDock}
                        clickEvent={(val: boolean) => {
                            Logger.debug(`显示dock栏 checked: ${val}`)
                            const setService: ISettingService = getServiceBySymbol(ISettingService);
                            setService.setDockShow(val).then()
                            this.setShowDock(val)
                        }}
                    />

                    <FormItemInputText
                        label={"录制缓存"}
                        value={this.state.cachePath}
                        buttons={[
                            {name: "打开", clickEvent: () => {
                                    invokeElectronHandlerAsync(async () => {
                                        const utilService = getServiceBySymbol<IUtilService>(IUtilService)
                                        await utilService.showFileInFolder(this.state.cachePath)
                                    }).then()
                                }},
                            {name: "选择", clickEvent: () => {
                                    const setService: ISettingService = getServiceBySymbol(ISettingService);
                                    setService.setOrSelectCachePath().then(
                                        (retPath) => retPath && this.setCachePath(retPath)
                                    )
                                }},
                        ]}
                    />

                    <FormItemInputText
                        label={"日志"}
                        value={this.state.logPath}
                        buttons={[
                            {name: "打开", clickEvent: () => {
                                    invokeElectronHandlerAsync(async () => {
                                        const utilService = getServiceBySymbol<IUtilService>(IUtilService)
                                        await utilService.showFileInFolder(this.state.logPath)
                                    }).then()
                                }},
                        ]}
                    />

                </Flex>
            </Theme>
        </div>)
    }
}
