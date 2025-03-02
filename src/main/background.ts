import path from 'path'
import { ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import {getPermission, initAll} from "./init-all";
import {setNoMenuDock} from "./common/electron/menu";
import {LocalProtocol} from "./electron/local-protocol";
import {Logger} from "./common/logger";
import {AppManager} from "./electron/manager/app-manager";

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  AppManager.setPath('userData', `${AppManager.getPath('userData')} (development)`)
}

// // 尝试 ·禁用 gpu 加速· 解决白屏问题
// app.disableHardwareAcceleration()
LocalProtocol.registerBeforeApp()

;(async () => {
  await AppManager.whenReady()

  setNoMenuDock()
  return

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})().then();


// 初始化
;(async () => {
  await AppManager.whenReady()
  initAll()

  // 开发环境不检查权限
  if (!isProd) {
    Logger.debug('dev mode, do not check access')
    setTimeout(() => Logger.debug('dev mode, do not check access'), 3000)
    return
  }

  // Mac 开发模式下应该是开发工具授权, 比如 vscode / webStrom
  getPermission()

})()

AppManager.addListen('window-all-closed', () => {
  AppManager.quitApp()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
