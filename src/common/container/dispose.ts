import {injectable} from "inversify";


// export const IDispose = Symbol.for('IDispose');
export interface IDispose {
    value?: string
    dispose(): void;
}


const CleanUpCollections: IDispose[] = []
export const addToCleanDispose = (serviceIns: IDispose) => {
    if (CleanUpCollections.indexOf(serviceIns) === -1){
        CleanUpCollections.push(serviceIns)
    }
}
export const getNeedCleanDispose = (): IDispose[] => CleanUpCollections


@injectable()
export class Dispose implements IDispose{
    dispose(){}

    constructor() {
        this.addServiceToCleanUp(this)
    }

    protected addServiceToCleanUp(serviceIns: IDispose){
        addToCleanDispose(serviceIns)
    }
}




