import {ISettingService} from "../../common/service";
import {inject, injectable} from "inversify";
import {dockShow} from "../common/electron/menu";
import {join} from "path";
import {getHomeDir} from "../common/dynamic-defines";
import {DefaultLogFile} from "../common/logger";
import {ISysDialogService, IWindowsManager} from "../electron/service";
import {WindowNames} from "../common/defines";
import {Emitter, Event} from "../../common/event";

@injectable()
export class SettingService implements ISettingService{

    protected defaultCacheDir = join(getHomeDir(), "./screen-recorder");
    protected defaultLogPath: string = DefaultLogFile.path
    protected cacheDir: string
    protected logPath: string

    @inject(ISysDialogService)
    protected readonly sysDialogService: ISysDialogService;
    @inject(IWindowsManager)
    protected readonly windowsManager: IWindowsManager;

    protected cachePathChangeEmitter = new Emitter<string>()
    cachePathChangeEvent: Event<string> = this.cachePathChangeEmitter.event

    async getCachePath(): Promise<string>{
        return this.getCachePathSync()
    }

    getCachePathSync(){
        return this.cacheDir ?? this.defaultCacheDir
    }

    protected async setCachePathAndFire(cachePath: string): Promise<void> {
        if (cachePath && cachePath !== this.cacheDir) {
            this.cacheDir = cachePath
            this.cachePathChangeEmitter.fire(cachePath)
        }
    }

    async setOrSelectCachePath(cachePath?: string): Promise<string | undefined> {
        if (!cachePath){
            const setWin = this.windowsManager.getWinById(WindowNames.SettingWin)
            const selectPath = await this.sysDialogService.openSelectDirDialog(setWin.originWin)
            if (selectPath){
                await this.setCachePathAndFire(selectPath)
                return selectPath
            }
        } else {
            await this.setCachePathAndFire(cachePath)
        }
    }

    async setDockShow(show: boolean): Promise<void> {
        return dockShow(show)
    }

    async setLogPath(logPath: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async getLogPath(): Promise<string> {
        return this.logPath ?? this.defaultLogPath;
    }

}
