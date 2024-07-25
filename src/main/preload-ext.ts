import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import {HandlerStr} from "../common/defines";

const handler = {
  fileService: (...args: []) => ipcRenderer.invoke(HandlerStr.serviceFileService, ...args),
  recordService: (...args: []) => ipcRenderer.invoke(HandlerStr.serviceRecordService, ...args),
  utilService: (...args: []) => ipcRenderer.invoke(HandlerStr.utilService, ...args),
  settingService: (...args: []) => ipcRenderer.invoke(HandlerStr.settingService, ...args),

  // main => render
  onHandleWindowHide: (callback: (...args: any[]) => any) => {
    ipcRenderer.on(HandlerStr.onWindowHide, (_event: IpcRendererEvent, ..._args: any[]) => {
      callback(..._args)
    })
  },
  onHandleWindowShow: (callback: (...args: any[]) => any) => {
    ipcRenderer.on(HandlerStr.onWindowShow, (_event: IpcRendererEvent, ..._args: any[]) => {
      callback(..._args)
    })
  },

}

contextBridge.exposeInMainWorld('ipcInvoke', handler)

export type IpcInvokeHandler = typeof handler
