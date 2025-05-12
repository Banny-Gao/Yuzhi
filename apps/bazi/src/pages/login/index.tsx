import React from 'react'
import { View, Text, Switch, ScrollView } from '@tarojs/components'
import classNames from 'classnames'

import AuthToggle from './components/AuthToggle'
import { useLogin } from './useLogin'
import styles from './index.module.less'

import { PageWrapper, InputField, ThemedButton } from '@/components'
import { useTheme } from '@/contexts/ThemeContext'
export const pageMeta = {
  requiresAuth: false,
}

const Login: React.FC = () => {
  const { themeType } = useTheme()
  const {
    // State
    authMode,
    animKey,
    isLoading,
    formErrors,
    username,
    password,

    phoneNumber,
    smsCode,
    rememberMe,
    countdown,
    scrollViewRef,

    // Handlers
    handleAuthModeChange,
    handleUsernameInput,
    handlePhoneInput,
    handlePasswordInput,

    handleSmsCodeInput,
    handleRememberMeChange,
    handleSubmit,
    requestSmsCode,
  } = useLogin()

  // Render account login form
  const renderAccountLoginForm = () => {
    return (
      <View className={styles.formContent}>
        <View className={styles.usernameContainer}>
          <InputField
            label="用户名/手机号"
            value={username}
            onInput={handleUsernameInput}
            placeholder="请输入用户名或手机号"
            required
            error={formErrors.username}
          />
        </View>

        <InputField
          label="密码"
          value={password}
          onInput={handlePasswordInput}
          placeholder="请输入密码"
          type="password"
          required
          error={formErrors.password}
        />

        <View className={styles.options}>
          <View className={styles.remember}>
            <Switch
              checked={rememberMe}
              onChange={e => handleRememberMeChange(e.detail.value)}
              color="var(--primary-color)"
              className={styles.switch}
            />
            <Text className={styles.rememberText}>记住我</Text>
          </View>
          <Text className={styles.forgotPassword}>忘记密码?</Text>
        </View>

        <ThemedButton
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          block
        >
          登录
        </ThemedButton>
      </View>
    )
  }

  // Render SMS login form
  const renderSmsLoginForm = () => {
    return (
      <View className={styles.formContent}>
        <InputField
          label="手机号"
          value={phoneNumber}
          onInput={handlePhoneInput}
          placeholder="请输入手机号"
          type="number"
          required
          error={formErrors.phoneNumber}
          maxLength={11}
        />

        <InputField
          label="验证码"
          type="text"
          required
          placeholder="请输入验证码"
          value={smsCode}
          onInput={handleSmsCodeInput}
          maxLength={6}
          error={formErrors.smsCode}
          suffix={
            <Text
              className={styles.getCode}
              onClick={countdown === 0 ? requestSmsCode : undefined}
              style={{ color: countdown > 0 ? 'var(--text-tertiary)' : 'var(--primary-color)' }}
            >
              {countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码'}
            </Text>
          }
        />

        <ThemedButton
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          block
        >
          登录
        </ThemedButton>
      </View>
    )
  }

  // Render different forms based on auth mode
  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return renderAccountLoginForm()
      case 'smsLogin':
        return renderSmsLoginForm()
      default:
        return null
    }
  }

  return (
    <PageWrapper>
      <View className={styles.header}>
        <View className={classNames(styles.logoContainer, styles[themeType])}>
          <Text className={classNames(styles.logoText, styles[themeType])}>豫知</Text>
        </View>
      </View>

      <AuthToggle currentMode={authMode} onChange={handleAuthModeChange} />

      <View className={styles.scrollArea}>
        <ScrollView
          scrollY
          scrollWithAnimation
          className={styles.form}
          ref={scrollViewRef}
          enhanced
          showScrollbar={false}
          enableFlex
        >
          <View className={styles.scrollContent}>
            <View key={animKey} className={styles.formContainer}>
              {renderAuthForm()}
            </View>
          </View>
        </ScrollView>
      </View>
    </PageWrapper>
  )
}

export default Login
