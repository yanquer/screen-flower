import {Component} from "react";
import {getRandomStr} from "../common";


export class DragBox extends Component<any, any>{

    protected id: string

    constructor(props: any) {
        super(props);
        this.id = getRandomStr()
    }

    protected async mountForDragging() {
        // const draggable = document.getElementById('draggable');
        const draggable: HTMLElement = document.getElementsByClassName('drag-box')[0] as HTMLElement;

        // document.addEventListener('mousemove', (e) => {
        //     draggable.style.setProperty('--mouse-x', e.clientX + 'px');
        //     draggable.style.setProperty('--mouse-y', e.clientY + 'px');
        //
        //     draggable.style.left = (e.clientX - 50) + 'px';
        //     draggable.style.top = (e.clientY - 50) + 'px';
        // });

        const height = draggable.offsetHeight,
            width = draggable.offsetWidth;
        const mousePosition = {
            isMouseDown: false,
            offsetX: 0,
            offsetY: 0,
        }

        draggable.addEventListener('mousedown', function(e) {
            mousePosition.isMouseDown = true;
            mousePosition.offsetX = e.offsetX;
            mousePosition.offsetY = e.offsetY;
        })

        // document.addEventListener('mousemove', function(e) {
        draggable.addEventListener('mousemove', function(e) {
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
                if (window.innerWidth < width + cx) {
                    cx = window.innerWidth - width;
                }
                if (window.innerHeight < height + cy) {
                    cy = window.innerHeight - height;
                }

                // console.log(height, width)
                draggable.style.left = cx  + 'px';
                draggable.style.top = cy + 'px';
            }
        })

        draggable.addEventListener('mouseup', function() {
            mousePosition.isMouseDown = false;
        })

        // 解决移出界面时 div 的 mouseup 不触发的问题
        document.addEventListener('mouseup', function(e) {
            if(e.clientY > window.innerHeight || e.clientY < 0 || e.clientX < 0 ||e.clientX > window.innerWidth){
                mousePosition.isMouseDown = false;
                document.body.classList.remove('no-select');
            }
        });

    }

    componentDidMount() {
        this.mountForDragging().then();
    }

    render(): any {
        return (
            <div className='drag-box'>

            </div>
        )
    }
}
