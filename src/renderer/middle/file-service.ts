import { injectable } from 'inversify'
import { ServiceFactory } from './service-factory'
import {BaseToElectron} from "./base-model";
import {IFileService} from "../../common/service";


@injectable()
export class FileService extends BaseToElectron implements IFileService {
  _backendService: any = ServiceFactory.fileService

  async isDir(name: string): Promise<boolean> {
    return await this._backendService('isDir', name)
  }

  async isFile(name: string): Promise<boolean> {
    return await this._backendService('isFile', name)
  }

  async open(path: string): Promise<string> {
    return await this._backendService('open', path)
  }

  async openYaml<T>(path: string): Promise<T> {
    return await this._backendService('openYaml', path)
  }

  async readDir(path: string, recursive = false): Promise<string[]> {
    return await this._backendService('readDir', path, recursive)
  }

  async write(path: string, data: any): Promise<void> {
    return await this._backendService('write', path, data)
  }

  async writeYaml(path: string, data: any): Promise<void> {
    return await this._backendService('writeYaml', path, data)
  }

  async isExists(path: string): Promise<boolean> {
    return await this._backendService('isExists', path)
  }

  async mkDir(path: string, recursive?: boolean | number): Promise<boolean> {
    return await this._backendService('mkDir', path, recursive)
  }

  async openBuffer(path: string): Promise<Buffer | undefined> {
    return await this._backendService('openBuffer', path)
  }

  async move(originPath: string, newPath: string): Promise<boolean> {
    return await this._backendService('move', originPath, newPath)
  }
}
