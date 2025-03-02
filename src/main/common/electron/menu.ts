import {AppManager} from "../../electron/manager/app-manager";
import {MenuManager} from "../../electron/manager/menu-manager";


export const setNoMenuDock = () => {
    // 设置空菜单来禁用菜单栏, 无效...
    MenuManager.setApplicationMenu(null);

    // 这个才有效
    dockShow(false)
}

export const dockShow = (show: boolean) => {
    show ? AppManager.dock.show() : AppManager.dock.hide()
}
