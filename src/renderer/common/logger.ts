
import log from 'electron-log/renderer';
import {RendererLogger} from "electron-log";

import chalk from 'chalk'

namespace chalkLogger {

    export const debug = (text: string) => {
        console.log(chalk`{cyan [browser]} ${text}`)
    }

    export const info = (text: string) => {
        console.log(chalk`{cyan [browser]} ${text}`)
    }

    export const warn = (message: string) => {
        console.log(chalk`{cyan [browser]} {green ${message}}`)
    }

    export const error = (message: string) => {
        console.log(chalk`{cyan [browser]} {red ${message}}`)
    }
}

namespace ULogger{
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
    true
) ? ULogger:chalkLogger





