import {inject, injectable, postConstruct} from "inversify";
import {getHostUrl} from "../../common/defines";
import {BrowserWindow, BrowserWindowConstructorOptions, Event, Input} from "electron";
import {Emitter} from "../../../common/event";
import {createWindow} from "../../helpers";
import {HandlerStr, WindowNames} from "../../../common/defines";
import {WindowsUtils} from "./windows-utils";
import {IBaseWindow, IScreenManager} from "../service";
import {Logger} from "../../common/logger";
import {IContextService} from "../../../common/service";
import {getServiceBySymbol} from "../../../common/container/inject-container";
import {Barrier} from "../../../common/barrier";
import {ElePathUtil} from "../../common/dynamic-defines";
import {asyncSleep} from "../../../common/common";


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

    protected win?: BrowserWindow;

    // 预加载来提高打开截屏窗口的启动速度, 比如每次创建新窗口
    // 需要与 show: false 一起使用
    preLoad: boolean
    // 是否是第一次show窗口, 支持close后
    firstInit: boolean = true;

    @inject(IScreenManager)
    protected readonly screenManager: IScreenManager;

    @inject(IContextService)
    protected readonly contextService: IContextService

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

    get originWin(){ return this.win }

    protected waitWinReadyShow?: Barrier<void>
    async open(showNow: boolean=false): Promise<void> {
        if (this.win) {
            Logger.info('>>> already has win...')
            this.show()
            // this.firstInit = false
            return
        }

        this.firstInit = true
        this.win = this.initWindow()
        await this.loadWindow()
        await this.extOperation()
        if (showNow) {
            this.show()
        }
    }

    initWindow(): BrowserWindow{
        Logger.info('>>> init win...')
        const ret = createWindow(
            this.name,
            this.options ?? {}
        )

        this.waitWinReadyShow = new Barrier<void>()
        ret.on('ready-to-show', ()=> {
            Logger.info(`>>> ready-to-show window, waitWinReadyShow pass , ${this.id}`)
            this.waitWinReadyShow.pass().then()
        })
        ret.webContents.on('dom-ready', ()=> {
            Logger.info(`>>> dom-ready window , ${this.id}`)
        })
        ret.webContents.on('did-finish-load', ()=> {
            Logger.info(`>>> did-finish-load window , ${this.id}`)
        })

        // this.setAllowPenetrate(true).then()
        return ret
    }

    async loadWindow(): Promise<void> {
        // const preLoadIndex = ElePathUtil.getPreloadIndex()
        // // 先加载一个预备窗口来避免白屏
        // Logger.info(`>>> loadFile preview: ${preLoadIndex}`)
        // await this.win.loadFile(preLoadIndex)
        Logger.info(`>>> loadURL: ${this.url}`)
        await this.win.loadURL(getHostUrl(this.url))
        // await this.setAllowPenetrate(false)
    }

    async extOperation(): Promise<void>{
        Logger.info(`>>> extOperation extOperation`)

        // 隐藏滚动条
        this.win.webContents.insertCSS(`
            body {
                overflow: hidden;
            }
        `).then()

        this.win.webContents.on("before-input-event",
            (event: Event, input: Input) => this.handleKeydown(event, input))

        this.win.webContents.on('destroyed', () => {
            this.close()
        })
        this.win.on('closed', () => {
            this.close()
        })

        //win = new BrowserWindow
        this.win?.webContents.once('did-fail-load', async () => {
            Logger.info(`>>> did-fail-load and reload, ${this.id}`)
            await asyncSleep(1000)
            this.win?.reload();
        });

    }

    protected handleKeydown(event: Event, input: Input) {
        Logger.info(`>>> click 
            key: ${input?.key} 
            control: ${input.control} 
            meta: ${input.meta} 
            modifiers: ${input.modifiers}
        `)
        switch (input.key){
            case 'Escape':
                Logger.info(`>>> click Escape`)
                this.hide()
                break
        }
        event.preventDefault()
    }

    close(){
        if (!this._isShow) return
        this._isShow = false
        Logger.info(`>>> close window ${this.id}`)
        // 不能发消息, 因为关了...
        // this.win?.webContents.send(HandlerStr.onWindowClose, this.id)
        this.win?.close()
        this.win = undefined
    }

    protected _isShow = false
    show() {
        if (this._isShow) return
        this._isShow = true

        this.waitWinReadyShow.wait().then(async () => {
            Logger.info(`>>> inner send show to front, ${this.id}`)

            this.win?.webContents.send(HandlerStr.onWindowShow, this.id)
            // Logger.info(`>>> inner webContents did-finish-load, ${this.id}`)
            this.win?.setOpacity(1)
            this.firstInit = false

            await asyncSleep(50)
            // 再发一次, 因为上面那次发过去的时候, 前端事件监听可能还没加载过来
            this.win?.webContents.send(HandlerStr.onWindowShow, this.id)

            await asyncSleep(700)
            Logger.info(`>>> show window, ${this.id}`)
            this.win.show()


        })
    }

    hide() {
        if (!this._isShow) return
        this._isShow = false
        Logger.info(`>>> hide window ${this.name}`)
        this.windowHideEmitter.fire(this.id)
        this.win?.hide()
        this.win?.webContents.send(HandlerStr.onWindowHide, this.id)
    }

    async setAllowPenetrate(allow: boolean): Promise<void> {
        WindowsUtils.clickPenetrateWindow(this.win, allow)
    }

    findWinByWebContentId(id: number): BrowserWindow | undefined{
        return this.win?.webContents.id === id ? this.win : undefined
    }

}

