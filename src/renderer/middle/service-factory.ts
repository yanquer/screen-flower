

export namespace ServiceFactory {
    export const fileService = async (...args: []) => {
        return await window.ipcInvoke.fileService(...args)
    }

    export const recordService = async (...args: []) => {
        return await window.ipcInvoke.recordService(...args)
    }

    export const utilService = async (...args: []) => {
        return await window.ipcInvoke.utilService(...args)
    }

    export const settingService = async (...args: []) => {
        return await window.ipcInvoke.settingService(...args)
    }
}
