// for inject
import 'reflect-metadata'

import {initializeMenu} from "./menu";
import {bindWindows} from "./windows";
import {join} from "path";
import {ensureScreenCapturePermissions} from "./common/permissions";
import {bindMiddle} from "./middle";
import {bindBackend} from "./backend";
import {app} from "electron";
import {getNeedCleanDispose, IDispose} from "../common/container/dispose";

const cleanUp = () => {
    const needClean = getNeedCleanDispose()
    needClean.map(((disposeIns: IDispose) => {
        disposeIns.dispose?.();
    }))
}

export const initAll = () => {
    bindWindows()

    // console.log(">> ", __dirname)
    // const img = join(__dirname, "../resources/1.jpg")
    const img = join(__dirname, "../resources/icon_16x16.png")
    // console.log(">> ", img)
    initializeMenu(img)

    bindBackend()
    bindMiddle()

    app.on('quit', () => {
        cleanUp()
    })
}

export const getPermission = () => {
    ensureScreenCapturePermissions()
}
