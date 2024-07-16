import {Component, createRef, useState} from "react";
import {Rnd} from "react-rnd";


export class CaptureWin extends Component<any, any>{

    protected dragRef = createRef<Rnd | undefined>()
    state = {
        x: 0,
        y: 0,
        width: 600,
        height: 300,
    }

    protected handleDragStart(){

    }
    protected handleDrag(){

    }
    protected handleDrop(){}


    render() {
        return (
            <div>
                <Rnd
                    className={"border-dotted border-blue-50 border-2"}
                    size={{ width: this.state.width,  height: this.state.height }}
                    position={{ x: this.state.x, y: this.state.y }}
                    onDragStop={(e, d) => { this.setState({ x: d.x, y: d.y }) }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        this.setState({
                            width: ref.style.width,
                            height: ref.style.height,
                            ...position,
                        });
                    }}
                >
                    001
                </Rnd>
                {/*<Rnd*/}
                {/*    default={{*/}
                {/*        x: 0,*/}
                {/*        y: 0,*/}
                {/*        width: 600,*/}
                {/*        height: 300,*/}
                {/*    }}*/}
                {/*    className={*/}
                {/*        "react-draggable-and bg-white"*/}
                {/*        // + " " + elastic + " " + shake + " " + dragging*/}
                {/*    }*/}
                {/*    enableResizing={false}*/}
                {/*    dragHandleClassName="drag-area"*/}
                {/*    onDragStart={() => this.handleDragStart()}*/}
                {/*    onDrag={() => this.handleDrag()}*/}
                {/*    onDragStop={() => this.handleDrop()}*/}
                {/*    ref={this.dragRef}*/}
                {/*></Rnd>*/}
            </div>
        )
    }
}
