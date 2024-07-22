import {Menu, Tray, MenuItemConstructorOptions, MenuItem, app} from 'electron';
import {getMenuTemplate} from "../common/menu/template";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IWindowsManager} from "../electron/service";
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

    // tray = new Tray(menuImg);
    // mac只能用nativeImage
    tray = new Tray(nativeImage.createFromPath(menuImg));
    tray.on('click', async () => {await capWin.open()});
    tray.on('right-click', openContextMenu);
    tray.on('drop-files', (_, files) => {

    });

    return tray;
}

