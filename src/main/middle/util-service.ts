import {IFileService, IUtilService} from "../../common/service";
import {inject, injectable} from "inversify";
import {IScreenManager, IWindowsManager} from "../electron/service";
import {WindowNames} from "../common/defines";
import {shell} from "electron";


@injectable()
export class UtilService implements IUtilService{

    @inject(IWindowsManager)
    protected windowsManager: IWindowsManager;
    @inject(IScreenManager)
    protected readonly screenManager: IScreenManager;
    @inject(IFileService)
    protected readonly fileService: IFileService;

    async setClickPenetrate(penetrate: boolean): Promise<void> {
        const capWin = this.windowsManager.getWinById(WindowNames.CaptureWin)
        if (capWin) {
            await capWin.setAllowPenetrate(penetrate)
        }
    }

    async getCursorScreenPoint(): Promise<{ x: number; y: number }> {
        return this.screenManager.getCursorPosition()
    }

    async showFileInFolder(filePath: string): Promise<void> {
        return (await this.fileService.isExists(filePath)) && shell.showItemInFolder(filePath);
    }

}
