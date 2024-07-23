
import log from 'electron-log/main';
import {MainLogger} from "electron-log";

const logInit = () => {
    // Optional, initialize the logger for any renderer process
    log.initialize();
    // log.transports.console.format = '{h}:{i}:{s} {text}';
    const logFile = log.transports.file.getFile();
    console.log(`>> log file: ${logFile}`)
}

logInit()

export const Logger: MainLogger = log



