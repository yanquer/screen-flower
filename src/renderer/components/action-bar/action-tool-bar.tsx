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
    PauseIcon, PlayIcon,
    RestartIcon,
    ResumeIcon, SpotlightCursorIcon,
    StopIcon, TargetCursorIcon
} from "../svgs";

// @ts-ignore
import {toolbarButton} from "../../styles/components/action-tool-bar.module.scss"
import {ToolTipButtonWrap} from "../radix-ui/tool-tip-button-wrap";
import {BarVideoMode, IRecordContext, RecordContext} from "../../common/global-context";
import {ScreenCaptureBrowser} from "../movie-stream/browser/screen-capture-browser";
import {RecordedTimer} from "../movie-stream/record-timer";
import {CursorToolbar} from "./layout/cursor-toolbar";
import {BlurToolbar} from "./layout/blur-toolbar";
import {getServiceBySymbol} from "../../../common/container/inject-container";
import {IRecordService, IUtilService} from "../../../common/service";


interface ActionToolBarState {
    canDrag: boolean,
    x: number,
    y: number,
    pause: boolean,
    stop: boolean
}

export class ActionToolBar extends Component<any, ActionToolBarState>{
    static contextType = RecordContext
    context: IRecordContext

    state: ActionToolBarState = {
        canDrag: false,
        x: 200,
        y: 500,
        pause: false,
        stop: true,
    }

    protected readonly recordService: IRecordService = getServiceBySymbol<IRecordService>(IRecordService)

    protected captureRef = createRef<ScreenCaptureBrowser | undefined>()

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

    protected renderCloseTool(curBar?: BarVideoMode, click?: () => void){
        return (
            <ToolTipButtonWrap
                key={`${this.context.barMode}`} title={"关闭"}
                buttonClickHandler={() => {
                    if (click) click()
                    this.context.setBarMode('none')
                }}
                buttonClassName={`tool-sub-group ${this.context.barMode === curBar ? 'tool-sub-group-active' : ''}`}
            >
                <CloseButtonToolbar/>
            </ToolTipButtonWrap>
        )
    }

    protected renderCursorModeIcon(){
        switch (this.context.cursorMode){
            case 'target':
                return <TargetCursorIcon/>
            case 'highlight':
                return <HighlightCursorIcon />
            case 'spotlight':
                return <SpotlightCursorIcon />
            case 'none':
                return <CursorIcon />
            default:
                return <CursorIcon />
        }
    }

    protected async visScreenWhenRecording(vis: boolean){
        const utilService: IUtilService = getServiceBySymbol(IUtilService)
        const {recording} = this.context
        if (recording){
            await utilService.setClickPenetrate(vis)
        }
    }
    // protected addDocCursorMove(){
    //     document.addEventListener('mousemove', this.visScreenWhenRecording.bind(this))
    // }
    // protected removeDocCursorMove(){
    //     document.removeEventListener('mousemove', this.visScreenWhenRecording.bind(this))
    // }

