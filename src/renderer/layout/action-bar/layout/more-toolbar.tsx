import {Component} from "react";
import { IRecordContext, RecordContext} from "../../../common/global-context";
import * as Toolbar from "@radix-ui/react-toolbar";
import {ToolTipWrap} from "../../../components/radix-ui/tool-tip-wrap";
import {
    CircleCloseButtonToolbar,
    FullCircleCloseButtonToolbar,
} from "../../../components/svgs";
import {Logger} from "../../../common/logger";
import {getServiceBySymbol} from "../../../../common/container/inject-container";
import {IUtilService} from "../../../../common/service";

interface MoreToolbarProps{
    className?: string;
}

export class MoreToolbar extends Component<MoreToolbarProps, any>{
    static contextType = RecordContext
    context: IRecordContext

    protected setPos(){
        const {setAllowPenetrate, setIsInActionBar, recording} = this.context
        Logger.info('>>> MoreToolbar setPos try setAllowPenetrate ', recording && true)
        recording && setAllowPenetrate(true)
        setIsInActionBar(false)
    }

    protected get _utilService(){
        return getServiceBySymbol<IUtilService>(IUtilService);
    }

    render() {
        return <Toolbar.Root
            className={`${this.props.className} absolute bg-gray-50 rounded-full bottom-14 h-11  
                pl-2 pr-2 right-1 tool-sub-group-body`}
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
                        opacity-70 
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
                        opacity-70      
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

            </Toolbar.ToggleGroup>
        </Toolbar.Root>
    }
}
