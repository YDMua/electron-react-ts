import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import zhCN from 'antd/locale/zh_CN'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'render/assets/styles/common.css'
import Router from 'src/render/route'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <HashRouter>
      <ConfigProvider locale={zhCN} space={{ size: 16 }}>
        <Router />
      </ConfigProvider>
    </HashRouter>,
  )
}
