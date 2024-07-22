import {bindWindows} from "./windows";
import {bindDisplay} from "./dispaly";


export const bindElectron = (): void => {
    bindWindows()
    bindDisplay()
}