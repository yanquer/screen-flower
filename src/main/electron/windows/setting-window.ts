
import {WindowNames} from "../../common/defines";
import {BrowserWindowConstructorOptions} from "electron";
import {injectable} from "inversify";
import {UniversalWindow} from "./universal-window";


@injectable()
export class SettingWindow extends UniversalWindow {

    id = WindowNames.SettingWin

    url: string = 'setting'
    name = 'setting-win'

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
        }
    }

    async extOperation() {
        await super.extOperation()
    }
}

