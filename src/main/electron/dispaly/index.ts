import {bindToDefaultContainer, getServiceBySymbol, Logger} from "@yanquer/common";
import {IScreenManager} from "../service";
import {ScreenManager} from "./screen-manager";


export const bindDisplay = () => {
    Logger.info('>> init bindDisplay')
    bindToDefaultContainer(IScreenManager, ScreenManager);

    // console.log("getServiceBySymbol(IScreenManager): ", getServiceBySymbol(IScreenManager))
    console.log("getServiceBySymbol(IScreenManager).mulDisplay: ", getServiceBySymbol<IScreenManager>(IScreenManager)?.mulDisplay)
}
