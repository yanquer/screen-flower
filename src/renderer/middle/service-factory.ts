

export namespace ServiceFactory {
    export const fileService = async (...args: []) => {
        return await window.ipcInvoke.fileService(...args)
    }

    export const recordService = async (...args: []) => {
        return await window.ipcInvoke.recordService(...args)
    }
}