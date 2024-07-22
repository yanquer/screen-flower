import {BrowserWindow, BrowserWindowConstructorOptions} from "electron";
import {WindowNames} from "../common/defines";
import {Event} from "../../common/event";
import {CaptureArea, CursorPosition, ScreenArea} from "../../common/models";


export const IBaseWindow = Symbol("IBaseWindow");
export interface IBaseWindow {
    id: WindowNames
    url: string
    options?: BrowserWindowConstructorOptions
    win?: BrowserWindow;

    windowHideEmitterEvent: Event<WindowNames>

    open(): Promise<void>;
    initWindow(): BrowserWindow
    loadWindow(): Promise<void>
    // 是否允许点击穿透
    setAllowPenetrate(allow: boolean): Promise<void>
}


export const IWindowsManager = Symbol.for("IWindowsManager");
export interface IWindowsManager{
    registerWin(id: WindowNames, win: IBaseWindow): void
    getWinById(id: WindowNames): IBaseWindow
}


export const IScreenManager = Symbol.for("IScreenManager");
export interface IScreenManager {
    refreshDisplayEvent: Event<void>
    currentScreenId: string
    // 是否是多显示器
    mulDisplay: boolean

    getCurrentScreenArea(refresh?: boolean, fullArea?: boolean): ScreenArea;
    getCurrentScreenIndex(refresh?: boolean): number;

    //  获取鼠标在当前屏幕上的相对位置
    getCursorPosition(): CursorPosition;
    getCropAreaStr(area: CaptureArea): string
}




