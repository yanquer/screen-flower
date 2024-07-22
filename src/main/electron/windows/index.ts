import {IBaseWindow, IWindowsManager} from "../service";
import {bindContributions, bindToDefaultContainer} from "../../../common/container/inject-container";
import {WindowsManager} from "./windows-manager";
import {CaptureWindow} from "./capture-window";


export const bindWindows = () => {
    bindContributions(IBaseWindow, CaptureWindow)

    bindToDefaultContainer(IWindowsManager, WindowsManager)
}

