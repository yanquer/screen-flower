import {bindToDefaultContainer} from "../../../common/container/inject-container";
import {IScreenManager} from "../service";
import {ScreenManager} from "./screen-manager";


export const bindDisplay = () => {
    bindToDefaultContainer(IScreenManager, ScreenManager);
}