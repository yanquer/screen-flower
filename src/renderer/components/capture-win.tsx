import {Component, createRef} from "react";
import {Position, Rnd} from "react-rnd";
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
    // state = {
    //     x: 0,
    //     y: 0,
    //     width: 600,
    //     height: 300,
    // }

    protected handleDragDrop(e: DraggableEvent, d: DraggableData){
        const {capArea, setCapArea} = this.context
        setCapArea((preArea) => ({
            ...preArea,
            x: d.x,
            y: d.y
        }))
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
        const {capArea, setCapArea, recording} = this.context
        // console.log("re render")
        // console.log(capArea)
        return (
            <div className={"overflow-hidden"}>
                <Rnd
                    enableResizing={!recording}
                    dragAxis={!recording ? "both" : "none"}
                    className={"border-dotted border-blue-50 border-2"}
                    size={{width: capArea.width, height: capArea.height}}
                    position={{x: capArea.x, y: capArea.y}}
                    onDragStop={this.handleDragDrop.bind(this)}
                    onResizeStop={(e, direction, ref, delta, position: Position) => {
                        const newArea = {
                            width: ref.style.width,
                            height: ref.style.height,
                            ...position,
                        }
                        setCapArea(newArea);
                        console.log(`>>> area1: ${capArea}`)
                        console.log(newArea)
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
