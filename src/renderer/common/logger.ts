
import log from 'electron-log/renderer';
import {RendererLogger} from "electron-log";

import chalk from 'chalk'

namespace chalkLogger {

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
        if (typeof message === 'string') {
            log.warn(`[browser] ${message}`)
        } else {
            log.warn("[browser] > ")
            log.warn(message)
        }
    }

    export const info = (...message: any[]) => {
        if (typeof message === 'string') {
            log.info(`[browser] ${message}`)
        } else {
            log.info("[browser] > ")
            log.info(message)
        }
    }

    export const error = (...message: any[]) => {
        if (typeof message === 'string') {
            log.error(`[browser] ${message}`)
        } else {
            log.error("[browser] > ")
            log.error(message)
        }
    }
}

// @ts-ignore
// export const Logger: RendererLogger = (
export const Logger = (
    // navigator.userAgent.toLowerCase().indexOf('electron') > 0
    true
) ? ULogger:chalkLogger





