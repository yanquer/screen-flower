import {BrowserWindow, BrowserWindowConstructorOptions, screen} from "electron";
import {createWindow} from "../helpers";
import {getHostUrl, WindowNames} from "../common/defines";
import {injectable, postConstruct} from "inversify";
import {WindowsUtils} from "./windows-utils";
import {Emitter, Event} from "../../common/event";
import {HandlerStr} from "../../common/defines";


export const IBaseWindow = Symbol("IBaseWindow");
export interface IBaseWindow {
    id: WindowNames
    url: string
    options?: BrowserWindowConstructorOptions
    win?: BrowserWindow;

    windowHideEmitterEvent: Event<WindowNames>

    open(): Promise<void>;
    initWindow(): BrowserWindow
    loadWindow(): Promise<void>
    // 是否允许点击穿透
    setAllowPenetrate(allow: boolean): Promise<void>
}


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

    protected windowHideEmitter = new Emitter<WindowNames>()
    windowHideEmitterEvent = this.windowHideEmitter.event

    @postConstruct()
    protected init () {
        console.log('>>> init base...', this.preLoad, this.id)
        if (this.preLoad){
            console.log('>>> preload init ...')
            this.open().then()
        }
    }

    async open(): Promise<void> {
        if (this.win) {
            console.log('>>> already has win...')
            this.show()
            this.firstInit = false
            return
        }

        this.firstInit = true
        console.log('>>> init win...')
        this.win = this.initWindow()
        await this.loadWindow()
        await this.extOperation()
        // this.win.once('ready-to-show', () => {
        //     this.win.show()
        // })
    }

    initWindow(): BrowserWindow{
        return createWindow(
            this.name,
            this.options ?? {}
        )
    }

    async loadWindow(): Promise<void> {
        await this.win.loadURL(getHostUrl(this.url))
    }

    async extOperation(): Promise<void>{

    }

    close(){
        console.log('>>> close window')
        this.win?.close()
        this.win = undefined
        this.win?.webContents.send(HandlerStr.onWindowHide)
    }

    show() {
        this.win.show()
    }

    hide() {
        console.log('>>> hide window')
        this.windowHideEmitter.fire(this.id)
        this.win?.hide()
        this.win?.webContents.send(HandlerStr.onWindowHide)
    }

    async setAllowPenetrate(allow: boolean): Promise<void> {
        WindowsUtils.clickPenetrateWindow(this.win, allow)
    }

}


export const IWindowsManager = Symbol.for("IWindowsManager");
export interface IWindowsManager{
    registerWin(id: WindowNames, win: IBaseWindow): void
    getWinById(id: WindowNames): IBaseWindow
}

