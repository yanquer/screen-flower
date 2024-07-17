import {BrowserWindow, Display, Point, screen, Rectangle} from "electron";

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

export const getCurrentScreenSize = (): Rectangle => {
    const display = getFoucScreen()
    return display.bounds
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
