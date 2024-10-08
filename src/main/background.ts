import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import {getPermission, initAll} from "./init-all";
import {setNoMenuDock} from "./common/electron/menu";
import {LocalProtocol} from "./electron/local-protocol";

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

// // 尝试 ·禁用 gpu 加速· 解决白屏问题
// app.disableHardwareAcceleration()
LocalProtocol.registerBeforeApp()

;(async () => {
  await app.whenReady()

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
  await app.whenReady()
  initAll()

  // 开发环境不检查权限
  // if (isProd) {
  // }

  // Mac 开发模式下应该是开发工具授权, 比如 vscode / webStrom
  getPermission()

})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
