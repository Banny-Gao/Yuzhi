import { useState } from 'react'
import { CoverView } from '@tarojs/components'

import IconFont, { type IconNames } from '@/components/iconfont'
import { router } from '@/utils/router'
import { tabBarList } from './constants'

import './index.scss'

const TabBar = () => {
  const [selected, setSelected] = useState(0)
  const [color, setColor] = useState('#000000')
  const [selectedColor, setSelectedColor] = useState('#DC143C')

  return (
    <CoverView className="tab-bar">
      <CoverView className="tab-bar-border"></CoverView>
      {tabBarList.map((item, index) => {
        return (
          <CoverView key={index} className="tab-bar-item" onClick={() => router.switchTab({ url: item.pagePath })}>
            <IconFont name={item.iconName as IconNames} />
            <CoverView style={{ color: selected === index ? selectedColor : color }}>{item.text}</CoverView>
          </CoverView>
        )
      })}
    </CoverView>
  )
}

export default TabBar
