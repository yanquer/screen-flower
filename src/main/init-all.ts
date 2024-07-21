// for inject
import 'reflect-metadata'

import {initializeMenu} from "./menu";
import {bindWindows} from "./windows";
import {join} from "path";
import {ensureScreenCapturePermissions} from "./common/permissions";
import {bindMiddle} from "./middle";
import {bindBackend} from "./backend";

export const initAll = () => {
    bindWindows()

    // console.log(">> ", __dirname)
    // const img = join(__dirname, "../resources/1.jpg")
    const img = join(__dirname, "../resources/icon_16x16.png")
    // console.log(">> ", img)
    initializeMenu(img)

    bindBackend()
    bindMiddle()
}

export const getPermission = () => {
    ensureScreenCapturePermissions()
}
