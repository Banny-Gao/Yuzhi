import Taro from '@tarojs/taro'

export const getNavbarInfo = () => {
  const systemInfo = Taro.getWindowInfo()
  const menuButtonInfo =
    process.env.TARO_ENV === 'h5'
      ? {
          height: 0,
          top: 0,
          width: 0,
        }
      : Taro.getMenuButtonBoundingClientRect?.()

  // 计算导航栏高度
  const statusBarHeight = systemInfo.statusBarHeight || 0
  const menuButtonHeight = menuButtonInfo.height
  const menuButtonTop = menuButtonInfo.top
  const menuButtonWidth = menuButtonInfo.width
  const windowWidth = systemInfo.windowWidth

  // 导航栏高度 = 状态栏高度 + 44
  const navBarHeight = statusBarHeight + 44

  return {
    statusBarHeight,
    navBarHeight,
    menuButtonHeight,
    menuButtonTop,
    menuButtonWidth,
    windowWidth,
  }
}
