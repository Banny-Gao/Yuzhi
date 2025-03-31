import React from 'react'
import { View, Text } from '@tarojs/components'
import { useTheme } from '@/contexts/ThemeContext'
import './index.less'

export type AuthMode = 'login' | 'register' | 'smsLogin'

interface AuthToggleProps {
  currentMode: AuthMode
  onChange: (mode: AuthMode) => void
}

const AuthToggle: React.FC<AuthToggleProps> = ({ currentMode, onChange }) => {
  const { themeType } = useTheme()

  const getTabClass = (mode: AuthMode) => {
    return `auth-toggle__tab ${currentMode === mode ? 'auth-toggle__tab--active' : ''}`
  }

  return (
    <View className={`auth-toggle auth-toggle--${themeType}`}>
      <View className={getTabClass('login')} onClick={() => onChange('login')}>
        <Text className="auth-toggle__text">账号登录</Text>
      </View>

      <View className={getTabClass('smsLogin')} onClick={() => onChange('smsLogin')}>
        <Text className="auth-toggle__text">短信登录</Text>
      </View>

      <View className={getTabClass('register')} onClick={() => onChange('register')}>
        <Text className="auth-toggle__text">注册账号</Text>
      </View>
    </View>
  )
}

export default AuthToggle
