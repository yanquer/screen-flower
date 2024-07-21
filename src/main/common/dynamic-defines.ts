import {homedir} from "node:os";


let _HOMEDIR: string
export const getHomeDir = (refresh: boolean = false) => {
    if (refresh || !_HOMEDIR){
        _HOMEDIR = homedir() || process.env.HOME || process.env.USERPROFILE
    }
    console.log(`>>> getHomeDir: ${_HOMEDIR}`)
    return _HOMEDIR
}