import {bindToDefaultContainer} from "../../common/container/inject-container";
import {IFileService} from "../../common/service";
import {FileService} from "./file-service";


export const bindBackend = () => {
    bindToDefaultContainer(IFileService, FileService)
}