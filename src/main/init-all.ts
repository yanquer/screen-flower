// for inject
import 'reflect-metadata'

import {initializeMenu} from "./menu";
import {bindWindows} from "./windows";
import {join} from "path";

export const initAll = () => {
    bindWindows()

    console.log(">> ", __dirname)
    // initializeMenu(join(__dirname, "../", "resources", "logo.png"))
    // initializeMenu(join("../", "resources", "1.jpg"))
    initializeMenu(join("images", "logo.png"))
}
