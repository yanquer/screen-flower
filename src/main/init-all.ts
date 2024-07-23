// for inject
import 'reflect-metadata'

import {initializeMenu} from "./menu";
import {dirname, join} from "path";
import {ensureScreenCapturePermissions} from "./common/permissions";
import {bindMiddle} from "./middle";
import {bindBackend} from "./backend";
import {app, ipcMain} from "electron";
import {getNeedCleanDispose, IDispose} from "../common/container/dispose";
import {bindElectron} from "./electron";
import {isProd} from "./common/defines";
import {Logger} from "./common/logger";

const cleanUp = () => {
    const needClean = getNeedCleanDispose()
    needClean.map(((disposeIns: IDispose) => {
        disposeIns.dispose?.();
    }))
}

export const initAll = () => {
    bindElectron()

    // Logger.info(">> ", __dirname)
    // const img = join(__dirname, "../resources/1.jpg")
    // const img = join(__dirname, "../resources/icon_16x16.png")

    const curExecPath = dirname(app.getPath('exe'))
    Logger.info(">> exec root:", curExecPath)

    // 只支持png和jpeg
    const img = isProd ?
        join(curExecPath, '../Resources/resources/icons/icon_16x16.png') :
        join(__dirname, "../resources/icons/icon_16x16.png")
    Logger.info(">> use menu image:", img)
    Logger.info(">> is dev:", !isProd)
    initializeMenu(img)

    bindBackend()
    bindMiddle()

    process.on('uncaughtException', (err) => {
        Logger.error('>>> Uncaught Exception in Main Process:', err);
    });

    process.on('unhandledRejection', (reason, p) => {
        // 处理rejection
        Logger.error('>>> unhandledRejection in Main Process:', reason, p);

    });

    app.on('quit', () => {
        Logger.info('>> app quit...', );
        cleanUp()
    })

    app.on('render-process-gone', (event, webContents, details) => {
        Logger.error('>> Render process crashed:', details);
    });

    ipcMain.on('app-route-ready', () => {
        Logger.info('App route loaded successfully');
    })

}

export const getPermission = () => {
    ensureScreenCapturePermissions()
}
