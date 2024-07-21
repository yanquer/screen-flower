import {IRecordService} from "../../common/service";
import {BaseToElectron} from "./base-model";
import {ServiceFactory} from "./service-factory";
import {injectable} from "inversify";
import {CaptureArea} from "../../common/models";
import {Blob} from "node:buffer";


@injectable()
export class RecordService extends BaseToElectron implements IRecordService{
    protected _backendService: any = ServiceFactory.recordService

    async pauseRecord(): Promise<void> {
        return this._backendService('pauseRecord')
    }

    async restartRecord(): Promise<void> {
        return this._backendService('restartRecord')

    }

    async resumeRecord(): Promise<void> {
        return this._backendService('resumeRecord')

    }

    async startRecord(area: CaptureArea, savePath?: string,): Promise<void> {
        return this._backendService('startRecord', area, savePath)

    }

    async stopRecord(): Promise<void> {
        return this._backendService('stopRecord')

    }

    async cancelRecord(): Promise<void> {
        return this._backendService('cancelRecord')
    }

    async recordBgImage(area: CaptureArea, savePath?: string, relative?: boolean): Promise<Buffer | undefined> {
        return await this._backendService('recordBgImage', area, savePath, relative)
    }

}