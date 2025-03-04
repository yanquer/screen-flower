
// import log from 'electron-log/node';

import chalk from 'chalk'

export class BaseConsoleLogger {
    protected _MsgType = 'logger'

    debug = (...message: any[]) => {
        // console.log(chalk`{cyan [logger]} ${message}`)
        console.debug(`{[${this._MsgType}]}`, ...message)
    }

    log = (...message: any[]): void => {
        this.info(message)
    }
    info = (...message: any[]) => {
        // console.log(chalk`{cyan [logger]} ${message}`)
        console.log(`{[${this._MsgType}]}`, ...message)
    }

    warn = (...message: any[]) => {
        // console.log(chalk`{cyan [logger]} {green ${message}}`)
        console.warn(`{[${this._MsgType}]}`, ...message)
    }

    error = (...message: any[]) => {
        console.error(`{[${this._MsgType}]}}`, ...message)
    }
}
export class BaseChalkLogger extends BaseConsoleLogger{
    protected _MsgType = 'logger'

    debug = (...message: any[]) => {
        // console.log(chalk`{cyan [logger]} ${message}`)
        console.debug(chalk`{cyan [${this._MsgType}]}`, ...message)
    }

    log = (...message: any[]): void => {
        this.info(message)
    }
    info = (...message: any[]) => {
        // console.log(chalk`{cyan [logger]} ${message}`)
        console.log(chalk`{cyan [${this._MsgType}]}`, ...message)
    }

    warn = (...message: any[]) => {
        // console.log(chalk`{cyan [logger]} {green ${message}}`)
        console.warn(chalk`{cyan [${this._MsgType}]}`, ...message)
    }

    error = (...message: any[]) => {
        console.error(chalk`{cyan [${this._MsgType}]}}`, ...message)
    }
}
export namespace BaseChalkLogger {

    export const log = (...message: any[]): void => {
        info(message)
    }
    export const info = (...message: any[]) => {
        // console.log(chalk`{cyan [logger]} ${message}`)
        console.log(chalk`{cyan [logger]}`, ...message)
    }

    export const warn = (...message: any[]) => {
        // console.log(chalk`{cyan [logger]} {green ${message}}`)
        console.log(chalk`{cyan [logger]}`, ...message)
    }


    export const error = (...message: any[]) => {
        console.log(chalk`{cyan [logger]}}`, ...message)
    }
}

// @ts-ignore
export const Logger = new BaseChalkLogger()



