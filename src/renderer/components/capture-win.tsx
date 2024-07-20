import {Component, createRef} from "react";
import {Rnd} from "react-rnd";
import {DraggableData, DraggableEvent} from "react-draggable";

// @ts-ignore
import {resizeHandle, topLeft, topRight, top, right, left, bottomRight, bottom, bottomLeft, boxShadowFull
} from '../styles/components/capture-win.module.scss'
import {IRecordContext, RecordContext} from "../common/global-context";
import CursorModes from "./action-bar/tool/cursor-modes";

export class CaptureWin extends Component<any, any>{
    static contextType = RecordContext
    context: IRecordContext

    protected dragRef = createRef<Rnd | undefined>()
    protected popupRef = createRef<HTMLCanvasElement | undefined>()
    state = {
        x: 0,
        y: 0,
        width: 600,
        height: 300,
    }

    protected handleDragDrop(e: DraggableEvent, d: DraggableData){
        this.setState({x: d.x, y: d.y})
    }

    componentDidMount() {
        const {areaElement, setAreaElement} = this.context
        setAreaElement(this.popupRef.current)
    }

    componentWillUnmount() {
        const {areaElement, setAreaElement} = this.context
        setAreaElement(undefined)
    }

    render() {
        return (
            <div className={"overflow-hidden"}>
                <Rnd
                    className={"border-dotted border-blue-50 border-2"}
                    size={{width: this.state.width, height: this.state.height}}
                    // position={{x: this.state.x, y: this.state.y}}
                    onDragStop={this.handleDragDrop.bind(this)}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        this.setState({
                            width: ref.style.width,
                            height: ref.style.height,
                            ...position,
                        });
                    }}
                    bounds="window"
                    // bounds="parent"
                    resizeHandleWrapperClass="resize-handle-wrapper"
                    resizeHandleComponent={{
                        topLeft: <div className={`${resizeHandle} ${topLeft}`} />,
                        top: <div className={`${resizeHandle} ${top}`} />,
                        topRight: <div className={`${resizeHandle} ${topRight}`} />,
                        right: <div className={`${resizeHandle} ${right}`} />,
                        bottomRight: <div className={`${resizeHandle} ${bottomRight}`} />,
                        bottom: <div className={`${resizeHandle} ${bottom}`} />,
                        bottomLeft: <div className={`${resizeHandle} ${bottomLeft}`} />,
                        left: <div className={`${resizeHandle} ${left}`} />,
                    }}
                    ref={this.dragRef}
                >
                    <div className={`popup-container w-full h-full ${boxShadowFull}
                        ${this.context.blurView ? "blur-sm" : ""}
                    `}>
                        <canvas className={'w-full h-full'} ref={this.popupRef}></canvas>
                    </div>
                </Rnd>
                <CursorModes/>
            </div>
    )
    }
    }
