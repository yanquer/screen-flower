import Store from 'electron-store'
import {app} from "electron";
import {Logger} from "../common/logger";

export namespace LocalCache {
    const cachePath = () => {
        return app.getPath('userData');
    }
    Logger.info(`>> LocalCache cache to ${cachePath()}`)

    const store = new Store({})

    export const setValue = (key: string, value: any) => {
        Logger.info(`>> LocalCache set value to ${key}`)
        Logger.info(value)
        store.set(key, value);
    }
    export const getValue = <T>(key: string): T | undefined => {
        return store.get(key) as T;
    }

}
