import {BrowserWindow} from "electron";
import {Logger} from "../../common/logger";


export namespace WindowsUtils {

    // 设置窗口支持点击穿透
    export const clickPenetrateWindow = (win?: BrowserWindow, allow: boolean=false,) => {

        Logger.info(`>>> clickPenetrateWindow: ${allow}`);
        allow ? win?.setIgnoreMouseEvents(true, {forward: true}) :
            win?.setIgnoreMouseEvents(false,)
    }


}
