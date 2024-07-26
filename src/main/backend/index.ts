import {bindToDefaultContainer} from "../../common/container/inject-container";
import {IContextService, IFileService} from "../../common/service";
import {FileService} from "./file-service";
import {ContextKeyService} from "./context-key-service";


export const bindBackend = () => {

    bindToDefaultContainer(IContextService, ContextKeyService)
    bindToDefaultContainer(IFileService, FileService)
}
