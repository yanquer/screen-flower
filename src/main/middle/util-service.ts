import {IUtilService} from "../../common/service";
import {inject, injectable} from "inversify";
import {IWindowsManager} from "../windows/base";
import {WindowNames} from "../common/defines";
import {getCurrentScreenPoint} from "../common/electron/display";


@injectable()
export class UtilService implements IUtilService{

    @inject(IWindowsManager)
    protected windowsManager: IWindowsManager;

    async setClickPenetrate(penetrate: boolean): Promise<void> {
        const capWin = this.windowsManager.getWinById(WindowNames.CaptureWin)
        if (capWin) {
            await capWin.setAllowPenetrate(penetrate)
        }
    }

    async getCursorScreenPoint(): Promise<{ x: number; y: number }> {
        return getCurrentScreenPoint();
    }

}
