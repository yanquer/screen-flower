import {net, protocol } from "electron"
import {ProtocolViaLocal} from "../../common/defines";
import {pathToFileURL} from 'node:url'
import {join} from "path";

export namespace LocalProtocol {

    const initProtocol = (): void => {
        protocol.handle(ProtocolViaLocal, (request) => {
            const filePath = request.url.slice(ProtocolViaLocal.length)
            // return net.fetch(pathToFileURL(join(__dirname, filePath)).toString())
            return net.fetch(pathToFileURL(filePath).toString())
        })
    }

    export const init = () => {
        initProtocol()
    }
}
