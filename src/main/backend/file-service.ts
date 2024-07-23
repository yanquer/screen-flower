import { stat, readFile, readdirSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'fs'
import { dump, load } from 'js-yaml'
import path, { join, dirname } from 'path'

import { IFileService } from '../../common/service'
import { PathStat } from '../../common/defines'
import { injectable } from 'inversify'
import {Logger} from "../common/logger";


@injectable()
export class FileService implements IFileService {
  async isExists(path: string): Promise<boolean> {
    return existsSync(path)
  }

  async open(path: string): Promise<string> {
    if (!(await this.isExists(path))) {
      return ''
    }

    let ret = ''
    await new Promise((resolve) => {
      readFile(path, 'utf8', (err, data) => {
        if (err) {
          Logger.info(err)
        }
        ret = data
        resolve(ret)
      })
    })
    return ret
  }

  async openBuffer(path: string): Promise<Buffer | undefined> {
    if (!(await this.isExists(path))) {
      return undefined
    }

    let ret: Buffer
    await new Promise((resolve) => {
      readFile(path, {
      }, (err, data) => {
        if (err) {
          Logger.info(err)
        }
        ret = data
        resolve(ret)
      })
    })
    return ret
  }

  async openYaml<T>(path: string): Promise<T> {
    if (!(await this.isFile(path))) {
      Logger.info('yaml不存在')
      return {} as T
    }
    const data = await this.open(path)
    // return load(data)
    return load(data) as T
  }

  protected async statTarget(path: string): Promise<PathStat> {
    let ret = PathStat.other

    if (!(await this.isExists(path))) {
      return ret
    }

    const tmp = await new Promise((resolve) => {
      stat(path, (err, stat) => {
        if (err) {
          Logger.error(err)
        }
        if (stat?.isDirectory()) {
          ret = PathStat.dir
        } else if (stat?.isFile()) {
          ret = PathStat.file
        }

        resolve(ret)
      })
    })
    // Logger.info("tmp... ", tmp)
    return ret
  }

  async isFile(name: string) {
    return (await this.isExists(name)) && (await this.statTarget(name)) === PathStat.file
  }
  async isDir(name: string) {
    return (await this.isExists(name)) && (await this.statTarget(name)) === PathStat.dir
  }

  async readDir(path: string, recursive: boolean | number = false): Promise<string[]> {
    if (!(await this.isExists(path))) {
      return []
    }

    let ret: string[] = []
    if (await this.isDir(path)) {
      ret = readdirSync(path)
      ret.forEach((item, index) => {
        ret[index] = join(path, item)
      })
      if (recursive) {
        // for (const item of ret) {
        //     const subRet = await this.readDir(
        //         item,
        //         typeof recursive === "number" ? (recursive+1) : recursive
        //     )
        // }
      }
    }
    return ret
  }

  async write(path: string, data: any): Promise<void> {
    if (!(await this.isExists(path))) {
      mkdirSync(dirname(path), { recursive: true })
    }
    writeFileSync(path, data)
  }

  async writeYaml(path: string, data: any): Promise<void> {
    if (!(await this.isExists(path))) {
      mkdirSync(dirname(path), { recursive: true })
    }
    writeFileSync(path, dump(data))
  }

  async mkDir(path: string, recursive?: boolean | number): Promise<boolean>{
    if (await this.isExists(path)) {
      return true
    }

    mkdirSync(path, {recursive: !!recursive})

    return true
  }

  async move(originPath: string, newPath: string): Promise<boolean>{
    if ((await this.isExists(originPath))) {
      renameSync(originPath, newPath)
    }

    return false

  }


}
