export interface BasicField {
  [x: string]: any
  fieldName: string // 字段名称
  noun: string // 字段名词
}

export interface IndexField extends BasicField {
  index: number // 索引
}

export interface TargetField extends IndexField {
  targetFieldName: string // 目标字段名称
  targetIndex: number // 目标索引
}

export type Option = {
  [x: string]: any
  value: number | string
}

/** 将字符串数组转换为联合类型 */
export type NameConst<T extends readonly string[]> = T[number]

export type GetRelationParams<T extends TargetField, S extends IndexField> = {
  target: S | S['fieldName']
  fieldNames: S['fieldName'][]
  relations?: string[][]
  transform?: (item: string[]) => Required<Omit<T, keyof TargetField>>
  condition?: (item: string[]) => boolean
}
