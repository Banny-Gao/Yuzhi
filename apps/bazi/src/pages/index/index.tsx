import { useState } from 'react'
import { useLoad, getLocation } from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'

import { PageWrapper } from '@/components'
import { getSolarDate, Nouns } from '@/core'

import { loadingManager } from '@/components'

import './index.module.scss'

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
      console.log(res)
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

  const renderList = (data: Record<string, any>) => (
    <AtList hasBorder={false}>
      {Object.entries(data).map(([key, value]) => (
        <AtListItem key={key} title={Nouns[key]} extraText={JSON.stringify(value)} />
      ))}
    </AtList>
  )

  return (
    <PageWrapper>
      <ScrollView scrollY>
        <View>
          <Text>阳历</Text>
          {renderList(solar)}
        </View>
        {lunar && (
          <View>
            <Text>阴历</Text>
            {renderList(lunar)}
          </View>
        )}
      </ScrollView>
    </PageWrapper>
  )
}

export default Index
