const fs = require('fs-extra')
const path = require('path')

/**
 * @NOTE
 * @Message {根据env文件生成 ts 类型文件}
 */
const createEnvTypes = (envObject) => {
  
  let envListString = ``
  // 解析后的 evn object 对 key 进行简单排序，确保在其他设备上也是按照相同的排序来生成文件，确保各自生成的文件都是保持一致的
  const sortEnvArray = Object.keys(envObject).sort(() => 1)
  for (const key of sortEnvArray) {
    switch (key) {
      case 'MODE':
        envListString += `    export const ${key}: 'dev' | 'stage' | 'stage1' | 'uat' | 'prod' | 'mock';\n`
        break
      case 'NODE_ENV':
        envListString += `    export const ${key}: 'production' | 'development';\n`
        break
      default:
        envListString += `    export const ${key}: string;\n`
    }
  }
  const _EnvString = `/**
 * @Message 启动开发环境或者打包环境脚本时自动根据 .env* 的内容生成
 * @Note 禁止手动修改
 */
declare global {
  export namespace env {\n${envListString}  }
}

export {};`
  const _pwd = path.join(process.cwd(), 'typings')
  if (!fs.existsSync(_pwd)) {
    fs.mkdirSync(_pwd)
  }
  fs.writeFileSync(`${_pwd}/env.d.ts`, _EnvString, {
    encoding: 'utf8',
  })
}

module.exports = {
  createEnvTypes,
}
