import {Menu, Tray, MenuItemConstructorOptions, MenuItem, app} from 'electron';
import {getMenuTemplate} from "../common/menu/template";


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
    tray = new Tray(menuImg);
    tray.on('click', openCropperWindow);
    tray.on('right-click', openContextMenu);
    tray.on('drop-files', (_, files) => {

    });

    return tray;
}

