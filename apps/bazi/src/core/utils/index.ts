export const getTargetIndex = <T extends string | IndexField>(target: T, names: string[]): number | undefined =>
  typeof target === 'string' ? names.indexOf(target) : target?.index

/** 相互关系查找 */
export function getRelation<T extends TargetField, S extends IndexField>(
  this: S,
  params: GetRelationParams<T, S>
): T | undefined {
  const { name } = this
  const { target, names, relations, transform } = params

  const targetName = typeof target === 'string' ? target : target?.name
  const targetIndex = getTargetIndex(target, names)
  // 两相互判断
  const defaultCondition = (names?: string[]): boolean => !!names?.includes(name) && !!names?.includes(targetName)
  const condition = params.condition ?? defaultCondition

  const returnRelation = (item: string[]): T =>
    ({
      targetName,
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
  names: string[],
  condition: (this: S, targetIndex: number) => boolean
) =>
  function (this: S, target: T | T['name']): TargetField {
    const targetIndex = getTargetIndex<T | T['name']>(target, names) as number

    return getRelation.bind(this)({
      target: target as unknown as S | S['name'],
      names,
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
export const equalName = <T extends BasicField>(a: T | T['name'], b: T | T['name']): boolean => {
  const nameA = typeof a === 'string' ? a : a.name
  const nameB = typeof b === 'string' ? b : b.name

  return nameA === nameB
}

/** 通过 name 获取对象 */
export const getObjectByName = <T extends BasicField>(objectArrary: T[], name: string): T | undefined =>
  objectArrary.find(item => equalName(item, name))

/** 异步执行 */
export const asyncExec = <T>(fn: () => T): Promise<T> => new Promise(resolve => resolve(fn()))
