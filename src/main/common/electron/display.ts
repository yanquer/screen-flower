import {BrowserWindow, Display, Point, Rectangle, screen} from "electron";
import {CaptureArea} from "../../../common/models";
import {toNumber} from "lodash";

export const getFoucScreen = (): Display => {
    const allDisplay = screen.getAllDisplays()
    if (allDisplay.length === 1) return allDisplay[0]

    const mousePoint = screen.getCursorScreenPoint()
    return screen.getDisplayNearestPoint(mousePoint)

    // for (const display of allDisplay) {
    //     if (display.)
    // }
}


export const getCurrentScreenPoint = (): Point => {
    return screen.getCursorScreenPoint()
}

// 包括任务栏
export const getCurrentScreenSize = (): Rectangle => {
    const display = getFoucScreen()
    return display.bounds
}

// 不包括任务栏
export const getCurrentScreenArea = (): Rectangle => {
    const display = getFoucScreen()
    return display.workArea
}

export const getCurrentSizeAndPoint = (): {id: number, x: number, y: number, width: number, height: number} => {
    const display: Display = getFoucScreen()
    const {id, bounds} = display
    const {x, y, width, height} = bounds

    return {id, x, y, width, height}
}

export const moveToFoucScreen = (win: BrowserWindow): void => {
    win.setBounds({
        ...getCurrentScreenPoint(),
        ...getCurrentScreenSize(),
    })
}

let _PPI: number
// 获取屏幕 ppi, 方便将物理像素转换为逻辑像素
// PPI (Pixels Per Inch)
//  表示每英寸有多少个物理像素
const getPpi = (refresh: boolean=false) => {
    if (refresh || !_PPI) {
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
