import {BrowserWindow, BrowserWindowConstructorOptions} from "electron";
import {createWindow} from "../helpers";
import {getHostUrl, WindowNames} from "../common/defines";
import {injectable} from "inversify";


export const IBaseWindow = Symbol("IBaseWindow");
export interface IBaseWindow {
    id: WindowNames
    url: string
    options?: BrowserWindowConstructorOptions
    win?: BrowserWindow;

    open(): Promise<void>;
    initWindow(): BrowserWindow
    loadWindow(): Promise<void>
}


@injectable()
export class BaseSFWindow implements IBaseWindow{
    id: WindowNames
    name: string
    url: string;
    options?: BrowserWindowConstructorOptions
    win?: BrowserWindow;

    async open(): Promise<void> {
        if (this.win) {
            this.win.show()
            return
        }

        this.win = this.initWindow()
        await this.loadWindow()
        await this.extOperation()
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

}


export const IWindowsManager = Symbol.for("IWindowsManager");
export interface IWindowsManager{
    registerWin(id: WindowNames, win: IBaseWindow): void
    getWinById(id: WindowNames): IBaseWindow
}

