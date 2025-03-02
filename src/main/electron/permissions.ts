
import {
    hasPromptedForPermission,
    hasScreenCapturePermission,
    openSystemPreferences
} from 'mac-screen-capture-permissions';
import {ensureDockIsShowing} from "./platform/dock";
import {hasScreenPremise} from "../common/electron/electron-preferences";
import {Logger} from "../common/logger";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IWindowsManager} from "./service";
import {WindowNames} from "../../common/defines";
import {AppManager} from "./manager/app-manager";
import {DialogManager} from "./manager/dialog-manager";
import {asyncSleep} from "../../common/common";


let isDialogShowing = false;

const promptSystemPreferences = (options: {message: string; detail: string; systemPreferencesPath: string}) => async ({hasAsked}: {hasAsked?: boolean} = {}) => {
    if (hasAsked || isDialogShowing) {
        return false;
    }

    isDialogShowing = true;
    await ensureDockIsShowing(async () => {
        // 单独给一个窗口, 来保证弹出的dialog能自动弹出在最前显示
        const winManager = getServiceBySymbol<IWindowsManager>(IWindowsManager)
        const tempWin = winManager.getWinById(WindowNames.NotifyWin)
        await tempWin.open(true)
        await asyncSleep(1000)
        const {response} = await DialogManager.showMessageBox(tempWin.originWin, {
            type: 'warning',
            buttons: ['Open System Preferences', 'Cancel'],
            defaultId: 0,
            message: options.message,
            detail: options.detail,
            cancelId: 1,
        });
        isDialogShowing = false;

        if (response === 0) {
            await openSystemPreferences();
            // AppManager.quitApp()
        } else {
            AppManager.quitApp()
        }
    });

    return false;
};

// export const openSystemPreferences = async (path: string) => shell.openExternal(`x-apple.systempreferences:com.apple.preference.security?${path}`);

const screenCaptureFallback = promptSystemPreferences({
    message: 'screen-flower 无法录屏.',
    detail: 'screen-flower 需要获取 屏幕录制权限 来录屏. 您可以在系统偏好设置中授予此功能后, 重新启动应用程序以使更改生效.',
    systemPreferencesPath: 'Privacy_ScreenCapture'
});


export const ensureScreenCapturePermissions = (fallback = screenCaptureFallback) => {
    // 这两都比较老, 15上判断可能有问题
    const hadAsked = hasPromptedForPermission();
    const hasAccess = hasScreenCapturePermission();
    // 用 electron 的接口判断
    const electronHasPremise = hasScreenPremise();

    if (hasAccess || electronHasPremise) {
        Logger.debug('already has access');
        setTimeout(() => Logger.debug('already has access'), 3000)

        return true;
    }

    Logger.debug('ask for access');
    setTimeout(() => Logger.debug('ask for access'), 3000)
    fallback({hasAsked: !hadAsked}).then();
    return false;
};
