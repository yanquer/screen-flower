import {inject, injectable, postConstruct} from "inversify";
import {getHostUrl, WindowNames} from "../../common/defines";
import {BrowserWindow, BrowserWindowConstructorOptions} from "electron";
import {Emitter} from "../../../common/event";
import {createWindow} from "../../helpers";
import {HandlerStr} from "../../../common/defines";
import {WindowsUtils} from "./windows-utils";
import {IBaseWindow, IScreenManager} from "../service";
import {Logger} from "../../common/logger";


@injectable()
export class BaseSFWindow implements IBaseWindow{
    id: WindowNames
    name: string
    url: string;
    private _options?: BrowserWindowConstructorOptions;
    public get options(): BrowserWindowConstructorOptions {
        return this._options;
    }
    public set options(value: BrowserWindowConstructorOptions) {
        this._options = value;
    }
    win?: BrowserWindow;

    // 预加载来提高打开截屏窗口的启动速度, 比如每次创建新窗口
    // 需要与 show: false 一起使用
    preLoad: boolean
    // 是否是第一次show窗口, 支持close后
    firstInit: boolean = true;

    @inject(IScreenManager)
    protected screenManager: IScreenManager;

    protected windowHideEmitter = new Emitter<WindowNames>()
    windowHideEmitterEvent = this.windowHideEmitter.event

    @postConstruct()
    protected init () {
        Logger.info('>>> init base window...', this.preLoad, this.id)
        if (this.preLoad){
            Logger.info('>>> preload init ...')
            this.open().then()
        }
    }

    async open(): Promise<void> {
        if (this.win) {
            Logger.info('>>> already has win...')
            this.show()
            this.firstInit = false
            return
        }

        this.firstInit = true
        this.win = this.initWindow()
        await this.loadWindow()
        await this.extOperation()
        // this.win.once('ready-to-show', () => {
        //     this.win.show()
        // })
    }

    initWindow(): BrowserWindow{
        Logger.info('>>> init win...')
        const ret = createWindow(
            this.name,
            this.options ?? {}
        )
        this.setAllowPenetrate(true).then()
        return ret
    }

    async loadWindow(): Promise<void> {
        Logger.info(`>>> loadURL ${this.url}`)
        await this.win.loadURL(getHostUrl(this.url))
        await this.setAllowPenetrate(false)
    }

    async extOperation(): Promise<void>{
        Logger.info(`>>> loadURL extOperation`)

    }

    close(){
        Logger.info('>>> close window')
        this.win?.close()
        this.win = undefined
        this.win?.webContents.send(HandlerStr.onWindowHide)
    }

    show() {
        this.win.show()
    }

    hide() {
        Logger.info('>>> hide window')
        this.windowHideEmitter.fire(this.id)
        this.win?.hide()
        this.win?.webContents.send(HandlerStr.onWindowHide)
    }

    async setAllowPenetrate(allow: boolean): Promise<void> {
        WindowsUtils.clickPenetrateWindow(this.win, allow)
    }

}

