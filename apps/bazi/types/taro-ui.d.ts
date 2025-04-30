declare module 'taro-ui' {
  import { ComponentClass } from 'react'

  export interface AtIconProps {
    prefixClass?: string
    value: string
    size?: number
    color?: string
    className?: string
    customStyle?: object
  }

  export const AtIcon: ComponentClass<AtIconProps>
}
