import { View, Text, Input, Button } from '@tarojs/components'
import { useLoad, navigateTo } from '@tarojs/taro'

import { useLogin } from './useLogin'

import './index.less'

export const pageMeta = {
  title: '登录页面',
  requiresAuth: false,
}

export default function Login() {
  const { loginUser, setLoginUser, handleLogin, smsLoginUser, setSmsLoginUser, handleSmsLogin, loading } = useLogin()

  useLoad(() => {
    console.log('登录页面加载完成.')
  })

  const submitLogin = async () => {
    try {
      const result = await handleLogin()
      if (result) {
        // 登录成功后跳转到首页
        navigateTo({ url: '/pages/index/index' })
      }
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  return (
    <View className="login p-4">
      <View className="text-2xl font-bold mb-6">用户登录</View>

      <View className="mb-4">
        <Text className="block mb-2">用户名/手机号</Text>
        <Input
          className="border p-2 w-full rounded"
          value={loginUser.usernameOrPhone}
          onInput={e => setLoginUser({ ...loginUser, usernameOrPhone: e.detail.value })}
          placeholder="请输入用户名或手机号"
        />
      </View>

      <View className="mb-6">
        <Text className="block mb-2">密码</Text>
        <Input
          className="border p-2 w-full rounded"
          password
          value={loginUser.password}
          onInput={e => setLoginUser({ ...loginUser, password: e.detail.value })}
          placeholder="请输入密码"
        />
      </View>

      <Button className={`w-full ${loading ? 'opacity-50' : ''}`} type="primary" loading={loading} disabled={loading} onClick={submitLogin}>
        {loading ? '登录中...' : '登录'}
      </Button>
    </View>
  )
}
