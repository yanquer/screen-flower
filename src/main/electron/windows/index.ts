import {IBaseWindow, IWindowsManager} from "../service";
import {bindContributions, bindToDefaultContainer} from "@yanquer/common";
import {WindowsManager} from "./windows-manager";
import {CaptureWindow} from "./capture-window";
import {SettingWindow} from "./setting-window";
import {PlayerWindow} from "./player-window";
import {NotifyWindow} from "./notify-window";


export const bindWindows = () => {
    bindContributions(IBaseWindow, CaptureWindow)
    bindContributions(IBaseWindow, SettingWindow)
    bindContributions(IBaseWindow, PlayerWindow)
    bindContributions(IBaseWindow, NotifyWindow)

    bindToDefaultContainer(IWindowsManager, WindowsManager)
}

