import { app } from 'electron'
import logger from 'electron-log'
import * as os from 'os'

export enum LoggerType {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
  SILLY = 'silly',
}
interface ILoggerOptions {
  level?: LoggerType
  maxSize?: number
  path?: string
}
const MAX_SIZE = 10 * 1024 * 1024

class Logger {
  private _options: ILoggerOptions

  constructor(options?: ILoggerOptions) {
    logger.transports.file.level = options?.level || LoggerType.INFO
    logger.transports.file.maxSize = options?.maxSize || MAX_SIZE // 最大不超过10M
    logger.transports.file.format =
      '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}' // 设置文件内容格式
    if (options?.path) {
      logger.transports.file.resolvePath = () => options.path as string
    }
    this._options = options as ILoggerOptions
    const { version, device } = this._getCommonInfo()
    this.info(`【Version: ${version}】【Device: ${JSON.stringify(device)}】`)
  }

  info = (message: any) => {
    logger.info(this._formatMsgType(message))
  }
  warn = (message: any) => {
    logger.warn(this._formatMsgType(message))
  }
  error = (message: any) => {
    logger.error(this._formatMsgType(message))
  }
  debug = (message: any) => {
    logger.debug(this._formatMsgType(message))
  }
  verbose = (message: any) => {
    logger.verbose(this._formatMsgType(message))
  }
  silly = (message: any) => {
    logger.silly(this._formatMsgType(message))
  }

  private _formatMsgType = (message: any) => {
    if (typeof message === 'string') {
      return message
    }
    return JSON.stringify(message)
  }

  private _getCommonInfo = () => {
    const version = app.getVersion()
    const device = {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
    }
    return {
      version,
      device,
    }
  }
}

export default Logger
