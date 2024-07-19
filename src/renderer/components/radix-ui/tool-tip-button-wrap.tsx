import {Component, ReactNode} from "react";
import {Root, Button, Separator, ToggleGroup, } from '@radix-ui/react-toolbar';
import {ToolTipWrap} from "./tool-tip-wrap";

interface ToolTipProps {
    // 用key保证diff算法生效
    key?: string | boolean;

    title?: string;
    children?: ReactNode;
    buttonClassName?: string;
    buttonMouseDownHandler?: () => void;
    buttonClickHandler?: () => void;
}

export class ToolTipButtonWrap extends Component<ToolTipProps, any> {

    constructor(props: ToolTipProps) {
        super(props);
    }

    render() {
        return (
            <ToolTipWrap title={this.props.title}>
                <Button
                    className={this.props.buttonClassName + ` size-8 content-center justify-center 
                        flex items-center rounded-full tool-button 
                        hover:bg-gray-200 hover:scale-95 active:bg-blue-100`}
                    onMouseDown={() => this.props?.buttonMouseDownHandler?.()}
                    onClick={() => this.props.buttonClickHandler?.()}
                >
                    {this.props.children}
                </Button>
            </ToolTipWrap>
        );
    }
}
