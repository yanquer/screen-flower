import {IBaseWindow, IWindowsManager} from "../service";
import {bindContributions, bindToDefaultContainer} from "../../../common/container/inject-container";
import {WindowsManager} from "./windows-manager";
import {CaptureWindow} from "./capture-window";
import {SettingWindow} from "./setting-window";
import {PlayerWindow} from "./player-window";


export const bindWindows = () => {
    bindContributions(IBaseWindow, CaptureWindow)
    bindContributions(IBaseWindow, SettingWindow)
    bindContributions(IBaseWindow, PlayerWindow)

    bindToDefaultContainer(IWindowsManager, WindowsManager)
}

