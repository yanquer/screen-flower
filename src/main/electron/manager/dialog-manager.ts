import {dialog} from "electron";

export namespace DialogManager {
    export const showOpenDialogSync = dialog.showOpenDialogSync
    export const showSaveDialogSync = dialog.showSaveDialogSync
    export const showMessageBox = dialog.showMessageBox

}
