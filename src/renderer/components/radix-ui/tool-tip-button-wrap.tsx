import {Component, ReactNode} from "react";
import * as Toolbar from '@radix-ui/react-toolbar';
import {ToolTipWrap} from "./tool-tip-wrap";
import {IRecordContext, RecordContext} from "../../common/global-context";

interface ToolTipProps {
    // 用key保证diff算法生效
    key?: string | boolean;

    title?: string;
    children?: ReactNode;
    buttonClassName?: string;
    buttonMouseDownHandler?: () => void;
    buttonClickHandler?: () => void;
    buttonDisable?: boolean
}

export class ToolTipButtonWrap extends Component<ToolTipProps, any> {
    static contextType = RecordContext
    context: IRecordContext

    constructor(props: ToolTipProps) {
        super(props);
    }

    render() {

        const _disable = this.props.buttonDisable ?? false;
        return (
            <ToolTipWrap title={this.props.title ?? ""}>
                <Toolbar.Button
                    className={(this.props.buttonClassName ?? "") + ` tool-every-button
                        hover:bg-gray-200 hover:scale-95 
                        ${_disable ? "cursor-not-allowed" : ""}
                        `}
                    onMouseDown={() => this.props?.buttonMouseDownHandler?.()}
                    onClick={() => !_disable && this.props.buttonClickHandler?.()}
                    disabled={_disable}
                >
                    {this.props.children}
                </Toolbar.Button>
            </ToolTipWrap>
        );
    }
}
