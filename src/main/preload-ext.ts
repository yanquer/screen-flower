import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import {HandlerStr} from "../common/defines";

const handler = {
  fileService: (...args: []) => ipcRenderer.invoke(HandlerStr.serviceFileService, ...args),
  recordService: (...args: []) => ipcRenderer.invoke(HandlerStr.serviceRecordService, ...args),
  utilService: (...args: []) => ipcRenderer.invoke(HandlerStr.utilService, ...args),

}

contextBridge.exposeInMainWorld('ipcInvoke', handler)

export type IpcInvokeHandler = typeof handler
