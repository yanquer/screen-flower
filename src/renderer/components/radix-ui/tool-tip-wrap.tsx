import {Component, ReactNode} from "react";
import {Content, Trigger, Portal, Arrow, Provider, Root } from '@radix-ui/react-tooltip';

interface ToolTipProps {
    title?: string;
    children?: ReactNode;
}

export class ToolTipWrap extends Component<ToolTipProps, any> {

    _props: ToolTipProps;

    constructor(props: ToolTipProps) {
        super(props);

        this._props = props;
    }

    render() {
        return (
            <Provider>
                <Root>

                    <Trigger
                        asChild
                        className={"size-8 content-center justify-center flex items-center rounded-full tool-button"}>
                        {this._props.children}
                    </Trigger>

                    <Portal>
                        <Content className="TooltipContent" sideOffset={5}>
                            {this._props.title}
                            <Arrow className="TooltipArrow" />
                        </Content>
                    </Portal>
                </Root>
            </Provider>
        );
    }
}
