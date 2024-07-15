import {Menu, Tray, MenuItemConstructorOptions, MenuItem, app} from 'electron';
import {getMenuTemplate} from "../common/menu/template";
import {getServiceBySymbol} from "../../common/inject-container";
import {IWindowsManager} from "../windows/base";
import {WindowNames} from "../common/defines";
import { nativeImage } from 'electron';


let tray: Tray;

const getCogMenu = async () => {
    return Menu.buildFromTemplate(
        await getMenuTemplate()
    );
};

const openContextMenu = async () => {
    tray.popUpContextMenu(await getCogMenu());
};

export const initializeMenu = (menuImg: string) => {
    const winManager = getServiceBySymbol<IWindowsManager>(IWindowsManager)
    const capWin = winManager.getWinById(WindowNames.CaptureWin)

    tray = new Tray(menuImg);
    // tray = new Tray(nativeImage.createFromPath(menuImg));
    tray.on('click', capWin.open);
    tray.on('right-click', openContextMenu);
    tray.on('drop-files', (_, files) => {

    });

    return tray;
}

