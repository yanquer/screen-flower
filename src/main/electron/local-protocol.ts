import {net, protocol } from "electron"
import {ProtocolViaLocal} from "../../common/defines";
import {pathToFileURL} from 'node:url'
import {join} from "path";
import {Logger} from "../common/logger";

export namespace LocalProtocol {

    export const registerBeforeApp = () => {
        Logger.info(">> LocalProtocol.registerBeforeApp");
        protocol.registerSchemesAsPrivileged([
            {
                scheme: ProtocolViaLocal,
                privileges: {
                    standard: true,
                    secure: true,
                    supportFetchAPI: true,
                    stream: true,
                }
            }
        ])
    }

    const initProtocol = (): void => {
        protocol.handle(ProtocolViaLocal, (request) => {
            Logger.info(`>> get req from protocol origin: ${request.url}`)
            const filePath = request.url.slice(`${ProtocolViaLocal}:/`.length)
            Logger.info(`>> get req from protocol: ${filePath}`)
            // return net.fetch(pathToFileURL(join(__dirname, filePath)).toString())
            // 兼容中文路径
            const originUrl = decodeURI(pathToFileURL(filePath).toString())
            const ret = net.fetch(originUrl)
            Logger.info(`>> get req from protocol ret: ${ret}`)
            return ret
        })
    }

    export const init = () => {
        initProtocol()
    }
}
