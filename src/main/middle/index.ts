import {bindToDefaultContainer, invokeInterfaceFun} from "../../common/container/inject-container";
import {IFileService, IRecordService} from "../../common/service";
import {ipcMain} from "electron";
import {HandlerStr} from "../../common/defines";
import {ScreenRecorder} from "./ffemp/screen-recorder";

const registerApiFromMain = () => {

    ipcMain.handle(HandlerStr.serviceFileService, async (_event, ...args: []) => {
        return await invokeInterfaceFun<IFileService>(IFileService, ...args)
    })

    ipcMain.handle(HandlerStr.serviceRecordService, async (_event, ...args: []) => {
        return await invokeInterfaceFun<IRecordService>(IRecordService, ...args)
    })

}

export const bindMiddle = () => {

    // 不用这个, 只能录制浏览器本身...
    // bindToDefaultContainer(IRecordService, ScreenRecorderByPuppeteer)
    bindToDefaultContainer(IRecordService, ScreenRecorder)

    registerApiFromMain()
}

