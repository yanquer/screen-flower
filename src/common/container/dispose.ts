import {injectable} from "inversify";


// export const IDispose = Symbol.for('IDispose');
export interface IDispose {
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

    protected addServiceToCleanUp(serviceIns: IDispose){
        addToCleanDispose(serviceIns)
    }
}




