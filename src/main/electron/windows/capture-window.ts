

import {BaseSFWindow} from "./base-window";
import {injectable, postConstruct} from "inversify";
import {Input, Event, Display, BrowserWindowConstructorOptions} from "electron";
import path from "path";
import {IRecordService} from "../../../common/service";
import {getServiceBySymbol} from "../../../common/container/inject-container";
import {WindowNames} from "../../../common/defines";

@injectable()
export class CaptureWindow extends BaseSFWindow{
    id = WindowNames.CaptureWin

    url: string = 'capture'
    name = 'capture-win'
    preLoad = true

    get options(): BrowserWindowConstructorOptions  {
        return {
            ...this.screenManager.getCurrentScreenArea(),  // x, y, width, height
            frame: false, // 删除默认窗口边框
            transparent: true, // 设置窗口为透明
            hasShadow: false,
            enableLargerThanScreen: true,
            resizable: false,
            movable: false,
            show: false,
            alwaysOnTop: true,
            opacity: 0,
            // 设置 titleBarStyle 反而可以看到, `退出-最大化-最小化` 的按钮了
            // titleBarStyle: 'hidden',
            autoHideMenuBar: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            }
        } as BrowserWindowConstructorOptions
    }

    @postConstruct()
    protected init() {
        super.init();

        setTimeout(() => {
            // const recordService: IRecordService = getServiceBySymbol(IRecordService);
            // recordService.recordingRunEmitterEvent(
            //     (isRecording: boolean) => {
            //         // this.setAllowPenetrate(isRecording).then()
            //         // if (!isRecording){
            //         //     this.hide()
            //         // }
            //     }
            // )
        }, 1000)
    }

    async extOperation(){
        await super.extOperation()
        // this.win.setAlwaysOnTop(true)
        // this.win.maximize()

        // 允许覆盖菜单栏
        this.win.setAlwaysOnTop(true, 'screen-saver', 1)

        // 设置全屏可见
        this.win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true})

        // 兼容桌面切换
        // screen.on('display-metrics-changed', this.displayChange.bind(this));

        // this.win.webContents.openDevTools()

    }

    protected displayChange(event: Event, display: Display, changedMetrics: string[]) {
        // Logger.info('>>> Active display changed:', display);
        // 切换桌面时 变更大小
        // this.win.setBounds(display.bounds)
        // if (this.win) moveToFoucScreen(this.win)
    }

    close(){
        super.close()
        // screen.off('display-metrics-changed', this.displayChange.bind(this))
    }

}
