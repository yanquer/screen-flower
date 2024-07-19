import {Component, ReactNode} from "react";
import {Content, Trigger, Portal, Arrow, Provider, Root } from '@radix-ui/react-tooltip';

// @ts-ignore
import {tooltipContent} from '../../styles/components/radix-ui/tool-tip-wrap.module.scss'

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

                    <Trigger asChild>
                        {this._props.children}
                    </Trigger>

                    <Portal>
                        <Content
                            className={`rounded-full text-xs 
                                pl-4 pr-4 pt-2.5 pb-2.5 
                                mb-2.5 bg-gray-900
                                bottom-24 leading-none z-50 text-white select-none 
                                transition transition-opacity ease-in-out delay-150
                                will-change-transform
                                ${tooltipContent}
                                `}
                            sideOffset={5}
                        >
                            {this._props.title}
                            <Arrow className="TooltipArrow" />
                        </Content>
                    </Portal>
                </Root>
            </Provider>
        );
    }
}
