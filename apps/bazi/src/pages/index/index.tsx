import { useState } from 'react'
import { useLoad, getLocation } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'

import { PageWrapper, FieldCard } from '@/components'
import { getSolarDate, wuXings, tianGans, diZhis, getBazi, getLiuYue } from '@/core'

import { loadingManager } from '@/components'

import styles from './index.module.scss'

export const pageMeta = {
  title: '排盘',
  requiresAuth: true,
}

type SolarDate = Awaited<ReturnType<typeof getSolarDate>>

const Index = () => {
  const [solarDate, setSolarDate] = useState<SolarDate>()

  const getDefualtSolarDate = async () => {
    try {
      const res = await getLocation({
        type: 'wgs84',
      })
      const solarDate = await getSolarDate(new Date('1994-09-16 14:30:00'), res.longitude)

      setSolarDate(solarDate)
      console.log('真太阳时', solarDate)
      console.log('五行', wuXings)
      console.log('天干', tianGans)
      console.log('地支', diZhis)
      const bazi = await getBazi({ date: solarDate.date, longitude: res.longitude, gender: 'male' })
      console.log('八字', bazi)
      const liuYue = await getLiuYue(new Date().getFullYear())
      console.log('本年流月', liuYue)
    } finally {
      loadingManager.hide()
    }
  }

  useLoad(() => {
    getDefualtSolarDate()
  })

  return (
    <PageWrapper showNavbar={false} showTabBar={false} showThemeSwitcher={false}>
      <ScrollView scrollY></ScrollView>
    </PageWrapper>
  )
}

export default Index
