import {ISysDialogService} from "./service";
import {BrowserWindow, dialog} from "electron";
import {inject, injectable} from "inversify";
import {ISettingService} from "../../common/service";
import {Logger} from "../common/logger";


@injectable()
export class SysDialogService implements ISysDialogService{

    @inject(ISettingService)
    protected readonly settingService: ISettingService;

    protected _sysDialog = dialog

    async openSelectFileDialog(win: BrowserWindow, defaultPath?: string, filters?: {name: string, extensions: string[]}[]): Promise<string | undefined> {
        const res = this._sysDialog.showOpenDialogSync(win, {
            title: "Select File",
            defaultPath: defaultPath ?? await this.settingService.getCachePath(),
            properties: ['openFile'],
            filters,
        })
        if (res) return res[0]
    }

    async openSelectDirDialog(win: BrowserWindow, defaultPath?: string): Promise<string | undefined> {
        const res = this._sysDialog.showOpenDialogSync(win, {
            title: "Select Dir",
            defaultPath: defaultPath ?? await this.settingService.getCachePath(),
            properties: ['openDirectory'],
        })
        if (res) return res[0]
    }

    async openSaveFileDialog(win: BrowserWindow, defaultPath?: string, title?: string, ): Promise<string | undefined> {
        const defaultPath_ = defaultPath ?? await this.settingService.getCachePath()
        Logger.info(`>> openSaveFileDialog, path ${defaultPath_}`)
        const res = this._sysDialog.showSaveDialogSync(win, {
            title: title ?? "Save target",
            defaultPath: defaultPath_,
            properties: ['showOverwriteConfirmation']
        })
        if (res) return res
    }
}
