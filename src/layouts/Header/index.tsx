import styles from './index.module.scss'

import Container from '@/components/container'

export default function header() {
  return (
    <header className={styles.header}>
      <Container>
        <a href="https://github.com/chanyuxi">CHANYUXI (update by me)</a>
      </Container>
    </header>
  )
}
