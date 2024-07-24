import {app, MenuItem, MenuItemConstructorOptions} from 'electron';
import {forceQuit, getAboutMenuItem} from "./menu-items";
import {MenuNames} from "./menu-names";
import {getServiceBySymbol} from "../../../common/container/inject-container";
import {IWindowsManager} from "../../electron/service";
import {WindowNames} from "../defines";


export const getMenuTemplate = async (): Promise<Array<(MenuItemConstructorOptions) | (MenuItem)>> => [
    {
        id: MenuNames.startRecordPage,
        label: `启动录制`,
        click: () => {
            const winManager = getServiceBySymbol<IWindowsManager>(IWindowsManager)
            const capWin = winManager.getWinById(WindowNames.CaptureWin)
            if (capWin) {
                app.focus();
                capWin.open()
            }
        }
    },
    {
        id: MenuNames.settingView,
        label: `设置`,
        click: () => {
            // todo: 设置视图
            app.focus();
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


