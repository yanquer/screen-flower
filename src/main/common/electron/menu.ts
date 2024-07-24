import {app, Menu} from "electron";


export const setNoMenuDock = () => {
    // 设置空菜单来禁用菜单栏, 无效...
    Menu.setApplicationMenu(null);

    // 这个才有效
    dockShow(false)
}

export const dockShow = (show: boolean) => {
    show ? app.dock.show() : app.dock.hide()
}
