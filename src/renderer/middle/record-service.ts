import {IRecordService} from "../../common/service";
import {BaseToElectron} from "./base-model";
import {ServiceFactory} from "./service-factory";
import {injectable} from "inversify";
import {CaptureArea} from "../../common/models";


@injectable()
export class RecordService extends BaseToElectron implements IRecordService{
    protected _backendService: any = ServiceFactory.recordService

    async pauseRecord(): Promise<void> {
        return await this._backendService('pauseRecord')
    }

    async restartRecord(): Promise<void> {
        return await this._backendService('restartRecord')

    }

    async resumeRecord(): Promise<void> {
        return await this._backendService('resumeRecord')

    }

    async startRecord(area: CaptureArea, savePath?: string,): Promise<void> {
        return await this._backendService('startRecord', area, savePath)

    }

    async stopRecord(onlyStr?: boolean): Promise<Buffer|string|undefined>{
        return await this._backendService('stopRecord', onlyStr)

    }

    async cancelRecord(): Promise<void> {
        return this._backendService('cancelRecord')
    }

    async recordBgImage(area: CaptureArea, savePath?: string, relative?: boolean): Promise<Buffer | undefined> {
        return await this._backendService('recordBgImage', area, savePath, relative)
    }

}
