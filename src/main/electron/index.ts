import {bindWindows} from "./windows";
import {bindDisplay} from "./dispaly";
import {bindToDefaultContainer} from "../../common/container/inject-container";
import {ISysDialogService} from "./service";
import {SysDialogService} from "./sys-dialog-service";


export const bindElectron = (): void => {
    bindWindows()
    bindDisplay()

    bindToDefaultContainer(ISysDialogService, SysDialogService);
}