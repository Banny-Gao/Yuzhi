import { FC } from 'react'
import { View, Text } from '@tarojs/components'
import { AtCard, AtList, AtListItem } from 'taro-ui'
import { NOUN } from '../../core/data/nouns'
import styles from './index.module.scss'

interface FieldCardProps {
  field: Record<string, any>
  keys?: string[]
  title?: string
  isNested?: boolean
  className?: string
}

// Helper function to remove HTML tags from string
const stripHtmlTags = (html: string): string => {
  if (typeof html !== 'string') return String(html)
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}

const FieldCard: FC<FieldCardProps> = ({ field, keys, title, isNested = false, className }) => {
  // If keys are not provided, use all keys from the field
  const renderKeys = keys || Object.keys(field)

  const renderValue = (key: string, value: any) => {
    // Get the display title from NOUN, or use the key if not found
    const displayTitle = NOUN[key as keyof typeof NOUN] || key

    if (Array.isArray(value)) {
      return (
        <View className={styles['field-card__array-item']}>
          <Text className={styles['field-card__key']}>{displayTitle}</Text>
          <View className={styles['field-card__array-content']}>
            {value.map((item, index) => (
              <View key={index} className={styles['field-card__array-nested']}>
                {typeof item === 'object' && item !== null ? (
                  <FieldCard field={item} keys={keys} isNested={true} />
                ) : (
                  <Text className={styles['field-card__value']}>
                    {typeof item === 'string' ? stripHtmlTags(item) : String(item)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )
    } else if (typeof value === 'object' && value !== null) {
      return (
        <View className={styles['field-card__object-item']}>
          <Text className={styles['field-card__key']}>{displayTitle}</Text>
          <View className={styles['field-card__object-content']}>
            <FieldCard field={value} keys={keys} isNested={true} />
          </View>
        </View>
      )
    } else {
      const cleanValue = typeof value === 'string' ? stripHtmlTags(value) : String(value)
      return (
        <AtListItem
          title={displayTitle}
          note={cleanValue}
          className={styles['field-card__list-item']}
          hasBorder={false}
        />
      )
    }
  }

  const content = (
    <AtList className={styles['field-card__list']} hasBorder={false}>
      {renderKeys.map(
        key =>
          field[key] !== undefined && (
            <View key={key} className={styles['field-card__item']}>
              {renderValue(key, field[key])}
            </View>
          )
      )}
    </AtList>
  )

  if (isNested) {
    return content
  }

  return (
    <AtCard title={title || '详细信息'} className={`${styles['field-card']} ${className || ''}`} hasBorder={false}>
      {content}
    </AtCard>
  )
}

export default FieldCard
