import {app} from "electron";

export namespace AppManager {
    export const quitApp = () => app.quit();
    export const restartApp = () => {
        app.relaunch()
        quitApp();
    }

    export const addListen = app.on
    export const removeListen = app.off

    export const setPath = app.setPath
    export const getPath = app.getPath

    export const focus = app.focus
    export const showAboutPanel = app.showAboutPanel

    export const whenReady = app.whenReady

    export const dock = app.dock
}
