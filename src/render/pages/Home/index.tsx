import { Button, Image } from 'antd'
import mainPng from 'src/render/assets/images/main.png'
import { useHistory } from 'src/render/hooks/use_history'
import styles from './index.module.less'

const Home = () => {
  const { history } = useHistory()
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <Image src={mainPng} alt="" className={styles.logoImg} />
        <div className={styles.title}>
          Eletron + React + Typescript + Webpack5 + antd5
        </div>
        <div className={styles.button}>
          <Button onClick={() => history('/main')}>前往体验</Button>
        </div>
      </div>
    </div>
  )
}
export default Home
