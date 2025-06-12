import {Component} from "react";
import {Theme, Button, Flex, Box} from "@radix-ui/themes";
import {invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "@yanquer/common";
import {BlurBgBox, DragTitle, FormItemCheckbox, FormItemInputTextWithBtn, PageBox} from "@yanquer/browser";
import {ISettingService, IUtilService} from "../../common/service";
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

        return <Flex
            justify={"center"}
            overflow={"hidden"}
            className={'w-screen h-screen items-center rounded-xl'}>
            <Theme appearance={'dark'}
                   className={"w-[400px]  rounded-xl"}
            >
                <BlurBgBox
                    defaultImg={"/images/bg.png"}
                    className={"w-screen h-screen"}
                >
                    <PageBox className={"p-2"}>
                        <DragTitle title={'设置'}/>
                        <Flex gap="3"
                              direction={"column"}
                              className="bg-gray-800-35 p-4 rounded-lg"
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

                            <FormItemInputTextWithBtn
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

                            <FormItemInputTextWithBtn
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
                    </PageBox>
                </BlurBgBox>

            </Theme>
        </Flex>


    }
}
