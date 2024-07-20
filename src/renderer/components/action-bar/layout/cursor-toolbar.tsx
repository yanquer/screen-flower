import {Component} from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import {CursorIcon, HighlightCursorIcon, SpotlightCursorIcon, TargetCursorIcon} from "../../svgs";
import {CursorMode, IRecordContext, RecordContext} from "../../../common/global-context";
import {ToolTipWrap} from "../../radix-ui/tool-tip-wrap";


export class CursorToolbar extends Component<any, any>{
    static contextType = RecordContext
    context: IRecordContext

    render() {
        return <Toolbar.Root
            className={`absolute bg-gray-50 rounded-full bottom-14 h-11  
                pl-2 pr-2 right-0 tool-sub-group-body`}
            aria-label="Cursor options"
            tabIndex={0}
        >
            <Toolbar.ToggleGroup
                type="single"
                className="flex items-center justify-center h-full"
                value={this.context.cursorMode}
                onValueChange={(value: CursorMode) => {
                    if (value) {
                        this.context.setCursorMode(value)
                    }
                    this.context.setBarMode('none')
                }}
            >
                <ToolTipWrap title="默认光标">
                    <div className={`tool-every-button 
                        ${this.context.cursorMode === 'none' ? "tool-button-active" : "hover:bg-gray-200 hover:scale-95 "}
                        `}
                    >
                        <Toolbar.ToggleItem className="ToolbarToggleItem" value="none">
                            <CursorIcon />
                        </Toolbar.ToggleItem>
                    </div>
                </ToolTipWrap>
                <Toolbar.Separator className="toolbar-separator" />
                <ToolTipWrap title={"突出显示点击"}>
                    <div className={`tool-every-button 
                        ${this.context.cursorMode === 'target' ? "tool-button-active" : "hover:bg-gray-200 hover:scale-95"}
                        `}
                    >
                        <Toolbar.ToggleItem className="ToolbarToggleItem" value="target">
                            <TargetCursorIcon />
                        </Toolbar.ToggleItem>
                    </div>
                </ToolTipWrap>
                <ToolTipWrap title={"突出显示光标"}>
                    <div className={`tool-every-button 
                        ${this.context.cursorMode === 'highlight' ? "tool-button-active" : "hover:bg-gray-200 hover:scale-95"}
                        `}
                    >
                        <Toolbar.ToggleItem className="ToolbarToggleItem" value="highlight">
                            <HighlightCursorIcon />
                        </Toolbar.ToggleItem>
                    </div>
                </ToolTipWrap>
                <ToolTipWrap title={"聚焦光标"}>
                    <div className={`tool-every-button 
                        ${this.context.cursorMode === 'spotlight' ? "tool-button-active" : "hover:bg-gray-200 hover:scale-95"}
                        `}
                    >
                        <Toolbar.ToggleItem className="ToolbarToggleItem" value="spotlight">
                            <SpotlightCursorIcon />
                        </Toolbar.ToggleItem>
                    </div>
                </ToolTipWrap>
            </Toolbar.ToggleGroup>
        </Toolbar.Root>
    }
}