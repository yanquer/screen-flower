

import {injectable} from "inversify";
import {UniversalWindow} from "./universal-window";
import {WindowNames} from "../../../common/defines";


@injectable()
export class PlayerWindow extends UniversalWindow {

    id = WindowNames.PlayerWin

    url: string = 'preview'
    name = 'player-win'



}

