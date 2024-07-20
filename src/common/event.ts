export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any): any
}

type Callback = (...args: any[]) => any
class CallbackList implements Iterable<Callback> {
  _data: Callback[]

  constructor(data?: Callback[]) {
    this._data = data ?? []
  }

  [Symbol.iterator](): Iterator<Callback> {
    return this._data[Symbol.iterator]()
  }

  invoke(...args: any[]): any[] {
    const ret = []
    for (const callback of this._data) {
      ret.push(callback(...args))
    }
    return ret
  }

  add(val: Callback) {
    this._data.push(val)
  }

  remove(val: Callback) {
    const find = this._data.indexOf(val)
    if (find !== -1) this._data.splice(find, 1)
  }

  has(val: Callback) {
    return this._data.indexOf(val) !== -1
  }
}

export class Emitter<T> {
  protected _event?: Event<T>
  protected _callbacks: CallbackList

  constructor() {
    this._callbacks = new CallbackList()
  }

  get event(): Event<T> {
    if (!this._event) {
      this._event = (listener: (e: T) => any, thisArgs?: any) => {
        if (this._callbacks.has(listener)) return
        // console.log(thisArgs, 'event...')
        this._callbacks.add(listener)
      }
    }
    return this._event
  }

  fire(eventArgs: T): any {
    if (this._callbacks) {
      return this._callbacks.invoke(eventArgs)
    }
  }
}
