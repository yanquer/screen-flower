import {BrowserWindow, BrowserWindowConstructorOptions} from "electron";
import {createWindow} from "../helpers";


export interface IBaseWidget {
    url: string
    options?: BrowserWindowConstructorOptions
    win?: BrowserWindow;

    initWindow(): BrowserWindow
    loadWindow(): Promise<void>
}

export class BaseWidget implements IBaseWidget{
    name: string
    url: string;
    options?: BrowserWindowConstructorOptions
    win?: BrowserWindow;

    constructor() {
        this.win = this.initWindow()
        this.loadWindow().then()
    }

    initWindow(): BrowserWindow{
        return createWindow(
            this.name,
            this.options ?? {}
        )
    }

    async loadWindow(): Promise<void> {
        await this.win.loadURL(this.url)
    }

}
