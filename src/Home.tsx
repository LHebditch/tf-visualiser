import { FC } from 'react'
import styles from './Home.module.css'

const Home: FC = () => {
  return (
    <main className={styles.root}>
      <hgroup>
        <h1>TF Visualizer</h1>
        <h2>Infrastructure tool</h2>
      </hgroup>
      <section>
        <a href="/builder">
          <button className='primary'>Get Started</button>
        </a>
      </section>
    </main>

  )
}

export default Home
