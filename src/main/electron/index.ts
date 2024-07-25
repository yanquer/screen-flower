import {bindWindows} from "./windows";
import {bindDisplay} from "./dispaly";
import {bindToDefaultContainer} from "../../common/container/inject-container";
import {ISysDialogService} from "./service";
import {SysDialogService} from "./sys-dialog-service";
import {LocalProtocol} from "./local-protocol";


export const bindElectron = (): void => {
    LocalProtocol.init()

    bindWindows()
    bindDisplay()

    bindToDefaultContainer(ISysDialogService, SysDialogService);
}
