import { useState } from 'react'
import { AuthService } from '@workspace/request'
import { setStorageSync, showToast } from '@tarojs/taro'

import type { LoginUserDto, SmsLoginDto } from '@workspace/request'

export const useLogin = () => {
  // 用户名手机号登录
  const [loginUser, setLoginUser] = useState<LoginUserDto>({
    usernameOrPhone: 'johndoe',
    password: 'Password123!',
    rememberMe: true,
  })

  // 加载状态
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      const response = await AuthService.authControllerLogin(loginUser)

      console.log('登录成功:', response)

      // 保存token到存储
      if (response.accessToken) {
        setStorageSync('token', response.accessToken)
      }

      showToast({
        title: '登录成功',
        icon: 'success',
      })

      return response
    } catch (error) {
      console.error('登录失败:', error)
      showToast({
        title: '登录失败，请检查用户名和密码',
        icon: 'none',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // sms 登录
  const [smsLoginUser, setSmsLoginUser] = useState<SmsLoginDto>({
    phoneNumber: '',
    code: '',
  })

  const handleSmsLogin = async () => {
    try {
      setLoading(true)
      const response = await AuthService.authControllerLoginWithSms(smsLoginUser)
      console.log('短信登录成功:', response)

      // 保存token到存储
      if (response.accessToken) {
        setStorageSync('token', response.accessToken)
      }

      showToast({
        title: '登录成功',
        icon: 'success',
      })

      return response
    } catch (error) {
      console.error('短信登录失败:', error)
      showToast({
        title: '登录失败，请检查手机号和验证码',
        icon: 'none',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loginUser,
    setLoginUser,
    handleLogin,
    smsLoginUser,
    setSmsLoginUser,
    handleSmsLogin,
    loading,
  }
}
