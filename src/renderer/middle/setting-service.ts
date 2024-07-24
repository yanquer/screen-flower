import {ISettingService} from "../../common/service";
import {injectable} from "inversify";
import {ServiceFactory} from "./service-factory";

@injectable()
export class SettingService implements ISettingService{
    protected _backendService: any = ServiceFactory.settingService

    async getCachePath(): Promise<string> {
        return await this._backendService('getCachePath')
    }

    async getLogPath(): Promise<string> {
        return await this._backendService('getLogPath');
    }

    async setCachePath(cachePath: string): Promise<void> {
        return await this._backendService('setCachePath', cachePath);
    }

    async setDockShow(show: boolean): Promise<void> {
        return await this._backendService('setDockShow', show);
    }

    async setLogPath(logPath: string): Promise<void> {
        return await this._backendService('setLogPath', logPath);
    }

}
