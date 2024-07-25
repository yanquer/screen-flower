import {app, MenuItem, MenuItemConstructorOptions} from 'electron';
import {forceQuit, getAboutMenuItem} from "./menu-items";
import {MenuNames} from "./menu-names";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IWindowsManager} from "../electron/service";
import {WindowNames} from "../../common/defines";


export const getMenuTemplate = async (): Promise<Array<(MenuItemConstructorOptions) | (MenuItem)>> => [
    {
        id: MenuNames.startRecordPage,
        label: `启动录制`,
        click: () => {
            const winManager = getServiceBySymbol<IWindowsManager>(IWindowsManager)
            app.focus();
            winManager.openWinById(WindowNames.CaptureWin)
        }
    },
    {
        id: MenuNames.openVideo,
        label: `打开视频`,
        click: () => {
            const winManager = getServiceBySymbol<IWindowsManager>(IWindowsManager)
            app.focus();
            winManager.openWinById(WindowNames.PlayerWin)
        }
    },
    {
        id: MenuNames.settingView,
        label: `设置`,
        click: () => {
            const winManager = getServiceBySymbol<IWindowsManager>(IWindowsManager)
            app.focus();
            winManager.openWinById(WindowNames.SettingWin, true)
        }
    },
    getAboutMenuItem(),
    {
        type: 'separator'
    },
    {
        label: "退出",
        role: 'quit',
        accelerator: 'Command+Q'
    },
    forceQuit(),

];


