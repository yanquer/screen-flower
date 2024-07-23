// for inject
import 'reflect-metadata'

import {initializeMenu} from "./menu";
import {dirname, join} from "path";
import {ensureScreenCapturePermissions} from "./common/permissions";
import {bindMiddle} from "./middle";
import {bindBackend} from "./backend";
import {app} from "electron";
import {getNeedCleanDispose, IDispose} from "../common/container/dispose";
import {bindElectron} from "./electron";
import {isProd} from "./common/defines";

const cleanUp = () => {
    const needClean = getNeedCleanDispose()
    needClean.map(((disposeIns: IDispose) => {
        disposeIns.dispose?.();
    }))
}

export const initAll = () => {
    bindElectron()

    // console.log(">> ", __dirname)
    // const img = join(__dirname, "../resources/1.jpg")
    // const img = join(__dirname, "../resources/icon_16x16.png")

    // 只支持png和jpeg
    const img = isProd ?
        join(dirname(app.getPath('exe')), 'resources/icons/icon_16x16.png') :
        join(__dirname, "../resources/icons/icon_16x16.png")
    console.log(">> ", img)
    console.log(">> ", isProd)
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
