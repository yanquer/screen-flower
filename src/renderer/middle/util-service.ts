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

}