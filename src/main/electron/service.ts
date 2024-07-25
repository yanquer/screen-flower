import {BrowserWindow, BrowserWindowConstructorOptions} from "electron";
import {WindowNames} from "../common/defines";
import {Event} from "../../common/event";
import {CaptureArea, CursorPosition, ScreenArea} from "../../common/models";


export const IBaseWindow = Symbol("IBaseWindow");
export interface IBaseWindow {
    id: WindowNames
    url: string
    options?: BrowserWindowConstructorOptions

    windowHideEmitterEvent: Event<WindowNames>

    originWin: BrowserWindow | undefined
    open(showNow?: boolean): Promise<void>;
    hide(): void;
    initWindow(): BrowserWindow
    loadWindow(): Promise<void>
    // 是否允许点击穿透
    setAllowPenetrate(allow: boolean): Promise<void>

    findWinByWebContentId(id: number): BrowserWindow | undefined
}


export const IWindowsManager = Symbol.for("IWindowsManager");
export interface IWindowsManager{
    registerWin(id: WindowNames, win: IBaseWindow): void
    getWinById(id: WindowNames): IBaseWindow
    openWinById(id: WindowNames, showNow?: boolean): Promise<void>
    hideAllWindows(): Promise<void>
    setWinHideEventById(id: WindowNames, evt: (arg: WindowNames) => any): void
    setClickPenetrateById(id: WindowNames | number, allow: boolean): Promise<void>
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

export interface DialogOptions{
    title?: string,
    defaultPath?: string,
    // 确认按钮的自定义标签
    buttonLabel?: string,
    filters: {name: string, extensions: string[]}[],
    properties: (
        // 允许选择文件
        "openFile" |
        // 允许选择文件夹
        "openDirectory" |
        // 允许多选
        "multiSelections" |
        // 显示对话框中的隐藏文件
        "showHiddenFiles" |
        // macOS -允许你通过对话框的形式创建新的目录
        "createDirectory" |
        // Windows-如果输入的文件路径在对话框中不存在, 则提示创建。 这并不是真的在路径上创建一个文件，而是允许返回一些不存在的地址交由应用程序去创建。
        "promptToCreate" |
        // macOS-禁用自动的别名路径(符号链接) 解析。 所选别名现在将会返回别名路径而非其目标路径。
        "noResolveAliases" |
        //  macOS -将包 (如 .app 文件夹) 视为目录而不是文件。
        "treatPackageAsDirectory"
        )[],
    // macOS -显示在输入框上方的消息
    message?: string,
    //  (可选) macOS MAS - 在打包提交到Mac App Store时创建 security scoped bookmarks
    securityScopedBookmarks?: boolean,
}
export const ISysDialogService = Symbol.for("ISysDialogService");
export interface ISysDialogService{
    openSelectFileDialog(win: BrowserWindow, defaultPath?: string): Promise<string | undefined>;
    openSelectDirDialog(win: BrowserWindow, defaultPath?: string): Promise<string | undefined>;
    openSaveFileDialog(win: BrowserWindow, defaultPath?: string): Promise<string | undefined>;
}



