import {Component, createRef} from "react";
import {Rnd} from "react-rnd";
import { Flex, Text,  } from '@radix-ui/themes';
import {Root, Button, Separator, ToggleGroup, } from '@radix-ui/react-toolbar';
import {
    BlurIcon, CameraIcon,
    CloseButtonToolbar, CursorIcon,
    DiscardIcon,
    DrawIcon,
    GrabIcon, HighlightCursorIcon, MicIcon,
    PauseIcon,
    RestartIcon,
    ResumeIcon, SpotlightCursorIcon,
    StopIcon, TargetCursorIcon
} from "./svgs";

// @ts-ignore
import {toolbarSeparator, toolbarButton} from "../styles/components/action-tool-bar.module.scss"
import {ToolTipButtonWrap} from "./radix-ui/tool-tip-button-wrap";
import {IRecordContext, RecordContext} from "../common/global-context";

enum CursorMode{
    "none",
    "target",
    "highlight",
    "spotlight" ,
}

interface ActionToolBarState {
    canDrag: boolean,
    x: number,
    y: number,
    openDraw: boolean,
    openBlur: boolean,
    pause: boolean,
    cursorMode: CursorMode,
}

export class ActionToolBar extends Component<any, ActionToolBarState>{
    static contextType = RecordContext
    context: IRecordContext

    state = {
        canDrag: false,
        x: 200,
        y: 500,
        openDraw: false,
        openBlur: false,
        pause: false,
        cursorMode: CursorMode.none,
    }

    protected setCanDrag(can: boolean){this.setState({canDrag: can});}
    protected handleDocMouseUp(){this.setCanDrag(false)}
    protected addDocMouseUp(){document.addEventListener('mouseup', this.handleDocMouseUp.bind(this));}
    protected removeDocMouseUp(){document.removeEventListener('mouseup', this.handleDocMouseUp.bind(this));}

    componentDidMount() {
        this.addDocMouseUp()
    }

    componentWillUnmount() {
        this.removeDocMouseUp();
    }

    protected renderCloseTool(){
        return (
            <ToolTipButtonWrap title={"关闭"}>
                <CloseButtonToolbar/>
            </ToolTipButtonWrap>
        )
    }

    protected renderCursorModeIcon(){
        switch (this.state.cursorMode){
            case CursorMode.target:
                return <TargetCursorIcon/>
            case CursorMode.highlight:
                return <HighlightCursorIcon />
            case CursorMode.spotlight:
                return <SpotlightCursorIcon />
            case CursorMode.none:
                return <CursorIcon />
            default:
                return <CursorIcon />
        }
    }

    render() {
        const buttonCanUseClass = this.context.recording ? "" : " cursor-not-allowed "

        return (
            <div className={"bg-white"}>
                <Rnd
                    // className={"fixed"}
                    // default={{x: 200, y: 500, width: 400, height: 50}}
                    position={{x: this.state.x, y: this.state.y}}
                    enableResizing={false}
                    bounds={"window"}
                    dragAxis={this.state.canDrag ? "both" : "none"}
                    onDragStop={(e, d) => this.setState({x: d.x, y: d.y})}
                >
                    <div className={"bg-white rounded-full cursor-auto pl-2 pr-2 " +
                        (this.state.canDrag ? "scale-105" : "")}
                    >
                        <Root className={"h-12"}>
                            <Flex className={'h-full'} direction="row"
                                  align={"center"} justify={"center"}
                                  gap="1px"
                            >
                                <div>
                                    <ToolTipButtonWrap
                                        title={"拖动"}
                                        buttonClassName={`${toolbarButton}`}
                                        buttonMouseDownHandler={() => this.setCanDrag(true)}
                                    >
                                        <GrabIcon/>
                                    </ToolTipButtonWrap>
                                </div>

                                <Separator className={toolbarSeparator}/>

                                <Flex
                                    className={'bg-gray-100 p-1 rounded-full'}
                                    direction={"row"} gap={"8px"}>
                                    <div>
                                        <ToolTipButtonWrap
                                            title={"结束录制"}
                                            buttonClassName={`${toolbarButton} ${buttonCanUseClass}`}
                                        >
                                            <StopIcon width="20" height="20"/>
                                        </ToolTipButtonWrap>
                                    </div>
                                    <div className="ToolbarRecordingTime">
                                        {/*{timestamp}*/}
                                    </div>

                                    <ToolTipButtonWrap
                                        title={"重新开始录制"}
                                        buttonClassName={`${toolbarButton} ${buttonCanUseClass}`}
                                    >
                                        <RestartIcon/>
                                    </ToolTipButtonWrap>

                                    <div>
                                        {!this.state.pause ? (
                                            <ToolTipButtonWrap
                                                title={"暂停录制"}
                                                buttonClassName={`${toolbarButton} ${buttonCanUseClass}`}
                                            >
                                                <PauseIcon/>
                                            </ToolTipButtonWrap>
                                        ) : (
                                            <ToolTipButtonWrap
                                                title={"继续录制"}
                                                buttonClassName={`${toolbarButton} ${buttonCanUseClass}`}
                                            >
                                                <ResumeIcon/>
                                            </ToolTipButtonWrap>
                                        )}

                                    </div>
                                    <div>
                                        <ToolTipButtonWrap
                                            title={"取消录制"}
                                            buttonClassName={`${toolbarButton} ${buttonCanUseClass}`}
                                        >
                                            <DiscardIcon/>
                                        </ToolTipButtonWrap>

                                    </div>
                                </Flex>

                                <Separator className={toolbarSeparator}/>

                                <div>
                                    {this.state.openDraw ? (
                                        this.renderCloseTool()
                                    ) : (
                                        <ToolTipButtonWrap
                                            title={"切换绘图工具"}
                                            buttonClassName={`${toolbarButton}`}
                                        >
                                            <DrawIcon/>
                                        </ToolTipButtonWrap>
                                    )}

                                </div>

                                <div>
                                    {this.state.openBlur ? (
                                        this.renderCloseTool()
                                    ) : (
                                        <ToolTipButtonWrap
                                            title={"切换模糊工具"}
                                            buttonClassName={`${toolbarButton}`}
                                        >
                                            <BlurIcon/>
                                        </ToolTipButtonWrap>
                                    )}
                                </div>

                                <div>
                                    <ToolTipButtonWrap
                                        title={"切换光标选项"}
                                        buttonClassName={`${toolbarButton}`}
                                    >
                                        {this.renderCursorModeIcon()}
                                    </ToolTipButtonWrap>

                                </div>

                                <Separator className={toolbarSeparator}/>

                                <div>
                                    <ToolTipButtonWrap
                                        title={"打开麦克风"}
                                        buttonClassName={`${toolbarButton}`}
                                    >
                                        <MicIcon/>
                                    </ToolTipButtonWrap>

                                </div>
                                <div>
                                    <ToolTipButtonWrap
                                        title={"打开摄像头"}
                                        buttonClassName={`${toolbarButton}`}
                                    >
                                        <CameraIcon/>
                                    </ToolTipButtonWrap>

                                </div>

                            </Flex>
                        </Root>
                    </div>
                </Rnd>
            </div>
        )
    }
}
