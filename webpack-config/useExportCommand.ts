/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs-extra'
import path from 'path'
import { getNextronConfig } from './getNextronConfig'
import {Logger} from './logger'

const cwd = process.cwd()
const pkgPath = path.join(cwd, 'package.json')
const nextConfigPath = path.join(
  cwd,
  getNextronConfig().rendererSrcDir || 'renderer',
  'next.config.js'
)

export const useExportCommand = async (): Promise<boolean> => {
  const { dependencies, devDependencies } = await fs.readJSON(pkgPath)

  let nextVersion: string
  nextVersion = dependencies.next
  if (nextVersion) {
    Logger.info(
      'To reduce the bundle size of the electron app, we recommend placing next and nextron in devDependencies instead of dependencies.'
    )
  }
  if (!nextVersion) {
    nextVersion = devDependencies.next
    if (!nextVersion) {
      Logger.error('Next not found in both dependencies and devDependencies.')
      process.exit(1)
    }
  }

  const majorVersion = ~~nextVersion
    .split('.')
    .filter((v) => v.trim() !== '')[0]
    .replace('^', '')
    .replace('~', '')
  if (majorVersion < 13) {
    return true
  }
  if (majorVersion === 13) {
    const { output, distDir } = require(nextConfigPath)
    if (output === 'export') {
      if (distDir !== '../app') {
        Logger.error(
          'Nextron export the build results to "app" directory, so please set "distDir" to "../app" in next.config.js.'
        )
        process.exit(1)
      }
      return false
    }
    return true
  }
  if (majorVersion > 13) {
    const { output, distDir } = require(nextConfigPath)
    if (output !== 'export') {
      Logger.error(
        'We must export static files so as Electron can handle them. Please set next.config.js#output to "export".'
      )
      process.exit(1)
    }
    if (distDir !== '../app') {
      Logger.error(
        'Nextron exports the build results to "app" directory, so please set "distDir" to "../app" in next.config.js.'
      )
      process.exit(1)
    }
    return false
  }

  Logger.error('Unexpected error occerred')
  process.exit(1)
}
