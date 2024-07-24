import {ISysDialogService} from "./service";
import {BrowserWindow, dialog} from "electron";
import {injectable} from "inversify";


@injectable()
export class SysDialogService implements ISysDialogService{
    protected _sysDialog = dialog

    async openSelectFileDialog(win: BrowserWindow, defaultPath?: string): Promise<string | undefined> {
        const res = this._sysDialog.showOpenDialogSync(win, {
            title: "Select File",
            defaultPath,
            properties: ['openFile'],
        })
        if (res) return res[0]
    }

    async openSelectDirDialog(win: BrowserWindow, defaultPath?: string): Promise<string | undefined> {
        const res = this._sysDialog.showOpenDialogSync(win, {
            title: "Select Dir",
            defaultPath,
            properties: ['openDirectory'],
        })
        if (res) return res[0]
    }

    async openSaveFileDialog(win: BrowserWindow, defaultPath?: string): Promise<string | undefined> {
        const res = this._sysDialog.showOpenDialogSync(win, {
            title: "Select save target",
            defaultPath,
            // properties: ['openDirectory'],
        })
        if (res) return res[0]
    }
}