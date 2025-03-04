
import log from 'electron-log/renderer';
// import {RendererLogger} from "electron-log";

import {isFrontDev} from "./run-time-env";
import {BaseChalkLogger} from "../../common/logger";

class ChalkLogger extends BaseChalkLogger {
    protected _MsgType = 'browser'
}

namespace ElectronFrontLogger{
    export const warn = (...message: any[]) => {
        log.warn("[browser] > ", ...message)

    }

    export const debug = (...message: any[]) => {
        log.debug("[browser] > ", ...message)
    }

    export const info = (...message: any[]) => {
        log.debug("[browser] > ", ...message)
    }

    export const error = (...message: any[]) => {
        log.error("[browser] > ", ...message)

    }
}

// @ts-ignore
// export const Logger: RendererLogger = (
export const Logger = (
    // navigator.userAgent.toLowerCase().indexOf('electron') > 0
    !isFrontDev
) ? ElectronFrontLogger: new ChalkLogger()





