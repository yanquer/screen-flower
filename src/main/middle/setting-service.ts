import {ISettingService} from "../../common/service";
import {injectable} from "inversify";
import {dockShow} from "../common/electron/menu";
import {join} from "path";
import {getHomeDir} from "../common/dynamic-defines";
import {DefaultLogFile} from "../common/logger";

@injectable()
export class SettingService implements ISettingService{

    protected defaultCacheDir = join(getHomeDir(), "./screen-recorder");
    protected defaultLogPath: string = DefaultLogFile.path
    protected cacheDir: string
    protected logPath: string

    async getCachePath(): Promise<string>{
        return this.getCachePathSync()
    }

    getCachePathSync(){
        return this.cacheDir ?? this.defaultCacheDir
    }

    async setCachePath(cachePath: string): Promise<void> {
        this.cacheDir = cachePath;
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
