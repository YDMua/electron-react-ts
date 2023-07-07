const dotenv = require('dotenv')
const fs = require('fs-extra')
const path = require('path')
const { createEnvTypes } = require('./create_env_types')

const joinRoot = (..._path_) => {
  if (!_path_ || !_path_.length) return process.cwd()
  return path.join(process.cwd(), ..._path_)
}

const getDotEnvObject = (mode) => {
  const envFiles = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`]
  let envValues = { NODE_ENV: process.env.NODE_ENV }

  for (const fileName of envFiles) {
    const filePath = joinRoot(fileName)
    if (fs.existsSync(filePath)) {
      envValues = {
        ...envValues,
        ...(dotenv.config({ path: filePath }).parsed || {}),
      }
    }
  }

  for (const envKey in envValues) {
    if (Object.prototype.hasOwnProperty.call(envValues, envKey)) {
      envValues[envKey] = JSON.stringify(envValues[envKey])
    }
  }
  createEnvTypes(envValues)
  return envValues
}
module.exports = {
  getDotEnvObject,
  joinRoot,
}
