import {BaseSFWindow} from "./base-window";
import {WindowNames} from "../../common/defines";
import {BrowserWindowConstructorOptions, Display, Event} from "electron";
import path from "path";
import {injectable} from "inversify";


// 通用窗口
//  比如, 设置View, 播放器View
@injectable()
export class UniversalWindow extends BaseSFWindow {

    id = WindowNames.UniversalWin

    url: string = 'setting'
    name = 'universal-win'
    preLoad = true

    get winArea(){
        const {x, y, width, height} = this.screenManager.getCurrentScreenArea()
        const initArea = {width: 900, height: 550}
        const cx = x + width / 2 - initArea.width / 2
        const cy = y + height / 2 - initArea.height / 2
        return {x: cx, y: cy, width: initArea.width, height: initArea.height}
    }

    get extOption(): BrowserWindowConstructorOptions{
        return {}
    }

    get options(): BrowserWindowConstructorOptions  {
        return {
            ...this.winArea,
            frame: false, // 删除默认窗口边框
            transparent: true, // 设置窗口透明
            hasShadow: false,
            enableLargerThanScreen: true,
            resizable: false,
            movable: true,
            show: false,
            alwaysOnTop: true,
            opacity: 0,
            // 设置 titleBarStyle 确保显示 `退出-最大化-最小化` 按钮
            titleBarStyle: 'hidden',
            vibrancy: 'window',
            autoHideMenuBar: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
            ...this.extOption,
        } as BrowserWindowConstructorOptions
    }

}

