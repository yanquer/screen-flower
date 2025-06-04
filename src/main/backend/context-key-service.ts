import {IContextService} from "../../common/service";
import {Emitter, Event} from "@yanquer/common/common";
import {injectable} from "@yanquer/common/common";
import {ContextKey} from "../../common/defines";


@injectable()
export class ContextKeyService implements IContextService{
    protected valChangeEmitter = new Emitter<{key: ContextKey, value: any}>()
    onValChangeEvent: Event<{key: ContextKey, value: any}> = this.valChangeEmitter.event

    protected dataMap: {[key: string]: any} = {}

    getValByKey(key: ContextKey) {
        return this.dataMap[key]
    }

    setKeyVal(key: ContextKey, value: any) {
        if (this.dataMap[key] !== value) {
            this.dataMap[key] = value;
            this.valChangeEmitter.fire({key, value})
        }
    }
}
