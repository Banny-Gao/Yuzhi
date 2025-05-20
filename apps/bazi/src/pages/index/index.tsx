import { useState } from 'react'
import { useLoad, getLocation } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'

import { PageWrapper, FieldCard } from '@/components'
import { getSolarDate } from '@/core'

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
    } finally {
      loadingManager.hide()
    }
  }

  useLoad(() => {
    getDefualtSolarDate()
  })

  const { lunar, ...solar } = solarDate ?? {}

  return (
    <PageWrapper>
      <ScrollView scrollY>
        <FieldCard className={styles.mb} title="阳历" field={solar} keys={['dateString']} />
        {lunar && (
          <FieldCard
            title="农历"
            field={lunar}
            keys={[
              'lunarDateString',
              'seasonName',
              'currentSolarTerms',
              'solarTermName',
              'solarTermDateString',
              'dateString',
              'introduction',
              'xiSu',
              'youLai',
              'yangSheng',
            ]}
          />
        )}
      </ScrollView>
    </PageWrapper>
  )
}

export default Index
