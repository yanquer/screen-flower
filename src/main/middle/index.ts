import {bindToDefaultContainer, invokeInterfaceFun} from "../../common/container/inject-container";
import {IFileService, IRecordService, ISettingService, IUtilService} from "../../common/service";
import {ipcMain} from "electron";
import {HandlerStr} from "../../common/defines";
import {ScreenRecorder} from "./ffemp/screen-recorder";
import {UtilService} from "./util-service";
import {SettingService} from "./setting-service";

const registerApiFromMain = () => {

    ipcMain.handle(HandlerStr.serviceFileService, async (_event, ...args: []) => {
        return await invokeInterfaceFun<IFileService>(IFileService, ...args)
    })

    ipcMain.handle(HandlerStr.serviceRecordService, async (_event, ...args: []) => {
        return await invokeInterfaceFun<IRecordService>(IRecordService, ...args)
    })

    ipcMain.handle(HandlerStr.utilService, async (_event, ...args: []) => {
        return await invokeInterfaceFun<IUtilService>(IUtilService, ...args)
    })

    ipcMain.handle(HandlerStr.settingService, async (_event, ...args: []) => {
        return await invokeInterfaceFun<ISettingService>(ISettingService, ...args)
    })

}

export const bindMiddle = () => {

    // 不用这个, 只能录制浏览器本身...
    // bindToDefaultContainer(IRecordService, ScreenRecorderByPuppeteer)
    bindToDefaultContainer(IRecordService, ScreenRecorder)
    bindToDefaultContainer(IUtilService, UtilService);
    bindToDefaultContainer(ISettingService, SettingService);

    registerApiFromMain()
}

