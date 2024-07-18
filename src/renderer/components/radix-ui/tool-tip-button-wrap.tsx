import {Component, ReactNode} from "react";
import {Content, Trigger, Portal, Arrow, Provider } from '@radix-ui/react-tooltip';
import {Root, Button, Separator, ToggleGroup, } from '@radix-ui/react-toolbar';
import {CloseButtonToolbar} from "../svgs";
import {ToolTipWrap} from "./tool-tip-wrap";

interface ToolTipProps {
    title?: string;
    children?: ReactNode;
    buttonClassName?: string;
    buttonMouseDownHandler?: () => void;
}

export class ToolTipButtonWrap extends Component<ToolTipProps, any> {

    _props: ToolTipProps;

    constructor(props: ToolTipProps) {
        super(props);

        this._props = props;
    }

    render() {
        return (
            <ToolTipWrap title={this._props.title}>
                <Button
                    className={this._props.buttonClassName + ` size-8 content-center justify-center 
                        flex items-center rounded-full tool-button 
                        hover:bg-gray-200 hover:scale-95 active:bg-blue-100`}
                    onMouseDown={() => this._props?.buttonMouseDownHandler?.()}
                >
                    {this._props.children}
                </Button>
            </ToolTipWrap>
        );
    }
}
