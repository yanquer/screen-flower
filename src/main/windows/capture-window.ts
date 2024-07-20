

import {BaseSFWindow} from "./base";
import {WindowNames} from "../common/defines";
import {injectable} from "inversify";
import {Input, Event, screen, Display, BrowserWindowConstructorOptions} from "electron";
import {
    getCurrentScreenArea,
    getCurrentScreenPoint,
    getCurrentScreenSize,
    moveToFoucScreen
} from "../common/electron/display";
import {setNoMenuDock} from "../common/electron/menu";
import path from "path";

@injectable()
export class CaptureWindow extends BaseSFWindow{
    id = WindowNames.CaptureWin

    url: string = '/capture'
    name = 'capture-win'
    preLoad = true
    get options(): BrowserWindowConstructorOptions  {
        return {
            ...getCurrentScreenSize(),  // x, y, width, height
            frame: false, // 删除默认窗口边框
            transparent: true, // 设置窗口为透明
            hasShadow: false,
            enableLargerThanScreen: true,
            resizable: false,
            movable: false,
            show: false,
            alwaysOnTop: true,
            opacity: 0,
            titleBarStyle: 'hidden',
            autoHideMenuBar: true,
            webPreferences: {
                // nodeIntegration: true,
                // enableRemoteModule: true,
                // contextIsolation: false,
                preload: path.join(__dirname, 'preload.js'),
            }
        } as BrowserWindowConstructorOptions
    }

    async extOperation(){
        // this.win.setAlwaysOnTop(true)
        // this.win.maximize()

        // 设置全屏可见
        // this.win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true})

        // 隐藏滚动条
        this.win.webContents.insertCSS(`
            body {
                overflow: hidden;
            }
        `).then()

        this.win.webContents.on("before-input-event",
            (event: Event, input: Input) => this.handleKeydown(event, input))

        // 兼容桌面切换
        // screen.on('display-metrics-changed', this.displayChange.bind(this));

        // this.win.webContents.openDevTools()
    }

    protected handleKeydown(event: Event, input: Input) {
        switch (input.key){
            case 'Escape':
                this.hide()
                break
        }
        event.preventDefault()
    }

    protected displayChange(event: Event, display: Display, changedMetrics: string[]) {
        // console.log('>>> Active display changed:', display);
        // 切换桌面时 变更大小
        // this.win.setBounds(display.bounds)
        // if (this.win) moveToFoucScreen(this.win)
    }

    close(){
        super.close()
        // screen.off('display-metrics-changed', this.displayChange.bind(this))
    }

    show(){
        super.show()
        if (this.firstInit) {
            // 首次启动的时候, 先 opacity: 0 , 再 1 , 避免看到首次show browserWindows 白屏
            //      除了此方案, 貌似还可以先加载一个其他的 browserWindows
            setTimeout(() => this.win.setOpacity(1), 100)
        }
    }
}
