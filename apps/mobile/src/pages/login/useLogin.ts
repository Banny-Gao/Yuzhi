import { useState } from 'react'
import { AuthService } from '@workspace/request'
import { withErrorHandling, withNetworkCheck } from '@/utils/requestHelpers'

import type { LoginUserDto, SmsLoginDto, CreateUserDto } from '@workspace/request'

export const useLogin = () => {
  // 用户名手机号登录
  const [loginUser, setLoginUser] = useState<LoginUserDto>({
    usernameOrPhone: 'johndoe',
    password: 'Password123!',
    rememberMe: true,
  })

  const handleLogin = async () =>
    withErrorHandling(() => withNetworkCheck(() => AuthService.authControllerLogin(loginUser)), '登录失败，请检查您的用户名和密码')

  // sms 登录
  const [smsLoginUser, setSmsLoginUser] = useState<SmsLoginDto>({
    phoneNumber: '',
    code: '',
  })

  const handleSmsLogin = async () =>
    withErrorHandling(() => withNetworkCheck(() => AuthService.authControllerLoginWithSms(smsLoginUser)), '登录失败，请检查您的验证码')

  // 用户注册
  const [registerUser, setRegisterUser] = useState<CreateUserDto>({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  })

  const handleRegister = async () => withErrorHandling(() => withNetworkCheck(() => AuthService.authControllerRegister(registerUser)), '注册失败，请稍后重试')

  const getProfile = async () => {
    return withErrorHandling(() => withNetworkCheck(() => AuthService.authControllerGetProfile()), '获取用户信息失败')
  }

  return {
    loginUser,
    setLoginUser,
    handleLogin,
    smsLoginUser,
    setSmsLoginUser,
    handleSmsLogin,
    registerUser,
    setRegisterUser,
    handleRegister,
    getProfile,
  }
}
