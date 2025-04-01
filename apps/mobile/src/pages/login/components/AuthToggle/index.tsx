import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.less'

export type AuthMode = 'login' | 'register' | 'smsLogin'

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

      <View className={getTabClass('register')} onClick={() => onChange('register')}>
        <Text className={styles.text}>注册账号</Text>
      </View>
    </View>
  )
}

export default AuthToggle
