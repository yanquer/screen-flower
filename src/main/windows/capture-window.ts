import {BrowserWindow} from "electron";
import {createWindow} from "../helpers";
import {BaseWidget} from "../common/base";


export class CaptureWidget extends BaseWidget{
    url: string = '/capture'
    name = 'capture-win'
    options = {
        width: 400,
        height: 400,
        frame: false
    }
}
