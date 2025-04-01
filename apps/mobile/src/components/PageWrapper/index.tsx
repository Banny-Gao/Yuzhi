import React, { ReactNode } from 'react'
import styles from './index.module.less'

interface PageWrapperProps {
  children: ReactNode
  useScrollView?: boolean
  className?: string
  contentClassName?: string
  style?: React.CSSProperties
  contentStyle?: React.CSSProperties
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, useScrollView = false, className = '', contentClassName = '', style, contentStyle }) => {
  return (
    <div className={`${styles.page} ${className}`} style={style}>
      {useScrollView ? (
        <div className={`${styles.scrollContent} ${contentClassName}`} style={contentStyle}>
          {children}
        </div>
      ) : (
        <div className={`${styles.content} ${contentClassName}`} style={contentStyle}>
          {children}
        </div>
      )}
    </div>
  )
}

export default PageWrapper
