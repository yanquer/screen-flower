import {app, Notification} from "electron";

export namespace AppManager {
    export const quitApp = () => app.quit();
    export const restartApp = () => {
        app.relaunch()
        quitApp();
    }

    export const addListen = app.on
    export const removeListen = app.off

    export const setPath = (
        name: string, path: string
    ) => app.setPath(name, path)
    export const getPath =
        (
            name: 'home' | 'appData' | 'userData' | 'sessionData' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps'
        ): string => app.getPath(name)

    export const focus = app.focus
    export const showAboutPanel = app.showAboutPanel

    export const whenReady = app.whenReady

    export const dock = app.dock
}
