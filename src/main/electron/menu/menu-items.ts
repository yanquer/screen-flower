
import {MenuNames} from "./menu-names";
import {AppManager} from "../manager/app-manager";

export const getAboutMenuItem = () => ({
    id: MenuNames.about,
    label: `关于`,
    // label: `About ${app.name}`,
    click: () => {
        // windowManager.cropper?.close();
        AppManager.focus();
        AppManager.showAboutPanel();
    }
});


export const forceQuit = () => ({
    id: MenuNames.forceQuit,
    label: `强制退出`,
    click: () => {
        AppManager.quitApp()
    }
})


