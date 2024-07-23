import {app} from "electron";
import {MenuNames} from "./menu-names";

export const getAboutMenuItem = () => ({
    id: MenuNames.about,
    label: `About ${app.name}`,
    click: () => {
        // windowManager.cropper?.close();
        app.focus();
        app.showAboutPanel();
    }
});


export const forceQuit = () => ({
    id: MenuNames.forceQuit,
    label: `强制退出`,
    click: () => {
        app.quit()
    }
})


