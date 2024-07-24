

import {MenuItemConstructorOptions, MenuItem, app} from 'electron';
import {forceQuit, getAboutMenuItem} from "./menu-items";
import {MenuNames} from "./menu-names";


export const getMenuTemplate = async (): Promise<Array<(MenuItemConstructorOptions) | (MenuItem)>> => [
    {
        id: MenuNames.startRecordPage,
        label: `启动录制`,
        click: () => {
            app.focus();
        }
    },
    {
        id: MenuNames.settingView,
        label: `设置`,
        click: () => {
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


