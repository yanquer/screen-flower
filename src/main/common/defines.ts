import {BrowserWindow, Display, screen} from "electron";

export enum WindowNames {
    CaptureWin = 'capture-window'

}

const isProd = process.env.NODE_ENV === 'production'
export const getHostUrl = (url: string) => {
    if (isProd) {
        return 'app://./home'
    } else {
        const port = process.argv[2]
        return `http://localhost:${port}/${url}`
        // mainWindow.webContents.openDevTools()
    }
}


export const getFoucScreen = (): Display => {
    const allDisplay = screen.getAllDisplays()
    if (allDisplay.length === 1) return allDisplay[0]

    const mousePoint = screen.getCursorScreenPoint()
    return screen.getDisplayNearestPoint(mousePoint)

    // for (const display of allDisplay) {
    //     if (display.)
    // }
}


export const getCurrentScreenPoint = () => {
    return screen.getCursorScreenPoint()
}

export const moveToScreen = (screen: Display, win: BrowserWindow): void => {

}
