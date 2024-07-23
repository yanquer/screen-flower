import {homedir} from "node:os";
import {Logger} from "./logger";


let _HOMEDIR: string
export const getHomeDir = (refresh: boolean = false) => {
    if (refresh || !_HOMEDIR){
        _HOMEDIR = homedir() || process.env.HOME || process.env.USERPROFILE
    }
    Logger.info(`>>> getHomeDir: ${_HOMEDIR}`)
    return _HOMEDIR
}