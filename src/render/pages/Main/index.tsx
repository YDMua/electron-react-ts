import { Button, Input, Space, Tabs } from 'antd'
import { Suspense, lazy, useState } from 'react'
import styles from './index.module.less'

const LazyDemo = lazy(() => import('render/components/Test')) // 使用import语法配合react的Lazy动态引入资源

const Main = () => {
  const [show, setShow] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [updateValue, setUpdateValue] = useState('')

  const onClick = () => {
    setShow((pre) => !pre)
  }

  const handleSave = () => {
    window.electronAPI.saveFile(textValue)
  }

  const handleUpdate = () => {
    window.electronAPI.updateFile(textValue)
  }

  const _tabsItems = () => {
    return [
      {
        label: `保存文件`,
        key: '1',
        children: (
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="请输入内容保存.txt到本地"
              value={textValue}
              onChange={(val) => setTextValue(val.target.value)}
            />
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </Space.Compact>
        ),
      },
      {
        label: `修改文件`,
        key: '2',
        children: (
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="选择.txt文件修改文件内容"
              value={updateValue}
              onChange={(val) => setUpdateValue(val.target.value)}
            />
            <Button type="primary" onClick={handleUpdate}>
              修改
            </Button>
          </Space.Compact>
        ),
      },
      {
        label: `组件懒加载`,
        key: '3',
        children: (
          <div>
            <Button onClick={onClick}>点击显示懒组件</Button>
            {/* show为true时加载LazyDemo组件 */}
            {show && (
              <Suspense fallback={null}>
                <LazyDemo />
              </Suspense>
            )}
          </div>
        ),
      },
    ]
  }
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <Tabs type="card" items={_tabsItems()} />
      </div>
    </div>
  )
}
export default Main
