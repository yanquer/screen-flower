import {Component, useEffect, useId} from "react";
import {asyncSleep, getRandomStr} from "../common";
import Draggable from 'react-draggable'


// 为了使用 useId 换成函数组件
export const DragBox = () => {

    let boxId: string,
        dialogId: string

    const setIds = () => {
        // const randStr = getRandomStr()
        const randStr = useId()
        console.log(">> set ids ", randStr)
        boxId = 'drag-box-' + randStr
        dialogId = 'dialog-box-' + randStr
    }

    setIds()

    const mousePosition = {
        isMouseDown: false,
        offsetX: 0,
        offsetY: 0,
    }

    // 动态获取, 因为可能是resizeable
    const dialogContentBox = () => document.getElementById(dialogId);

    const dragMouseDown = (e: MouseEvent) => {
        mousePosition.isMouseDown = true;
        mousePosition.offsetX = e.offsetX;
        mousePosition.offsetY = e.offsetY;
    }

    const dragMouseMove = (e: MouseEvent) => {
        if (mousePosition.isMouseDown) {
            // const pos = draggable.getClientRects()[0]

            let cx = e.clientX - mousePosition.offsetX,
                cy = e.clientY - mousePosition.offsetY;
            if (cx < 0) {
                cx = 0;
            }
            if (cy < 0) {
                cy = 0;
            }

            const _box = dialogContentBox()
            const height = () => _box.offsetHeight,
                width = () => _box.offsetWidth;

            const [_w, _h] = [width(), height()]
            if (window.innerWidth < _w + cx) {
                cx = window.innerWidth - _w;
            }
            if (window.innerHeight < _h + cy) {
                cy = window.innerHeight - _h;
            }

            // console.log(height, width)
            // 拖动的是标题部分, 移动的是整个dialog
            _box.style.left = cx  + 'px';
            _box.style.top = cy + 'px';
        }
    }
    const dragMouseUp = (e: MouseEvent) =>  {
        mousePosition.isMouseDown = false;
    }
    // 解决移出界面时 div 的 mouseup 不触发的问题
    const bodyMouseUp = (e: MouseEvent) =>  {
        if(e.clientY > window.innerHeight || e.clientY < 0 || e.clientX < 0 ||e.clientX > window.innerWidth){
            mousePosition.isMouseDown = false;
            document.body.classList.remove('no-select');
        }
    }

    const mountForDragging = async () => {
        let draggable: HTMLElement = document.getElementById(boxId);
        while (!draggable){
            await asyncSleep(500)
            draggable = document.getElementById(boxId);
        }

        // 拖动的是标题部分, 移动的是整个dialog
        // const dialogOverlay = document.getElementById(dialogId);
        //
        // const height = dialogOverlay.offsetHeight,
        //     width = dialogOverlay.offsetWidth;

        draggable.addEventListener('mousedown', dragMouseDown)
        draggable.addEventListener('mousemove', dragMouseMove)
        draggable.addEventListener('mouseup', dragMouseUp)

        // 解决移出界面时 div 的 mouseup 不触发的问题
        document.addEventListener('mouseup', bodyMouseUp);

    }

    useEffect(() => {
        mountForDragging().then()

        return () => {
            let draggable: HTMLElement = document.getElementById(boxId);
            if (draggable){
                draggable.removeEventListener('mousedown', dragMouseDown)
                draggable.removeEventListener('mousemove', dragMouseMove)
                draggable.removeEventListener('mouseup', dragMouseUp)
            }
            document.removeEventListener('mouseup', bodyMouseUp);
        }
    }, []);

    const render = () => {
        return (
            <div className={'dialog-overlay not-mode-window'} >
                <div className={'resize-box dialog-box'} id={dialogId}>
                    <div className='drag-box dialog-title' id={boxId}>
                        标题
                    </div>

                    <div className='dialog-content'>
                        这是一个 dialog-content
                    </div>
                </div>
            </div>
            // <Draggable
            //     axis="x"
            //     handle=".handle"
            //     defaultPosition={{x: 0, y: 0}}
            //     position={null}
            //     grid={[25, 25]}
            //     scale={1}
            //     onStart={() => {}}
            //     onDrag={() => {}}
            //     onStop={() => {}}>
            //     <div style={{resize: "both", border: "1px solid black", width: "100px"}}>
            //         <div className="handle">Drag from here</div>
            //         <div>This readme is really dragging on...</div>
            //     </div>
            // </Draggable>
        )
    }

    return render()
}
