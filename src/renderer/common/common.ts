import {Logger} from "./logger";

export const invokeElectronHandler = <T>(callback: (...args: []) => T, ..._args: []): T => {
    try {
        return callback(..._args)
    } catch (e) {
        Logger.warn(">>> check invokeElectronHandler err, if in browser test, ignore")
        Logger.warn(e)
    }
}

export const invokeElectronHandlerAsync = async <T>(callback: (...args: []) => Promise<T>, ..._args: []): Promise<T> => {
    try {
        return await callback(..._args)
    } catch (e) {
        Logger.warn(">>> check invokeElectronHandler err, if in browser test, ignore")
        Logger.warn(e)
    }
}

export const isElectronEnv = () => {
    return true
    // return navigator.userAgent.toLowerCase().indexOf('electron') > 0
}

