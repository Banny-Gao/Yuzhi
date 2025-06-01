import { useState } from 'react'
import dayjs from 'dayjs'
import { useLoad, getLocation } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'

import { PageWrapper, FieldCard } from '@/components'
import {
  getSolarDate,
  wuXings,
  tianGans,
  diZhis,
  getBazi,
  getLiuYue,
  getLiuRi,
  lunarToDate,
  lunarToStandardTime,
} from '@/core'

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
      const now = new Date()
      const { longitude } = await getLocation({ type: 'wgs84' })

      const owner = {
        gender: 'male' as const,
        birthday: new Date('1994-09-16 14:30:00'),
        longitude,
      }
      const solarDate = await getSolarDate(owner.birthday, longitude)
      console.log('真太阳时', solarDate)
      console.log('五行', wuXings)
      console.log('天干', tianGans)
      console.log('地支', diZhis)
      const bazi = await getBazi({ date: solarDate.date, longitude: owner.longitude, gender: owner.gender })
      console.log('八字', bazi)
      const liuYue = await getLiuYue(now.getFullYear())
      console.log('本年流月', liuYue)
      const liuRi = await getLiuRi(now.getFullYear(), now.getMonth() + 1)
      console.log('本月：', now.getMonth() + 1, '本月流日：', liuRi)
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
