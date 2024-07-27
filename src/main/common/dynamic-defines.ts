import {homedir} from "node:os";
import {Logger} from "./logger";
import {isProd} from "./defines";
import {dirname, join} from "path";
import {app} from "electron";


let _HOMEDIR: string
export const getHomeDir = (refresh: boolean = false) => {
    if (refresh || !_HOMEDIR){
        _HOMEDIR = homedir() || process.env.HOME || process.env.USERPROFILE
    }
    Logger.info(`>>> getHomeDir: ${_HOMEDIR}`)
    return _HOMEDIR
}

export namespace ElePathUtil {

    export const getTruthPath = (data: string) => {
        const curExecPath = dirname(app.getPath('exe'))
        Logger.info(">> exec root:", curExecPath)
        return isProd ?
            join(curExecPath, '../Resources/', 'resources/icons/icon_16x16.png') :
            join(__dirname, "../", data)
    }

    export const getMenuImg = () => {
        return getTruthPath(`resources/icons/icon_16x16.png`)
    }

    export const getPreloadIndex = () => {
        return getTruthPath(`resources/index.html`)
    }
}