    render() {
        const {stop} = this.state

        return (
            <div className={"bg-white pointer-events-auto"}
                 onMouseEnter={() => this.visScreenWhenRecording(false)}
                 onMouseLeave={() => this.visScreenWhenRecording(true)}
            >
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

                                <Separator className={'toolbar-separator'}/>

                                <Flex
                                    className={'bg-gray-100 p-1 rounded-full'}
                                    direction={"row"} gap={"8px"}>

                                    {stop ? (
                                        <div>
                                            <ToolTipButtonWrap
                                                key={`${stop}`}
                                                title={"开始录制"}
                                                buttonClassName={`${toolbarButton}`}
                                                buttonClickHandler={() => {
                                                    // this.captureRef.current.startCapture().then()
                                                    const {capArea, setCapArea} = this.context
                                                    console.log(`>>> use area: ${capArea}`)
                                                    console.log(capArea)
                                                    this.recordService.startRecord(capArea).then()
                                                    this.setState({stop: false})
                                                    this.context.setRecording(true)
                                                }}
                                            >
                                                <PlayIcon width="20" height="20"/>
                                            </ToolTipButtonWrap>
                                        </div>
                                    ) : (
                                        <div>
                                            <ToolTipButtonWrap
                                                key={`${stop}`}
                                                title={"结束录制"}
                                                buttonClassName={`${toolbarButton}`}
                                                buttonClickHandler={() => {
                                                    // this.captureRef.current.stopCapture()
                                                    this.recordService.stopRecord().then()
                                                    this.setState({stop: true})
                                                    this.context.setRecording(false)
                                                }}
                                            >
                                                <StopIcon width="20" height="20"/>
                                            </ToolTipButtonWrap>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-center">
                                        <RecordedTimer/>
                                    </div>

                                    <ToolTipButtonWrap
                                        title={"重新开始录制"}
                                        buttonClassName={`${toolbarButton} `}
                                        buttonClickHandler={() => {
                                            // this.captureRef.current.redoCapture()
                                            this.recordService.restartRecord().then()
                                            this.context.setRecording(true)
                                        }}
                                        key={`${this.context.recording}`}
                                        buttonDisable={!this.context.recording}
                                    >
                                        <RestartIcon/>
                                    </ToolTipButtonWrap>

                                    <div>
                                        {!this.state.pause ? (
                                            <ToolTipButtonWrap
                                                key={`${this.state.pause} ${this.context.recording}`}
                                                title={"暂停录制"}
                                                buttonClassName={`${toolbarButton} `}
                                                buttonClickHandler={() => {
                                                    // this.captureRef.current.pauseCapture()
                                                    this.recordService.pauseRecord().then()
                                                    this.setState({pause: true})
                                                }}
                                                buttonDisable={!this.context.recording}
                                            >
                                                <PauseIcon/>
                                            </ToolTipButtonWrap>
                                        ) : (
                                            <ToolTipButtonWrap
                                                key={`${this.state.pause} ${this.context.recording}`}
                                                title={"继续录制"}
                                                buttonClassName={`${toolbarButton} `}
                                                buttonClickHandler={() => {
                                                    // this.captureRef.current.resumeCapture()
                                                    this.recordService.resumeRecord().then()
                                                    this.setState({pause: false})
                                                }}
                                                buttonDisable={!this.context.recording}
                                            >
                                                <ResumeIcon/>
                                            </ToolTipButtonWrap>
                                        )}

                                    </div>
                                    <div>
                                        <ToolTipButtonWrap
                                            title={"取消录制"}
                                            buttonClassName={`${toolbarButton} `}
                                            buttonClickHandler={() => {
                                                // this.captureRef.current.cancelCapture()
                                                this.recordService.cancelRecord().then()
                                                this.context.setRecording(false)
                                                this.setState({stop: true})
                                            }}
                                            key={`${this.context.recording}`}
                                            buttonDisable={!this.context.recording}
                                        >
                                            <DiscardIcon/>
                                        </ToolTipButtonWrap>

                                    </div>
                                </Flex>

                                <Separator className={'toolbar-separator'}/>

                                <div>
                                    {this.context.barMode === 'draw' ? (
                                        this.renderCloseTool('draw')
                                    ) : (
                                        <ToolTipButtonWrap
                                            key={`${this.context.barMode}`}
                                            title={"切换绘图工具"}
                                            buttonClassName={`${toolbarButton}`}
                                        >
                                            <DrawIcon/>
                                        </ToolTipButtonWrap>
                                    )}

                                </div>

                                <div className={'relative'}>
                                    {this.context.barMode === 'blur' ? (
                                        this.renderCloseTool('blur')
                                    ) : (
                                        <ToolTipButtonWrap
                                            key={`${this.context.barMode}`}
                                            title={"切换模糊工具"}
                                            // title={"录制区域模糊"}
                                            buttonClassName={`${toolbarButton}`}
                                            buttonClickHandler={() => {
                                                this.context.setBarMode('blur')
                                            }}
                                        >
                                            <BlurIcon/>
                                        </ToolTipButtonWrap>
                                    )}
                                    {this.context.barMode === 'blur' ?
                                        <BlurToolbar
                                            className={'translate-x-8'}
                                        /> : ""}
                                </div>

                                <div className={'relative'}>
                                    {this.context.barMode === 'cursor' ? (
                                        this.renderCloseTool('cursor')
                                    ) : (
                                        <ToolTipButtonWrap
                                            key={`${this.context.barMode}`}
                                            title={"切换光标选项"}
                                            buttonClassName={`${toolbarButton} 
                      
                                            `}
                                            buttonClickHandler={() => {
                                                this.context.setBarMode('cursor')
                                            }}
                                        >
                                            {this.renderCursorModeIcon()}
                                        </ToolTipButtonWrap>
                                    )}
                                    {this.context.barMode === 'cursor' ? <CursorToolbar/> : ''}
                                </div>

                                <Separator className={'toolbar-separator'}/>

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

                <ScreenCaptureBrowser ref={this.captureRef}/>
            </div>
        )
    }
}
