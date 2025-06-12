

import {injectable, injectFromBase} from "@yanquer/common";
import {UniversalWindow} from "./universal-window";
import {WindowNames} from "../../../common/defines";
import {BrowserWindowConstructorOptions} from "electron";


@injectable()
@injectFromBase({
    extendConstructorArguments: true,
    extendProperties: true,
})
export class PlayerWindow extends UniversalWindow {

    id = WindowNames.PlayerWin

    url: string = 'preview'
    name = 'player-win'

    get extOption(): BrowserWindowConstructorOptions{
        return {
            frame: false,
        }
    }

    async extOperation(): Promise<void> {
        await super.extOperation();

        // this.win?.webContents.openDevTools()
    }


}

