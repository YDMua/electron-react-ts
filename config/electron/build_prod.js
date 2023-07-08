const { execSync } = require('child_process')
const waitOn = require('wait-on')

const _reGenerateCmd =
  'npx cross-env NODE_ENV=production APP_ENV=prod && rimraf ./electron && rimraf ./app_dist && tsc --outDir ./electron ./src/main/*.ts'
const _buildCmd = (envArgu) =>
  `electron-builder ${envArgu} -c ./config/electron/build_config.js`

const _build = async (envArgu) => {
  execSync(_reGenerateCmd, { stdio: 'inherit', shell: true })
  await waitOn({ resources: ['./electron/electron.js'] })
  execSync(_buildCmd(envArgu), { stdio: 'inherit', shell: true })
}

module.exports = {
  build: _build,
}
