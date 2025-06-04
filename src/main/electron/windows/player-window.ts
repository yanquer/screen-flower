

import {injectable} from "@yanquer/common/common";
import {UniversalWindow} from "./universal-window";
import {WindowNames} from "../../../common/defines";
import {BrowserWindowConstructorOptions} from "electron";
import {inject} from "@yanquer/common/common";
import {IScreenManager} from "../service";
import {IContextService} from "../../../common/service";


@injectable()
export class PlayerWindow extends UniversalWindow {

    id = WindowNames.PlayerWin

    url: string = 'preview'
    name = 'player-win'

    @inject(IScreenManager) protected readonly screenManager: IScreenManager
    @inject(IContextService) protected readonly contextService: IContextService

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

