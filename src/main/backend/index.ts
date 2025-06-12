import {bindToDefaultContainer, IFileService} from "@yanquer/common";
import {IContextService} from "../../common/service";
import {FileService} from "./file-service";
import {ContextKeyService} from "./context-key-service";


export const bindBackend = () => {

    bindToDefaultContainer(IContextService, ContextKeyService)
    bindToDefaultContainer(IFileService, FileService)
}
