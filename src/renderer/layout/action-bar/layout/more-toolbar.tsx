import {Component} from "react";
import { IRecordContext, RecordContext} from "../../../common/global-context";
import * as Toolbar from "@radix-ui/react-toolbar";
import {ToolTipWrap} from "../../../components/radix-ui/tool-tip-wrap";
import {
    CircleCloseButtonToolbar, CursorIcon, DevIcon,
    FullCircleCloseButtonToolbar,
} from "../../../components/svgs";
import {Logger} from "../../../common/logger";
import {getServiceBySymbol} from "../../../../common/container/inject-container";
import {IUtilService} from "../../../../common/service";

interface MoreToolbarProps{
    className?: string;
}

interface MoreToolbarState{
    devClick: boolean
}

export class MoreToolbar extends Component<MoreToolbarProps, MoreToolbarState>{
    static contextType = RecordContext
    context: IRecordContext

    state: MoreToolbarState = {
        devClick: false
    }

    protected setPos(){
        const {setAllowPenetrate, setIsInActionBar, recording} = this.context
        Logger.info('>>> MoreToolbar setPos try setAllowPenetrate ', recording && true)
        recording && setAllowPenetrate(true)
        setIsInActionBar(false)
    }

    protected get _utilService(){
        return getServiceBySymbol<IUtilService>(IUtilService);
    }

    protected renderInDev(){
        const {devMode} = this.context
        if (!devMode) return undefined
        return (
            <>
                {/*<Toolbar.Separator className="toolbar-separator" />*/}
                {/*<ToolTipWrap title={"鼠标穿透"}>*/}
                {/*    <div className={`tool-every-button */}
                {/*        hover:bg-gray-200 hover:scale-95*/}
                {/*        ` + `${this.state.devClick ? ' opacity-100 ' : ' opacity-70 '}`*/}
                {/*    }*/}
                {/*         onClick={() => {*/}
                {/*             Logger.info('>>> MoreToolbar click ,')*/}

                {/*             this.context.setBarMode('none')*/}
                {/*             this.setPos()*/}
                {/*             this.setState((preState: MoreToolbarState, props) => {*/}
                {/*                 const curC = !preState.devClick*/}
                {/*                 this._utilService.setClickPenetrate(true).then()*/}
                {/*                 return {...preState, devClick: curC}*/}
                {/*             })*/}

                {/*         }}*/}
                {/*    >*/}
                {/*        <Toolbar.ToggleItem className="ToolbarToggleItem" value="target">*/}
                {/*            <CursorIcon />*/}
                {/*        </Toolbar.ToggleItem>*/}
                {/*    </div>*/}
                {/*</ToolTipWrap>*/}

                <Toolbar.Separator className="toolbar-separator" />
                <ToolTipWrap title={"打开开发者工具"}>
                    <div className={`tool-every-button 
                        opacity-70      
                        hover:bg-gray-200 hover:scale-95
                        `}
                         onClick={() => {
                             Logger.info('>>> MoreToolbar open dev tool')

                             this.context.setBarMode('none')
                             this.setPos()
                             this._utilService.askOpenDevTool().then();
                         }}
                    >
                        <Toolbar.ToggleItem className="ToolbarToggleItem" value="target">
                            <DevIcon />
                        </Toolbar.ToggleItem>
                    </div>
                </ToolTipWrap>
            </>

        )
    }

    render() {
        const {devMode} = this.context

        return <Toolbar.Root
            className={`${this.props.className} absolute bg-gray-50 rounded-full bottom-14 h-11  
                pl-2 pr-2 right-1 tool-sub-group-body
                
                `}
            aria-label="Cursor options"
            tabIndex={0}
        >
            <Toolbar.ToggleGroup
                type="single"
                className="flex items-center justify-center h-full"
                value={this.context.barMode}
                onValueChange={(value) => {
                    // if (value) {
                    //     this.context.setCursorMode(value)
                    // }
                    // this.context.setBarMode('none')
                }}
            >
                <ToolTipWrap title="关闭录制">
                    <div className={`tool-every-button 
                        ${this.context.blurView ? "tool-button-active" : "hover:bg-gray-200 hover:scale-95 "}
                        `}
                         onClick={() => {
                             Logger.info('>>> MoreToolbar close win')

                             this.context.setBarMode('none')
                             this.setPos()

                             this._utilService.askHideWin().then();

                         }}
                    >
                        <Toolbar.ToggleItem className="ToolbarToggleItem" value="none">
                            <CircleCloseButtonToolbar
                                className={"bg-green"}/>
                        </Toolbar.ToggleItem>
                    </div>
                </ToolTipWrap>
                <Toolbar.Separator className="toolbar-separator" />
                <ToolTipWrap title={"退出应用"}>
                    <div className={`tool-every-button 
                        hover:bg-gray-200 hover:scale-95
                        `}
                         onClick={() => {
                             Logger.info('>>> MoreToolbar quit app onValueChange')

                             this.context.setBarMode('none')
                             this.setPos()
                             this._utilService.askQuit().then();

                         }}
                    >
                        <Toolbar.ToggleItem className="ToolbarToggleItem" value="target">
                            <FullCircleCloseButtonToolbar />
                        </Toolbar.ToggleItem>
                    </div>
                </ToolTipWrap>

                {this.renderInDev()}

            </Toolbar.ToggleGroup>
        </Toolbar.Root>
    }
}
