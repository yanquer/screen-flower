import {Component} from "react";
import { IRecordContext, RecordContext} from "../../../common/global-context";
import * as Toolbar from "@radix-ui/react-toolbar";
import {ToolTipWrap} from "../../radix-ui/tool-tip-wrap";
import {
    TransformIcon,
    TrashIcon
} from "../../svgs";
import {Logger} from "../../../common/logger";

interface BlurToolbarProps{
    className?: string;
}

export class BlurToolbar extends Component<BlurToolbarProps, any>{
    static contextType = RecordContext
    context: IRecordContext

    protected setPos(){
        const {setAllowPenetrate, setIsInActionBar, recording} = this.context
        Logger.info('>>> setPos try setAllowPenetrate ', recording && true)
        recording && setAllowPenetrate(true)
        setIsInActionBar(false)
    }

    render() {
        return <Toolbar.Root
            className={`${this.props.className} absolute bg-gray-50 rounded-full bottom-14 h-11  
                pl-2 pr-2 right-0 tool-sub-group-body`}
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
                <ToolTipWrap title="录制区域模糊">
                    <div className={`tool-every-button 
                        ${this.context.blurView ? "tool-button-active" : "hover:bg-gray-200 hover:scale-95 "}
                        `}
                         onClick={() => {
                             Logger.info('>>> blur onValueChange', true)

                             this.context.setBlurView(true)
                             this.context.setBarMode('none')
                             this.setPos()

                         }}
                    >
                        <Toolbar.ToggleItem className="ToolbarToggleItem" value="none">
                            <TransformIcon />
                        </Toolbar.ToggleItem>
                    </div>
                </ToolTipWrap>
                <Toolbar.Separator className="toolbar-separator" />
                <ToolTipWrap title={"清理"}>
                    <div className={`tool-every-button 
                        hover:bg-gray-200 hover:scale-95
                        `}
                         onClick={() => {
                             Logger.info('>>> blur onValueChange', true)

                             this.context.setBarMode('none')
                             this.context.setBlurView(false)

                             this.setPos()

                         }}
                    >
                        <Toolbar.ToggleItem className="ToolbarToggleItem" value="target">
                            <TrashIcon />
                        </Toolbar.ToggleItem>
                    </div>
                </ToolTipWrap>

            </Toolbar.ToggleGroup>
        </Toolbar.Root>
    }
}
