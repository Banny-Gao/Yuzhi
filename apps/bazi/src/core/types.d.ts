export {}

declare global {
  export type BasicField<T extends Record<string, any> = Record<string, any>> = {
    name: string // 字段名称
    value?: number | string
  } & T

  export type IndexField<T extends Record<string, any> = Record<string, any>> = BasicField<T> & {
    index: number // 索引
  }

  export type TargetField<T extends { name: string } = { name: string }> = Omit<T, 'name'> & {
    targetName: T['name'] // 目标字段名称
    targetIndex: number // 目标索引
  }

  export type GetRelationParams<T extends TargetField, S extends IndexField> = {
    target: S | S['name']
    names: S['name'][]
    relations?: string[][]
    transform?: (item: string[]) => Required<Omit<T, keyof TargetField>>
    condition?: (item: string[]) => boolean
  }
}
