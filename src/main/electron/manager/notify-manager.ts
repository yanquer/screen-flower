import {Notification} from "electron";
import {Logger} from "../../common/logger";

export namespace NotifyManager {
    export const sendNotify = (message: string, title="Screen Flower") => {
        if (Notification.isSupported()) {
            const notification = new Notification({
                title: title,
                body: message
            });
            notification.show();
        } else {
            Logger.log('Notifications are not supported on this platform.');
        }
    }
}
