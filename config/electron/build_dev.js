const { execSync } = require('child_process')

const _reGenerateCmd =
  '"rimraf ./electron && tsc --outDir ./electron ./src/main/*.ts -w"'
const _devCmd =
  '"wait-on ./electron/electron.js && electronmon ./electron/electron.js"'

const _start = async () => {
  const command = `concurrently ${_reGenerateCmd} ${_devCmd}`
  execSync(command, { stdio: 'inherit' })
}

module.exports = {
  start: _start(),
}
