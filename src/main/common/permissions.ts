import {app, dialog, shell} from "electron";
import {hasScreenCapturePermission, hasPromptedForPermission, openSystemPreferences} from 'mac-screen-capture-permissions';
import {ensureDockIsShowing} from "./platform/dock";


let isDialogShowing = false;

const promptSystemPreferences = (options: {message: string; detail: string; systemPreferencesPath: string}) => async ({hasAsked}: {hasAsked?: boolean} = {}) => {
    if (hasAsked || isDialogShowing) {
        return false;
    }

    isDialogShowing = true;
    await ensureDockIsShowing(async () => {
        const {response} = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Open System Preferences', 'Cancel'],
            defaultId: 0,
            message: options.message,
            detail: options.detail,
            cancelId: 1
        });
        isDialogShowing = false;

        if (response === 0) {
            await openSystemPreferences();
            app.quit();
        }
    });

    return false;
};

// export const openSystemPreferences = async (path: string) => shell.openExternal(`x-apple.systempreferences:com.apple.preference.security?${path}`);

const screenCaptureFallback = promptSystemPreferences({
    message: 'screen-flower cannot record the screen.',
    detail: 'screen-flower requires screen capture access to be able to record the screen. You can grant this in the System Preferences. Afterwards, launch Kap for the changes to take effect.',
    systemPreferencesPath: 'Privacy_ScreenCapture'
});


export const ensureScreenCapturePermissions = (fallback = screenCaptureFallback) => {
    const hadAsked = hasPromptedForPermission();

    const hasAccess = hasScreenCapturePermission();

    if (hasAccess) {
        return true;
    }

    fallback({hasAsked: !hadAsked}).then();
    return false;
};
