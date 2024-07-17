

import {BaseSFWindow} from "./base";
import {WindowNames} from "../common/defines";
import {injectable} from "inversify";
import {Input, Event, screen, Display, BrowserWindowConstructorOptions} from "electron";
import {getCurrentScreenPoint, getCurrentScreenSize, moveToFoucScreen} from "../common/electron/display";

@injectable()
export class CaptureWindow extends BaseSFWindow{
    id = WindowNames.CaptureWin

    url: string = '/capture'
    name = 'capture-win'
    get options(): BrowserWindowConstructorOptions  {
        return {
            ...getCurrentScreenSize(),  // x, y, width, height
            height: getCurrentScreenSize().height + 20,
            frame: false, // 删除默认窗口边框
            transparent: true, // 设置窗口为透明

            hasShadow: false,
            enableLargerThanScreen: true,
            resizable: false,
            movable: false,
            show: false,
            alwaysOnTop: true,
            opacity: 0.5,
            titleBarStyle: 'hidden',
            autoHideMenuBar: true,
            // webPreferences: {
            //     nodeIntegration: true,
            //     // enableRemoteModule: true,
            //     contextIsolation: false
            // }
        } as BrowserWindowConstructorOptions
    }

    async extOperation(){
        // this.win.setAlwaysOnTop(true)
        // this.win.maximize()
        // this.win.setOpacity(0.4)
        // 设置全屏可见
        this.win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true})

        // 隐藏滚动条
        this.win.webContents.insertCSS(`
            body {
                overflow: hidden;
            }
        `).then()

        this.win.webContents.on("before-input-event",
            (event: Event, input: Input) => this.handleKeydown(event, input))

        // 兼容桌面切换
        screen.on('display-metrics-changed', this.displayChange.bind(this));
    }

    protected handleKeydown(event: Event, input: Input) {
        if (input.key === 'Escape') {
            this.close()
        }
        event.preventDefault()
    }

    protected displayChange(event: Event, display: Display, changedMetrics: string[]) {
        // console.log('>>> Active display changed:', display);
        // 切换桌面时 变更大小
        // this.win.setBounds(display.bounds)
        // if (this.win) moveToFoucScreen(this.win)
    }

    protected close(){
        console.log('>>> close capture window')
        this.win.close()
        this.win = undefined
        screen.off('display-metrics-changed', this.displayChange.bind(this))
    }
}
