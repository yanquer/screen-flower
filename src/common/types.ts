export function isPromise(value: any): value is Promise<any> {
  return !!value && typeof value.then === 'function'
}

export type MaybePromise<T> = T | PromiseLike<T>
