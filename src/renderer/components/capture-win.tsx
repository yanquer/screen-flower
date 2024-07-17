import {Component, createRef, useState} from "react";
import {Rnd} from "react-rnd";
import {DraggableData, DraggableEvent} from "react-draggable";

// @ts-ignore
import {resizeHandle, topLeft, topRight, top, right, left, bottomRight, bottom, bottomLeft, boxShadowFull
} from '../styles/components/capture-win.module.scss'

export class CaptureWin extends Component<any, any>{

    protected dragRef = createRef<Rnd | undefined>()
    protected popupRef = createRef<HTMLDivElement | undefined>()
    state = {
        x: 0,
        y: 0,
        width: 600,
        height: 300,
    }

    protected handleDragDrop(e: DraggableEvent, d: DraggableData){
        this.setState({x: d.x, y: d.y})
        // let {x, y} = d
        //
        // if (x < 0) x = 0;
        // if (y < 0) y = 0;
        // const winWidth = window.innerWidth,
        //     winHeight = window.innerHeight;
        //
        // const currentWidth = this.popupRef.current?.getBoundingClientRect().width,
        //     currentHeight = this.popupRef.current?.getBoundingClientRect().height;
        //
        // console.log(">>> size0: ", winWidth, winHeight)
        // console.log(">>> size1: ", x, y)
        // console.log(">>> size: ", currentWidth, currentHeight)
        //
        // if (currentWidth + x > winWidth) x = winWidth - currentWidth
        // if (currentHeight + y > winHeight) y = winHeight - currentHeight
        //
        // this.setState({x, y})
        // if (x != d.x || y != d.y){
        //     this.dragRef.current?.updatePosition({x, y})
        // }

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
                    <div className={`popup-container w-full h-full ${boxShadowFull}`} ref={this.popupRef}>

                    </div>
                </Rnd>
            </div>
    )
    }
    }
