import { IpcHandler } from '../main/preload'
import {IpcInvokeHandler} from "../main/preload-ext";

declare global {
  interface Window {
    ipc: IpcHandler
    ipcInvoke: IpcInvokeHandler
  }
}
