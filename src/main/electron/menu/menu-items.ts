import {MenuNames} from "./menu-names";
import {AppManager} from "../manager/app-manager";
import {getServiceBySymbolMayNull} from "@yanquer/common";
import {IWindowsManager} from "../service";
import {WindowNames} from "../../../common/defines";

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

export const openDevTool = () => (
    {
        id: MenuNames.openDevTool,
        label: `开发者工具`,
        click: () => {
            getServiceBySymbolMayNull<IWindowsManager>(IWindowsManager)?.getWinById(WindowNames.SettingWin).openDevTools().then()
        }
    }
)

export const forceQuit = () => ({
    id: MenuNames.forceQuit,
    label: `强制退出`,
    click: () => {
        AppManager.quitApp()
    }
})


