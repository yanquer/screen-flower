import {Logger} from "./logger";
import {UniversalWindow} from "../electron/windows/universal-window";

export enum WindowNames {
    CaptureWin = 'capture-window',
    UniversalWin = 'universal-window',
    SettingWin = 'setting-window',
    PlayerWin = 'player-window',

}

export const isProd = process.env.NODE_ENV === 'production'
export const getHostUrl = (url: string) => {
    let ret: string
    if (isProd) {
        ret = `app://./${url}`
    } else {
        const port = process.argv[2]
        ret = `http://localhost:${port}/${url}`
        // mainWindow.webContents.openDevTools()
    }
    Logger.info('>> getHostUrl: ', ret)
    return ret
}



