/**
 * 主题演示页面
 */
import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import { useTheme } from '../../contexts/ThemeContext'
import ThemeSwitcher from '../../components/ThemeSwitcher'

import './index.less'

export const pageMeta = {
  title: '主题切换',
  requiresAuth: false,
  requiresPermission: 'more',
}

/**
 * 颜色方块组件
 */
const ColorBlock: React.FC<{
  color: string
  name: string
  value: string
}> = ({ color, name, value }) => {
  return (
    <View className="color-block">
      <View className="color-block__color" style={{ backgroundColor: value }} />
      <View className="color-block__info">
        <Text className="text-primary" style={{ fontWeight: 'bold' }}>
          {name}
        </Text>
        <Text className="text-tertiary" style={{ fontSize: '12px' }}>
          {value}
        </Text>
      </View>
    </View>
  )
}

const ThemeDemoPage: React.FC = () => {
  const { themeType } = useTheme()

  return (
    <View className="theme-demo bg-secondary">
      <View className="theme-demo__header bg-primary">
        <Text className="text-primary" style={{ fontWeight: 'bold', fontSize: '18px' }}>
          主题演示 - {themeType}
        </Text>
        <ThemeSwitcher iconOnly />
      </View>

      <View className="theme-demo__section">
        <Text className="theme-demo__title text-primary" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          选择主题
        </Text>
        <ThemeSwitcher />
      </View>

      <View className="theme-demo__section">
        <Text className="theme-demo__title text-primary" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          主色调
        </Text>
        <View className="theme-demo__colors">
          <ColorBlock color="primary" name="主色调" value={'var(--primary-color)'} />
          <ColorBlock color="primary-light" name="浅色" value={'var(--primary-light)'} />
          <ColorBlock color="primary-dark" name="深色" value={'var(--primary-dark)'} />
        </View>
      </View>

      <View className="theme-demo__section">
        <Text className="theme-demo__title text-primary" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          文字颜色
        </Text>
        <View className="theme-demo__text-samples">
          <Text className="text-primary">主要文字颜色</Text>
          <Text className="text-secondary">次要文字颜色</Text>
          <Text className="text-tertiary">辅助文字颜色</Text>
          <Text className="text-disabled">禁用文字颜色</Text>
        </View>
      </View>

      <View className="theme-demo__section">
        <Text className="theme-demo__title text-primary" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          背景颜色
        </Text>
        <View className="theme-demo__bg-samples">
          <View className="bg-primary" style={{ padding: '12px' }}>
            <Text className="text-primary">主要背景</Text>
          </View>
          <View className="bg-secondary" style={{ padding: '12px' }}>
            <Text className="text-primary">次要背景</Text>
          </View>
          <View className="bg-tertiary" style={{ padding: '12px' }}>
            <Text className="text-primary">辅助背景</Text>
          </View>
        </View>
      </View>

      <View className="theme-demo__section">
        <Text className="theme-demo__title text-primary" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          按钮
        </Text>
        <View className="theme-demo__buttons">
          <Button className="custom-btn btn-primary">主要按钮</Button>
          <Button
            className="custom-btn"
            style={{
              color: 'var(--primary-color)',
              backgroundColor: '#fff',
              border: '1px solid var(--primary-color)',
            }}
          >
            朴素按钮
          </Button>
          <Button className="custom-btn btn-success">成功按钮</Button>
          <Button className="custom-btn btn-warning">警告按钮</Button>
          <Button className="custom-btn btn-error">危险按钮</Button>
          <Button className="custom-btn" style={{ backgroundColor: 'var(--info-color)', color: '#fff' }}>
            信息按钮
          </Button>
          <Button className="custom-btn" style={{ backgroundColor: '#bfbfbf', color: '#fff' }}>
            禁用按钮
          </Button>
        </View>
      </View>

      <View className="theme-demo__section">
        <Text className="theme-demo__title text-primary" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          卡片
        </Text>
        <View className="theme-demo__cards">
          <View
            className="shadow"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <Text className="text-primary" style={{ fontWeight: 'bold' }}>
              带阴影的卡片
            </Text>
            <Text className="text-secondary">这是一个带阴影的卡片示例</Text>
          </View>

          <View
            className="border-light"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <Text className="text-primary" style={{ fontWeight: 'bold' }}>
              带边框的卡片
            </Text>
            <Text className="text-secondary">这是一个带边框的卡片示例</Text>
          </View>

          <View
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: 'var(--box-shadow)',
            }}
          >
            <Text className="text-primary" style={{ fontWeight: 'bold' }}>
              重阴影卡片
            </Text>
            <Text className="text-secondary">这是一个重阴影的卡片示例</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ThemeDemoPage
