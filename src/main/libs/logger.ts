import { app } from 'electron'
import logger from 'electron-log'
import * as os from 'os'
import { IKV } from '../types'

export enum LoggerType {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
  SILLY = 'silly',
}
interface ILoggerOptions {
  /** 日志级别 */
  level?: LoggerType
  /** 文档最大存储大小 */
  maxSize?: number
  /** 日志保存地址 */
  path?: string
  /** 初始化不进行上报公共信息 */
  initNotReport?: boolean
}
const MAX_SIZE = 100 * 1024 * 1024

class Logger {
  private _options: ILoggerOptions

  constructor(options?: ILoggerOptions) {
    logger.transports.file.level = options?.level || LoggerType.INFO
    logger.transports.file.maxSize = options?.maxSize || MAX_SIZE // 最大不超过10M
    logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}' // 设置文件内容格式
    if (options?.path) {
      logger.transports.file.resolvePath = () => options.path as string
    }
    this._options = options as ILoggerOptions
    if (!this._options?.initNotReport) {
      const { version, device } = this._getCommonInfo()
      this.info(`【Version: ${version}】【Device: ${JSON.stringify(device)}】`)
    }
  }

  info = (message: any) => {
    this._logger(LoggerType.INFO, message)
  }
  warn = (message: any) => {
    this._logger(LoggerType.WARN, message)
  }
  error = (message: any) => {
    this._logger(LoggerType.ERROR, message)
  }
  debug = (message: any) => {
    this._logger(LoggerType.DEBUG, message)
  }
  verbose = (message: any) => {
    this._logger(LoggerType.VERBOSE, message)
  }
  silly = (message: any) => {
    this._logger(LoggerType.SILLY, message)
  }

  private _logger = (level: LoggerType, message: IKV) => {
    if (app?.isPackaged) {
      logger[level](this._formatMsgType(message))
    } else {
      console.log(this._formatMsgType(message))
    }
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
