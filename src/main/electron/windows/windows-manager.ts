import {IBaseWindow, IWindowsManager} from "../service";
import {WindowNames} from "../../common/defines";
import {injectable, multiInject, postConstruct} from "inversify";


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

}

