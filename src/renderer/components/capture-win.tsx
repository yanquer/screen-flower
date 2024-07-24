import {Component, createRef} from "react";
import {Position, Rnd} from "react-rnd";
import {DraggableData, DraggableEvent} from "react-draggable";

// @ts-ignore
import {resizeHandle, topLeft, topRight, top, right, left, bottomRight, bottom, bottomLeft, boxShadowFull
} from '../styles/components/capture-win.module.scss'
import {IRecordContext, RecordContext} from "../common/global-context";
import CursorModes from "./action-bar/tool/cursor-modes";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IRecordService} from "../../common/service";
import {Logger} from "../common/logger";
import {invokeElectronHandler, invokeElectronHandlerAsync} from "../common/common";

interface CaptureWinState{
    bgUrl: string
}

export class CaptureWin extends Component<any, CaptureWinState>{
    static contextType = RecordContext
    context: IRecordContext

    protected dragRef = createRef<Rnd | undefined>()
    protected popupRef = createRef<HTMLCanvasElement | undefined>()
    state: CaptureWinState = {
        bgUrl: 'unset',
    }

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

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        const {blurView} = this.context

        if (blurView){
            Logger.info('>>> blurView', blurView)
            if (prevState.bgUrl === 'unset'){
                this.getBackgroundImg().then(
                    img => {
                        Logger.info('>>> blurView', img)
                        img && this.setState({bgUrl: img})
                    }
                )
            }
        } else {
            if (prevState.bgUrl !== 'unset') {
                URL.revokeObjectURL(prevState.bgUrl)
                this.setState({bgUrl: 'unset'})
            }
        }
    }

    protected async getBackgroundImg(){
        return await invokeElectronHandlerAsync<string>(async () => {
            const recodeService: IRecordService = getServiceBySymbol(IRecordService)
            const buffer = await recodeService.recordBgImage(this.context.capArea, 'bg-win.png', true)
            if (!buffer) return undefined
            const backgroundBlob = new Blob(
                [buffer],
                { type: 'image/png' }
            )
            const img = URL.createObjectURL(backgroundBlob);
            // return img
            return `url(${img})`
        })
    }

    render() {
        const {capArea, setCapArea, recording} = this.context

        Logger.info("re render win")
        // Logger.info(capArea)
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
                        Logger.info(`>>> area1: ${capArea}`)
                        Logger.info(newArea)
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
                        ${this.context.blurView ? " container-blur " : ""}
                    `}
                         style={{
                             backgroundImage: `${this.state.bgUrl}`
                         }}
                    >
                        {/*<canvas className={'w-full h-full'} ref={this.popupRef}></canvas>*/}
                    </div>
                </Rnd>
                <CursorModes/>
            </div>
        )
    }
}
