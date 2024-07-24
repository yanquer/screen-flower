
import log from 'electron-log/main';
import {MainLogger} from "electron-log";

const logInit = () => {
    // Optional, initialize the logger for any renderer process
    log.initialize();
    // log.transports.console.format = '{h}:{i}:{s} {text}';
}

logInit()

export const DefaultLogFile = log.transports.file.getFile();
console.log(`>> log file: ${DefaultLogFile}`)
export const setLogFile = (logFile: string) => {
    // log.transports.setFile(logFile);
}

export const Logger: MainLogger = log



