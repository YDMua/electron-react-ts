import { autoUpdater } from 'electron-updater'
import Logger from './logger'

class AppUpdater {
  constructor() {
    const logger = new Logger()
    autoUpdater.logger = logger
    autoUpdater.checkForUpdatesAndNotify()
  }
}

export default AppUpdater
