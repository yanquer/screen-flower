
import {BrowserWindowConstructorOptions} from "electron";
import {injectable} from "@yanquer/common/common";
import {UniversalWindow} from "./universal-window";
import {WindowNames} from "../../../common/defines";
import {inject} from "@yanquer/common/common";
import {IScreenManager} from "../service";
import {IContextService} from "../../../common/service";


@injectable()
export class SettingWindow extends UniversalWindow {

    id = WindowNames.SettingWin

    url: string = 'setting'
    name = 'setting-win'

    @inject(IScreenManager) protected readonly screenManager: IScreenManager
    @inject(IContextService) protected readonly contextService: IContextService

    get winArea(){
        const {x, y, width, height} = this.screenManager.getCurrentScreenArea()
        const initArea = {width: 400, height: 550}
        const cx = x + width / 2 - initArea.width / 2
        const cy = y + height / 2 - initArea.height / 2
        return {x: cx, y: cy, width: initArea.width, height: initArea.height}
    }

    get extOption(): BrowserWindowConstructorOptions{
        return {
            title: "设置",
            resizable: false,
        }
    }

    async extOperation() {
        await super.extOperation()
    }
}

