// for inject
import 'reflect-metadata'

import {initializeMenu} from "./menu";
import {ensureScreenCapturePermissions} from "./common/permissions";
import {bindMiddle} from "./middle";
import {bindBackend} from "./backend";
import {app, ipcMain, globalShortcut} from "electron";
import {getNeedCleanDispose, IDispose} from "../common/container/dispose";
import {bindElectron} from "./electron";
import {isProd} from "./common/defines";
import {Logger} from "./common/logger";
import {getServiceBySymbol} from "../common/container/inject-container";
import {IWindowsManager} from "./electron/service";
import {WindowNames} from "../common/defines";
import {ElePathUtil} from "./common/dynamic-defines";

const cleanUp = () => {
    const needClean = getNeedCleanDispose()
    needClean.map(((disposeIns: IDispose) => {
        Logger.info(`>> clean ${disposeIns?.value}`)
        disposeIns.dispose?.();
    }))
}

const onEventErrListen = () => {
    process.on('uncaughtException', (err) => {
        Logger.error('>>> ==== Uncaught Exception in Main Process start ====');
        Logger.error(err);
        Logger.error('>>> ==== Uncaught Exception in Main Process end ====');
    });

    process.on('unhandledRejection', (reason, p) => {
        // 处理rejection
        Logger.error('>>> ==== unhandledRejection in Main Process start ====');
        Logger.error(reason, p);
        Logger.error('>>> ==== unhandledRejection in Main Process end ====');
    });
    app.on('render-process-gone', (event, webContents, details) => {
        Logger.error('>> ==== Render process crashed start ====');
        Logger.error(details);
        Logger.error('>> ==== Render process crashed end ====');
    });
}

const loadMenu = () => {
    // 只支持png和jpeg
    const img = ElePathUtil.getMenuImg()
    Logger.info(">> use menu image:", img)
    initializeMenu(img)
}

const listenKeyboard = () => {
    // globalShortcut.register('Alt+CommandOrControl+I', () => {
    globalShortcut.register('CommandOrControl+Shift+R', () => {
        Logger.info('Electron global shortcuts trigger')
        const winManager: IWindowsManager = getServiceBySymbol(IWindowsManager)
        winManager.openWinById(WindowNames.CaptureWin, true).then();
    })
}

export const initAll = () => {
    bindElectron()
    bindBackend()
    bindMiddle()

    loadMenu()
    onEventErrListen()
    listenKeyboard()

    app.on('quit', () => {
        Logger.info('>> app quit start...', );
        cleanUp()
        Logger.info('>> app quit clean up end...', );
        app.quit()
        Logger.info('>> app quit end...', );
    })

    ipcMain.on('app-route-ready', () => {
        Logger.info('App route loaded successfully');
    })

}

export const getPermission = () => {
    ensureScreenCapturePermissions()
}
