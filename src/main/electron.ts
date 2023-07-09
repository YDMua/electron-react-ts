import * as dotenv from 'dotenv'
import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import AppUpdater from './libs/appUpdater'
import Logger from './libs/logger'

let logger: Logger | null

const env =
  dotenv?.config?.({ path: `.env.${process.env.APP_ENV}` })?.parsed || {}
const isDevelopment = !app.isPackaged
const isDebug = isDevelopment || env.DEBUG_PROD === 'true'

if (isDebug) {
  require('electron-debug')()
}
const createWindow = () => {
  if (isDebug) {
    // installExtensions()
  }
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(__dirname, '/public/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // 兼容file://协议文件的加载
      // contextIsolation: true,
      // nodeIntegration: true,
    },
    // frame: false,
    // resizable: false,
  })
  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:9090/')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(resolvePath('index.html'))
    if (!logger) {
      logger = new Logger()
      logger?.info('哈喽，欢迎来到蚂蚁社区，小蚁跟你问声好')
    }
  }
  new AppUpdater()
}
app.whenReady().then(() => {
  ipcMain.handle('dialog:saveFile', handleSaveFile)
  ipcMain.handle('dialog:updateFile', handleUpdateFile)
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch((error: any) => {
      console.log('无法安装', error)
    })
}

const handleSaveFile = async (
  event: Electron.IpcMainInvokeEvent,
  value: string,
) => {
  const defaultPath = path.join(app.getPath('documents'), 'file.txt')
  const { canceled, filePath }: any = await dialog.showSaveDialog({
    defaultPath: defaultPath,
  })
  if (!canceled) {
    // 使用fs模块写入文件
    fs.writeFile(filePath, value, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
  }
}

const handleUpdateFile = async (
  event: Electron.IpcMainInvokeEvent,
  value: string,
) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  if (filePaths && filePaths.length > 0) {
    const filePath = filePaths[0]
    fs.writeFile(filePath, value, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
  }
}

/** 获取打包之后文件的真实地址 */
const resolvePath = (resourceName: string) => {
  const appPath = app.getAppPath()
  const resourcePath = path.join(appPath, '..', 'public', resourceName)
  return resourcePath
}
