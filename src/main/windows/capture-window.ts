

import {BaseSFWindow} from "./base";
import {getCurrentScreenPoint, WindowNames} from "../common/defines";
import {injectable} from "inversify";

@injectable()
export class CaptureWindow extends BaseSFWindow{
    id = WindowNames.CaptureWin

    url: string = '/capture'
    name = 'capture-win'
    options = {
        ...getCurrentScreenPoint(),  // x, y
        width: 400,
        height: 400,
        frame: false, // 删除默认窗口边框
        transparent: true, // 设置窗口为透明

        hasShadow: false,
        enableLargerThanScreen: true,
        // resizable: false,
        // movable: false,
        // transparent: true,
        // show: false,
        // webPreferences: {
        //     nodeIntegration: true,
        //     // enableRemoteModule: true,
        //     contextIsolation: false
        // }
    }

    async extOperation(){
        this.win.setAlwaysOnTop(true)
        this.win.maximize()
        this.win.setOpacity(0.1)
        this.win.setVisibleOnAllWorkspaces(true)
    }
}
