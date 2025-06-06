import React from 'react'
import { View, Text } from '@tarojs/components'

import styles from './index.module.scss'

export type AuthMode = 'login' | 'smsLogin'

interface AuthToggleProps {
  currentMode: AuthMode
  onChange: (mode: AuthMode) => void
}

const AuthToggle: React.FC<AuthToggleProps> = ({ currentMode, onChange }) => {
  const getTabClass = (mode: AuthMode) => {
    return [styles.tab, currentMode === mode && styles.active].filter(Boolean).join(' ')
  }

  return (
    <View className={styles.toggle}>
      <View className={getTabClass('login')} onClick={() => onChange('login')}>
        <Text className={styles.text}>账号登录</Text>
      </View>

      <View className={getTabClass('smsLogin')} onClick={() => onChange('smsLogin')}>
        <Text className={styles.text}>短信登录</Text>
      </View>
    </View>
  )
}

export default AuthToggle
