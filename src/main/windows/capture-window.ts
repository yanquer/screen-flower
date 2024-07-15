

import {BaseSFWindow} from "./base";
import {WindowNames} from "../common/defines";
import {injectable} from "inversify";

@injectable()
export class CaptureWindow extends BaseSFWindow{
    id = WindowNames.CaptureWin

    url: string = '/capture'
    name = 'capture-win'
    options = {
        width: 400,
        height: 400,
        frame: false
    }
}
