/** 获取目标索引 */
import type { BasicField, IndexField, TargetField, GetRelationParams } from '../types'

export const getTargetIndex = <T extends string | IndexField>(
  target: T,
  fieldNames: string[]
): number | undefined => (typeof target === 'string' ? fieldNames.indexOf(target) : target?.index)

/** 相互关系查找 */
export function getRelation<T extends TargetField, S extends IndexField>(
  this: S,
  params: GetRelationParams<T, S>
): T | undefined {
  const { fieldName, index } = this
  const { target, fieldNames, relations, transform } = params

  const targetFieldName = typeof target === 'string' ? target : target?.fieldName
  const targetIndex = getTargetIndex(target, fieldNames)
  // 两相互判断
  const defaultCondition = (fieldNames?: string[]): boolean =>
    !!fieldNames?.includes(fieldName) && !!fieldNames?.includes(targetFieldName)
  const condition = params.condition ?? defaultCondition

  const returnRelation = (item: string[]): T =>
    ({
      fieldName,
      index,
      targetFieldName,
      targetIndex,
      ...(transform?.(item) ?? {}),
    }) as T

  if (!relations) {
    return condition([]) ? returnRelation([]) : undefined
  }

  for (const item of relations) {
    if (condition(item)) {
      return returnRelation(item)
    }
  }
}

/** 通用函数生成 */
export const generateRelation = <T extends IndexField, S extends IndexField>(
  fieldNames: string[],
  condition: (this: S, targetIndex: number) => boolean
) =>
  function (this: S, target: T | T['fieldName']): TargetField {
    const targetIndex = getTargetIndex<T | T['fieldName']>(target, fieldNames) as number

    return getRelation.bind(this)({
      target: target as unknown as S | S['fieldName'],
      fieldNames,
      condition: () => condition.call(this, targetIndex),
    }) as TargetField
  }

/** 批量生成 name const */
export const generateNamesProp = <T extends Record<string, readonly unknown[]>>(
  props: T,
  index: number
): Record<string, T[keyof T][number]> =>
  Object.entries(props).reduce<Record<string, T[keyof T][number]>>((acc, [key, value]) => {
    acc[key] = value[index]
    return acc
  }, {})

/** 判断两个对象的名词是否相同 */
export const equalNoun = <T extends BasicField>(a: T, b: T | T['noun']): boolean =>
  a.noun === (typeof b === 'string' ? b : b.noun)

/** 通过 noun 获取对象 */
export const getObjectByNoun = <T extends BasicField>(
  objectArrary: T[],
  noun: string
): T | undefined => objectArrary.find(item => equalNoun(item, noun))

/** 异步执行 */
export const asyncExec = <T>(fn: () => T): Promise<T> => new Promise(resolve => resolve(fn()))
