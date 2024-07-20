

import {Tray, MenuItemConstructorOptions, MenuItem, app} from 'electron';
import {forceQuit, getAboutMenuItem} from "./menu-items";


let tray: Tray;

export const getMenuTemplate = async (): Promise<Array<(MenuItemConstructorOptions) | (MenuItem)>> => [
    getAboutMenuItem(),
    {
        type: 'separator'
    },
    {
        role: 'quit',
        accelerator: 'Command+Q'
    },
    forceQuit(),

];


