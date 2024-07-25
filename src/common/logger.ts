
// import log from 'electron-log/node';

import chalk from 'chalk'

namespace chalkLogger {

    export const log = (...text: any[]): void => {
        info(text)
    }
    export const info = (...text: any[]) => {
        console.log(chalk`{cyan [logger]} ${text}`)
    }

    export const warn = (message: string) => {
        console.log(chalk`{cyan [logger]} {green ${message}}`)
    }

    export const error = (message: string) => {
        console.log(chalk`{cyan [logger]} {red ${message}}`)
    }
}

// @ts-ignore
export const Logger = chalkLogger



