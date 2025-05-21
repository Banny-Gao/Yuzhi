import { useState } from 'react'
import { useLoad, getLocation } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'

import { PageWrapper, FieldCard } from '@/components'
import { getSolarDate, wuxings } from '@/core'

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
      const solarDate = await getSolarDate(new Date(), res.longitude)

      setSolarDate(solarDate)
      console.log('solarDate', solarDate)
      console.log('wuxings', wuxings)
    } finally {
      loadingManager.hide()
    }
  }

  useLoad(() => {
    getDefualtSolarDate()
  })

  return (
    <PageWrapper>
      <ScrollView scrollY></ScrollView>
    </PageWrapper>
  )
}

export default Index
