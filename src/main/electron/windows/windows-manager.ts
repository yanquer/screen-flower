import {IBaseWindow, IWindowsManager} from "../service";
import {WindowNames} from "../../common/defines";
import {injectable, multiInject, postConstruct} from "inversify";
import {type} from "node:os";
import {BrowserWindow} from "electron";
import {Logger} from "../../common/logger";


@injectable()
export class WindowsManager implements IWindowsManager{
    protected winIdMap: Map<WindowNames, IBaseWindow>

    @multiInject(IBaseWindow) protected readonly allWins: IBaseWindow[]

    constructor() {
        this.winIdMap = new Map();
    }

    @postConstruct()
    protected init(){
        this._registerAll()
    }

    protected _registerAll(){
        for (const win of this.allWins) {
            this.registerWin(win.id, win)
        }
    }

    getWinById(id: WindowNames): IBaseWindow {
        const ret = this.winIdMap.get(id);
        if (!ret){
            throw new Error(`[Windows Manager] ${id} does not exist`);
        }

        return ret
    }

    registerWin(id: WindowNames, win: IBaseWindow): void {
        this.winIdMap.set(id, win)
    }

    async openWinById(id: WindowNames, showNow: boolean=false): Promise<void> {
        await this.hideAllWindows()
        const findWin = this.getWinById(id)
        await findWin?.open(showNow)
    }

    setWinHideEventById(id: WindowNames, evt: (arg: WindowNames) => any): void {
        const cur = this.getWinById(id)
        cur?.windowHideEmitterEvent?.(e => evt(e))
    }

    async hideAllWindows(): Promise<void> {
        this.hideAllWindowsSync()
    }

    hideAllWindowsSync(): void {
        this.allWins.map((win: IBaseWindow) => win.hide())
    }

    protected findWinByWebId(id: number): IBaseWindow | undefined{
        return this.allWins.find(win => win.findWinByWebContentId(id))
    }

    async setClickPenetrateById(id: WindowNames | number, allow: boolean): Promise<void> {
        Logger.info(`>> try find win by ${id}, type: ${typeof id}`);
        const cur = typeof id === 'number' ? this.findWinByWebId(id) : this.getWinById(id)
        Logger.info(`>> find win ${cur.id}`);
        if (cur) {
            await cur.setAllowPenetrate(allow)
        }
    }

}

