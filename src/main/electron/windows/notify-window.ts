

import {injectable, postConstruct, asyncSleep} from "@yanquer/common/common";
import {Event, Display, BrowserWindowConstructorOptions} from "electron";
import {ContextKey, HandlerStr, WindowNames} from "../../../common/defines";
import {UniversalWindow} from "./universal-window";
import {isProd} from "../../common/defines";
import {inject} from "@yanquer/common/common";
import {IScreenManager} from "../service";
import {IContextService} from "../../../common/service";

@injectable()
export class NotifyWindow extends UniversalWindow{
    id = WindowNames.NotifyWin

    url: string = 'notify'
    name = 'notify-win'
    preLoad = true

    @inject(IScreenManager) protected readonly screenManager: IScreenManager
    @inject(IContextService) protected readonly contextService: IContextService

    get winArea(){
        const {x, y, width, height} = this.screenManager.getCurrentScreenArea()
        const initArea = {width: 260, height: 270}
        const cx = x + width / 2 - initArea.width / 2
        const cy = y + height / 2 - initArea.height / 2
        return {x: cx, y: cy, width: initArea.width, height: initArea.height}
    }

    get extOption(): BrowserWindowConstructorOptions  {
        return {
            // frame: false,
            // transparent: true,
            // enableLargerThanScreen: true,
            movable: false,
            alwaysOnTop: isProd,
            opacity: 0,
            // autoHideMenuBar: true,
            titleBarStyle: 'default'
        } as BrowserWindowConstructorOptions
    }

    async extOperation(){
        await super.extOperation()

        // 设置全屏可见
        // this.win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true})
        this.win.moveTop()
        await asyncSleep(1000)
        this.win.setAlwaysOnTop(false, "normal")

    }

}
