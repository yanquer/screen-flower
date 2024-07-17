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
import {ToolTipWrap} from "./radix-ui/tool-tip-wrap";

export class ActionToolBar extends Component<any, any>{

    state: {
        canDrag: boolean,
        x: number,
        y: number,
        openDraw: boolean,
        openBlur: boolean,
        pause: boolean,
        cursorMode: "target" | "highlight" | "spotlight" | "none",
    } = {
        canDrag: false,
        x: 200,
        y: 500,
        openDraw: false,
        openBlur: false,
        pause: false,
        cursorMode: "none",
    }

    protected boxRef = createRef<HTMLDivElement | undefined>();

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
            <ToolTipWrap title={"关闭"}>
                <Button>
                    <CloseButtonToolbar/>
                </Button>
            </ToolTipWrap>
        )
    }

    protected renderCursorModeIcon(){
        switch (this.state.cursorMode){
            case "target":
                return <TargetCursorIcon/>
            case "highlight":
                return <HighlightCursorIcon />
            case "spotlight":
                return <SpotlightCursorIcon />
            case "none":
                return <CursorIcon />
            default:
                return <CursorIcon />
        }
    }

    render() {
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
                    <div className={"bg-white rounded-full cursor-auto " + (this.state.canDrag ? "scale-105" : "")} ref={this.boxRef}>
                        <Root className={"h-12"}>
                            <Flex className={'h-full'} direction="row"
                                  align={"center"} justify={"center"}
                                  gap="8px"
                            >
                                <div>
                                    <ToolTipWrap title={"拖动"}>
                                        <Button
                                            className={`${toolbarButton}`}
                                            onMouseDown={() => this.setCanDrag(true)}
                                        ><GrabIcon/></Button>
                                    </ToolTipWrap>
                                </div>

                                <Separator className={toolbarSeparator}/>

                                <Flex direction={"row"} gap={"8px"}>
                                    <div>
                                        <ToolTipWrap title={"结束录制"}>
                                            <Button
                                            className={`${toolbarButton}`}

                                            >
                                                <StopIcon width="20" height="20"/>
                                            </Button>
                                        </ToolTipWrap>
                                    </div>
                                    <div className="ToolbarRecordingTime">
                                        {/*{timestamp}*/}
                                    </div>
                                    <ToolTipWrap title={"重新开始录制"}>
                                        <div>
                                            <Button
                                            className={`${toolbarButton}`}

                                            >
                                                <RestartIcon/>
                                            </Button>
                                        </div>
                                    </ToolTipWrap>
                                    <div>
                                        {!this.state.pause ? (
                                            <ToolTipWrap title={"暂停录制"}>
                                                <Button
                                            className={`${toolbarButton}`}

                                                >
                                                    <PauseIcon/>
                                                </Button>
                                            </ToolTipWrap>
                                        ) : (
                                            <ToolTipWrap title={"继续录制"}>
                                                <Button
                                            className={`${toolbarButton}`}

                                                >
                                                    <ResumeIcon/>
                                                </Button>
                                            </ToolTipWrap>
                                        )}

                                    </div>
                                    <div>
                                        <ToolTipWrap title={"取消录制"}>
                                            <Button
                                            className={`${toolbarButton}`}

                                            >
                                                <DiscardIcon/>
                                            </Button>
                                        </ToolTipWrap>
                                    </div>
                                </Flex>

                                <Separator className={toolbarSeparator}/>

                                <div>
                                    {this.state.openDraw ? (
                                        this.renderCloseTool()
                                    ) : (
                                        <ToolTipWrap title={"切换绘图工具"}>
                                            <Button
                                            className={`${toolbarButton}`}>
                                                <DrawIcon/>
                                            </Button>
                                        </ToolTipWrap>
                                    )}

                                </div>

                                <div>
                                    {this.state.openBlur ? (
                                        this.renderCloseTool()
                                    ) : (
                                        <ToolTipWrap title={"切换模糊工具"}>
                                            <Button
                                            className={`${toolbarButton}`}>
                                                <BlurIcon/>
                                            </Button>
                                        </ToolTipWrap>
                                    )}
                                </div>

                                <div>
                                    <ToolTipWrap title={"切换光标选项"}>
                                        <Button
                                            className={`${toolbarButton}`}>
                                            {this.renderCursorModeIcon()}
                                        </Button>
                                    </ToolTipWrap>
                                </div>

                                <Separator className={toolbarSeparator}/>

                                <div>
                                    <ToolTipWrap title={"打开麦克风"}>
                                        <Button
                                            className={`${toolbarButton}`}>
                                            <MicIcon/>
                                        </Button>
                                    </ToolTipWrap>
                                </div>
                                <div>
                                    <ToolTipWrap title={"打开摄像头"}>
                                        <Button
                                            className={`${toolbarButton}`}>
                                            <CameraIcon/>
                                        </Button>
                                    </ToolTipWrap>
                                </div>

                            </Flex>
                        </Root>
                    </div>
                </Rnd>
            </div>
        )
    }
}
