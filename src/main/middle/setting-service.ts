import {ISettingService} from "../../common/service";
import {inject, injectable, postConstruct} from "inversify";
import {dockShow} from "../common/electron/menu";
import {join} from "path";
import {getHomeDir} from "../common/dynamic-defines";
import {DefaultLogFile, Logger} from "../common/logger";
import {ISysDialogService, IWindowsManager} from "../electron/service";
import {Emitter, Event} from "../../common/event";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {WindowNames} from "../../common/defines";
import {LocalCache} from "../electron/local-cache";
import {SettingOptions} from "../../common/models";

@injectable()
export class SettingService implements ISettingService{

    protected defaultCacheDir = join(getHomeDir(), "./screen-recorder");
    protected defaultLogPath: string = DefaultLogFile.path

    @inject(IWindowsManager)
    protected readonly windowsManager: IWindowsManager;

    protected cachePathChangeEmitter = new Emitter<string>()
    cachePathChangeEvent: Event<string> = this.cachePathChangeEmitter.event

    async getCachePath(): Promise<string>{
        return this.getCachePathSync()
    }

    getCachePathSync(){
        return this.cacheSettingOptions.cacheDir
    }

    protected async setCachePathAndFire(cachePath: string): Promise<void> {
        if (cachePath && cachePath !== this.cacheSettingOptions.cacheDir) {
            this.cacheSettingOptions.cacheDir = cachePath
            this.saveSetting().then()
            this.cachePathChangeEmitter.fire(cachePath)
        }
    }

    async setOrSelectCachePath(cachePath?: string): Promise<string | undefined> {
        // 手动拿, 避免循环依赖
        const sysDialogService: ISysDialogService = getServiceBySymbol(ISysDialogService)
        if (!cachePath){
            const setWin = this.windowsManager.getWinById(WindowNames.SettingWin)
            const selectPath = await sysDialogService.openSelectDirDialog(setWin.originWin)
            if (selectPath){
                await this.setCachePathAndFire(selectPath)
                return selectPath
            }
        } else {
            await this.setCachePathAndFire(cachePath)
        }
    }

    async getDockShow(): Promise<boolean> {
        return !this.cacheSettingOptions.hiddenDock as boolean
    }
    async setDockShow(show: boolean, save=true): Promise<void> {
        if (save){
            this.cacheSettingOptions.hiddenDock = !show
            this.saveSetting().then()
        }
        return dockShow(show)
    }

    async setLogPath(logPath: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async getLogPath(): Promise<string> {
        return this.cacheSettingOptions.logFile
    }

    @postConstruct()
    protected init(){
        this.initSetting().then()
    }

    // local setting
    protected settingKey = 'sf-setting'
    protected cacheSettingOptions: SettingOptions = {
        logFile: this.defaultLogPath,
        cacheDir: this.defaultCacheDir,
        hiddenDock: true,
    }
    protected async initSetting() {
        const data: SettingOptions = LocalCache.getValue<SettingOptions>(this.settingKey)
        Logger.info('>> get cache setting ')
        Logger.info(data)
        if (data){
            if (data.hiddenDock && data.hiddenDock !== this.cacheSettingOptions.hiddenDock){
                this.setDockShow(data.hiddenDock, false).then()
            }
            this.cacheSettingOptions = {
                ...this.cacheSettingOptions,
                ...data,
            }
            Logger.info('>> new setting')
            Logger.info(this.cacheSettingOptions)
        }
    }
    protected async saveSetting(){
        LocalCache.setValue(this.settingKey, this.cacheSettingOptions)
    }

}
