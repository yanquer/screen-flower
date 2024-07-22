import {BrowserWindow, Display, Point, Rectangle, screen} from "electron";
import {CaptureArea} from "../../../common/models";
import {toNumber} from "lodash";

export const getAllScreen = (): Display[] => {
    return screen.getAllDisplays()
}

export const getFoucScreen = (onlyIndex: boolean=false): Display | number => {
    const allDisplay = getAllScreen()
    if (allDisplay.length === 1) return onlyIndex ? 0 : allDisplay[0]

    const mousePoint = getAllDisCurrentScreenPoint()
    const cur = screen.getDisplayNearestPoint(mousePoint)
    if (!onlyIndex) return cur

    let i = 0
    for (const one of allDisplay) {
        if (one.id === cur.id) return i
        i += 1
    }

    return 0
}

// 获取鼠标在所有屏幕上的绝对位置
export const getAllDisCurrentScreenPoint = (): Point => {
    return screen.getCursorScreenPoint()
}

// 获取鼠标在当前屏幕上的相对位置
export const getFoucScreenPoint = (): Point => {
    // 这个获取的包含了所有屏幕
    const allScreenPoint = getAllDisCurrentScreenPoint()

    // 当前屏幕起始位置
    const {x, y} = getCurrentScreenSize()

    return {x: allScreenPoint.x - x, y: allScreenPoint.y - y}
}

// 包括任务栏
export const getCurrentScreenSize = (): Rectangle => {
    // @ts-ignore
    const display: Display = getFoucScreen()
    return display.bounds
}

// 不包括任务栏
export const getCurrentScreenArea = (): Rectangle => {
    // @ts-ignore
    const display: Display = getFoucScreen()
    return display.workArea
}

export const getCurrentSizeAndPoint = (): {id: number, x: number, y: number, width: number, height: number} => {
    // @ts-ignore
    const display: Display = getFoucScreen()
    const {id, bounds} = display
    const {x, y, width, height} = bounds

    return {id, x, y, width, height}
}

export const moveToFoucScreen = (win: BrowserWindow): void => {
    win.setBounds({
        ...getAllDisCurrentScreenPoint(),
        ...getCurrentScreenSize(),
    })
}

let _PPI: number
// 获取屏幕 ppi, 方便将物理像素转换为逻辑像素
// PPI (Pixels Per Inch)
//  表示每英寸有多少个物理像素
const getPpi = (refresh: boolean=false) => {
    if (refresh || !_PPI) {
        // @ts-ignore
        const display: Display = getFoucScreen()
        // scaleFactor: device's pixel scale factor.
        //  当前显示器的缩放比例
        const {size, scaleFactor} = display

        const physicalWidth = size.width / scaleFactor;
        const physicalHeight = size.height / scaleFactor;

        _PPI = Math.sqrt(size.width * size.width + size.height * size.height) /
            Math.sqrt(physicalWidth * physicalWidth + physicalHeight * physicalHeight);

        console.log(`>>> ${size.width} -- ${size.height} -- ${physicalWidth} -- ${physicalHeight}`)
    }
    return _PPI
}

// 获取 ffmpeg 使用区域
//  需要将前端传过来的CSS像素, 转换为物理像素
export const getCropAreaStr = (area: CaptureArea) => {
    console.log('>>> prep convert size...')
    const curPpi = getPpi()
    console.log(area, curPpi)
    const width = toNumber(`${area.width}`.replace('px', ''))
    const height = toNumber(`${area.height}`.replace('px', ''))
    // 剪去边框
    return `${(width-4) * curPpi}:${(height-4) * curPpi}:${(area.x+2) * curPpi}:${(area.y+2) * curPpi}`
}


export const setOnScreenChange = () => {
    // screen.on('display-metrics-changed', (event, display, changedMetrics) => {
    //
    // })
}
