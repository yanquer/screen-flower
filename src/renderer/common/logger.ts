
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

// @ts-ignore
export const Logger: RendererLogger = (
    // navigator.userAgent.toLowerCase().indexOf('electron') > 0
    true
) ? log:chalkLogger



