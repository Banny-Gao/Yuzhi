import React from 'react'

import styles from './index.module.less'

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.contentWrapper}>{children}</div>
}

export default ContentWrapper
