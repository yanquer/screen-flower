
export enum OsType{
    win = 1,
    linux = 2,
    mac = 3,
    other,
}

export namespace OS{
    export const curOsType: OsType = process.platform === 'win32' ?
        OsType.win : process.platform === 'darwin' ?
            OsType.mac : process.platform === 'linux'?
                OsType.linux : OsType.other


}




