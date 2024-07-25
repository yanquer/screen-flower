import { Container, interfaces } from 'inversify'
import { isPromise } from 'inversify/lib/utils/async'
import {Logger} from "../logger";

export const InjectContainer = new Container()

// export function bindToDefaultContainer<T>(
//     serviceIdentifier: interfaces.ServiceIdentifier<T>,
//     implementation: interfaces.Newable<T>
// ){
//   InjectContainer.bind<T>(serviceIdentifier).to(implementation).inSingletonScope()
// }

export const bindToDefaultContainer = <T>(
  serviceIdentifier: interfaces.ServiceIdentifier<T>,
  implementation: interfaces.Newable<T>
) => {
  InjectContainer.bind<T>(serviceIdentifier).to(implementation).inSingletonScope()
}

export const getServiceBySymbol = <T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T => {
  return InjectContainer.get<T>(serviceIdentifier)
}

export const bindContributions = <T>(
  serviceIdentifier: interfaces.ServiceIdentifier<T>,
  implementation: interfaces.Newable<T>
) => {
  InjectContainer.bind<T>(serviceIdentifier).to(implementation).inSingletonScope()
}

export const getDefaultContainer = (): Container => {
  return InjectContainer
}

export const invokeInterfaceFun = async <T>(
  serviceIdentifier: interfaces.ServiceIdentifier<T>,
  ...args: any[]
): Promise<any> => {
  const [funName, ...extArgs] = args
  const interface_: any = getServiceBySymbol(serviceIdentifier)
  if (!funName) return interface_
  Logger.log(`>> invokeInterfaceFun: ${interface_} -- ${funName}`)
  Logger.log(extArgs)
  let ret = interface_[funName](...extArgs)
  if (isPromise(ret)) ret = await ret
  return ret
}
