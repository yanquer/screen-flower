
import { MenuItem, MenuItemConstructorOptions } from 'electron'
import { ContextMenuNames } from "./defines";

export const IFileService = Symbol('IFileService')
export interface IFileService {
  open(path: string): Promise<string>
  openYaml<T>(path: string): Promise<T>

  write(path: string, data: any): Promise<void>
  writeYaml(path: string, data: any): Promise<void>

  isFile(name: string): Promise<boolean>
  isDir(name: string): Promise<boolean>

  readDir(path: string, recursive?: boolean | number): Promise<string[]>
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
