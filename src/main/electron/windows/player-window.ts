
import {WindowNames} from "../../common/defines";
import {BrowserWindowConstructorOptions, Display, Event} from "electron";
import path from "path";
import {injectable} from "inversify";
import {UniversalWindow} from "./universal-window";


@injectable()
export class PlayerWindow extends UniversalWindow {

    id = WindowNames.PlayerWin

    url: string = 'preview'
    name = 'player-win'



}

