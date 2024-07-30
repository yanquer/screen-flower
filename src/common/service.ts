
import { MenuItem, MenuItemConstructorOptions } from 'electron'
import {ContextKey, ContextMenuNames} from "./defines";
import {CaptureArea, VideoArgs} from "./models";
import {Event} from "./event";

export const IFileService = Symbol('IFileService')
export interface IFileService {
  isExists(path: string): Promise<boolean>
  open(path: string): Promise<string>
  openBuffer(path: string): Promise<Buffer | undefined>
  openYaml<T>(path: string): Promise<T>

  write(path: string, data: any): Promise<void>
  writeYaml(path: string, data: any): Promise<void>

  isFile(name: string): Promise<boolean>
  isDir(name: string): Promise<boolean>

  readDir(path: string, recursive?: boolean | number): Promise<string[]>
  mkDir(path: string, recursive?: boolean | number): Promise<boolean>

  move(originPath: string, newPath: string): Promise<boolean>
  copy?(originPath: string, newPath: string): Promise<boolean>
}


export const IRightContextMenuManager = Symbol.for('IRightContextMenuManager')
export interface IRightContextMenuManager {
  buildMenuByName(
    name: ContextMenuNames,
    position: { x: number; y: number },
    event: any
  ): Promise<boolean>
}

export const IContextMenuTemplate = Symbol.for('IContextMenuTemplate')
export interface IContextMenuTemplate {
  name: ContextMenuNames
  dataTemplate: Array<MenuItemConstructorOptions | MenuItem>
  commonArgs: {
    curEvent: any
  }
}

export const IRecordService = Symbol.for('IRecordService')
export interface IRecordService {
  recordingRunEmitterEvent?: Event<boolean>
  recentRecordPath?: string | undefined

  startRecord(area: CaptureArea, savePath?: string,): Promise<void>
  pauseRecord(): Promise<void>
  resumeRecord(): Promise<void>
  restartRecord(): Promise<void>
  stopRecord(onlyStr?: boolean, webContentId?: number): Promise<Buffer|string|undefined>
  cancelRecord(): Promise<void>

  recordBgImage(area: CaptureArea, savePath?: string, relative?: boolean): Promise<Buffer | undefined>

  convertToGif(inputVideo: string, videoArg?: VideoArgs, webContentId?: number): Promise<string>
}

export const IUtilService = Symbol.for('IUtilService')
export interface IUtilService {
  // 设置鼠标穿透
  setClickPenetrate(penetrate: boolean): Promise<void>

  getCursorScreenPoint(): Promise<{ x: number, y: number }>

  showFileInFolder(filePath: string): Promise<void>

  // alsoSelect: false, 如果没有最近打开的文件, 是否打开文件选择器
  askLastRecord(alsoSelect?: boolean, webContentId?: number): Promise<string | undefined>
  askSelectAVideoFile(onlyStr?: boolean, failedCancel?: boolean): Promise<string | Buffer | undefined>
  askOpenPreview(): Promise<void>
  askHideWin(): Promise<void>
}

export const ISettingService = Symbol.for('ISettingService')
export interface ISettingService {
  cachePathChangeEvent?: Event<string>

  getDockShow(): Promise<boolean>
  setDockShow(show: boolean): Promise<void>
  getLogPath(): Promise<string>
  setLogPath(logPath: string): Promise<void>
  getCachePath(): Promise<string>
  getCachePathSync?(): string
  // cachePath 为空就表示, 弹出一个选择dialog
  setOrSelectCachePath(cachePath?: string): Promise<string | undefined>
}


// 全局上下文管理
export const IContextService = Symbol.for('IContextService')
export interface IContextService{
  onValChangeEvent: Event<{key: ContextKey, value: any}>

  setKeyVal<T>(key: ContextKey, value: T): void
  getValByKey<T>(key: ContextKey): T
}
