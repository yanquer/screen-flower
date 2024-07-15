export class Barrier<T> {
  _barrierWait: Promise<T>
  _barrierWaitResolve?: (value: T | PromiseLike<T>) => void
  _barrierWaitReject?: (reason?: any) => void

  constructor() {
    this._barrierWait = new Promise<T>((resolve, reject) => {
      this._barrierWaitResolve = resolve
      this._barrierWaitReject = reject
    })
  }

  async wait() {
    await this._barrierWait
  }

  async pass(val: T) {
    this._barrierWaitResolve?.(val)
  }

  async failed(reason?: any) {
    this._barrierWaitReject?.(reason)
  }
}
