import {IFileService, IRecordService, IUtilService} from "../../common/service";
import {inject, injectable} from "inversify";
import {IScreenManager, ISysDialogService, IWindowsManager} from "../electron/service";
import {shell} from "electron";
import {Logger} from "../common/logger";
import {WindowNames} from "../../common/defines";


@injectable()
export class UtilService implements IUtilService{

    @inject(IWindowsManager)
    protected windowsManager: IWindowsManager;
    @inject(IScreenManager)
    protected readonly screenManager: IScreenManager;
    @inject(IFileService)
    protected readonly fileService: IFileService;
    @inject(ISysDialogService)
    protected readonly sysDialogService: ISysDialogService;
    @inject(IRecordService)
    protected readonly recordService: IRecordService;

    async setClickPenetrate(penetrate: boolean, webContentId?: number): Promise<void> {
        await this.windowsManager.setClickPenetrateById(webContentId, penetrate)
    }

    async getCursorScreenPoint(webContentId?: number): Promise<{ x: number; y: number }> {
        return this.screenManager.getCursorPosition()
    }

    async showFileInFolder(filePath: string, webContentId?: number): Promise<void> {
        return (await this.fileService.isExists(filePath)) && shell.showItemInFolder(filePath);
    }

    async askLastRecord(alsoSelect: boolean = false, webContentId?: number): Promise<string | undefined> {
        const ret = this.recordService.recentRecordPath
        if (ret) return ret
        if (alsoSelect) {
            return await this.askSelectAVideoFile(true, true, webContentId) as string
        }
        return undefined
    }

    async askSelectAVideoFile(onlyStr: boolean=true, failedCancel: boolean=true, webContentId?: number): Promise<string | Buffer | undefined>{

        const curWin = this.windowsManager.findWinByWebId(webContentId)
        const selectFile = await this.sysDialogService.openSelectFileDialog(
            curWin.originWin, undefined,
            [{name: "video", extensions: ['.mp4', 'avi', ]}]
            )
        Logger.info(`>> askSelectAVideoFile ${selectFile}`)
        if (onlyStr && !selectFile && failedCancel) {
            Logger.info(`>> askSelectAVideoFile hideAllWindows`)
            this.windowsManager.hideAllWindows().then()
        }
        if (onlyStr) {
            Logger.info(`>> askSelectAVideoFile onlyStr`)
            return selectFile
        }
        if (selectFile){
            const data = await this.fileService.openBuffer(selectFile)
            Logger.info(`>> askSelectAVideoFile buffer has data ${data && data.length > 0}`)
            if (data) return data
        }
        failedCancel && this.windowsManager.hideAllWindows().then()
        return undefined
    }

    async askOpenPreview(): Promise<void> {
        await this.windowsManager.openWinById(WindowNames.PlayerWin)
    }

    async askHideWin(): Promise<void>{
        await this.windowsManager.hideAllWindows()
    }

}
