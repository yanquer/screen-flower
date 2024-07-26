import {BaseSFWindow} from "./base-window";
import {BrowserWindow, BrowserWindowConstructorOptions, Event, Input} from "electron";
import path from "path";
import {injectable} from "inversify";
import {WindowNames} from "../../../common/defines";
import {Logger} from "../../common/logger";



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
        // 16:10
        const initArea = {width: 800, height: 500}
        // const initArea = {width: 900, height: 560}
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
            // enableLargerThanScreen: true,
            resizable: false,
            // movable: true,
            show: false,
            // alwaysOnTop: true,
            // opacity: 0,
            backgroundColor: 'rgba(0,0,0,0)',
            // 设置 titleBarStyle 确保显示 `退出-最大化-最小化` 按钮
            titleBarStyle: 'hidden',
            // vibrancy: 'window',
            // autoHideMenuBar: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
            ...this.extOption,
        } as BrowserWindowConstructorOptions
    }

    protected handleKeydown(event: Event, input: Input) {
        super.handleKeydown(event, input);
        if (input.key === 'w' && input.meta){
            this.close()
        }
    }

}

