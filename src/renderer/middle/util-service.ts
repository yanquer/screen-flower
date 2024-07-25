import {IUtilService} from "../../common/service";
import {ServiceFactory} from "./service-factory";
import {injectable} from "inversify";


@injectable()
export class UtilService implements IUtilService{
    protected _backendService: any = ServiceFactory.utilService

    async setClickPenetrate(penetrate: boolean): Promise<void> {
        await this._backendService('setClickPenetrate', penetrate)
    }

    async getCursorScreenPoint(): Promise<{ x: number; y: number }> {
        return await this._backendService('getCursorScreenPoint')
    }

    async showFileInFolder(filePath: string): Promise<void> {
        return await this._backendService('showFileInFolder', filePath)
    }

    async askSelectAVideoFile(): Promise<Buffer | undefined> {
        return await this._backendService('askSelectAVideoFile');
    }

    async askOpenPreview(): Promise<void> {
        return await this._backendService('askOpenPreview');
    }

}
