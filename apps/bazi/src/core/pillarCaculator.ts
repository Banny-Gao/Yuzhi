/**
 * 四柱五行能量计算模块（函数式编程实现）
 * 包含五行枚举、基础数据定义、核心计算函数及使用示例
 */

// -------------- 基础类型定义 --------------
/** 五行类型枚举 */
export enum Element {
  Wood = '木',
  Fire = '火',
  Earth = '土',
  Metal = '金',
  Water = '水',
}

/** 地支藏干结构：包含五行元素及比例（0-1） */
export interface HiddenStem {
  element: Element
  proportion: number
}

/** 四柱结构：年柱/月柱/日柱/时柱的天干地支 */
export interface FourPillars {
  year: { heavenly: string; earthly: string }
  month: { heavenly: string; earthly: string }
  day: { heavenly: string; earthly: string }
  hour: { heavenly: string; earthly: string }
}

/** 五行能量结果（百分比形式） */
export interface ElementEnergy {
  [Element.Wood]: number
  [Element.Fire]: number
  [Element.Earth]: number
  [Element.Metal]: number
  [Element.Water]: number
}

// -------------- 基础数据配置 --------------
/** 天干到五行的映射 */
export const HEAVENLY_STEMS: Record<string, Element> = {
  甲: Element.Wood,
  乙: Element.Wood,
  丙: Element.Fire,
  丁: Element.Fire,
  戊: Element.Earth,
  己: Element.Earth,
  庚: Element.Metal,
  辛: Element.Metal,
  壬: Element.Water,
  癸: Element.Water,
}

/** 地支到藏干的映射（包含本气/中气/余气比例） */
export const EARTHLY_BRANCHES: Record<string, HiddenStem[]> = {
  子: [{ element: Element.Water, proportion: 1 }],
  丑: [
    { element: Element.Earth, proportion: 0.6 },
    { element: Element.Water, proportion: 0.3 },
    { element: Element.Metal, proportion: 0.1 },
  ],
  寅: [
    { element: Element.Wood, proportion: 0.7 },
    { element: Element.Fire, proportion: 0.2 },
    { element: Element.Earth, proportion: 0.1 },
  ],
  卯: [{ element: Element.Wood, proportion: 1 }],
  辰: [
    { element: Element.Earth, proportion: 0.6 },
    { element: Element.Wood, proportion: 0.3 },
    { element: Element.Water, proportion: 0.1 },
  ],
  巳: [
    { element: Element.Fire, proportion: 0.7 },
    { element: Element.Metal, proportion: 0.2 },
    { element: Element.Earth, proportion: 0.1 },
  ],
  午: [
    { element: Element.Fire, proportion: 0.7 },
    { element: Element.Earth, proportion: 0.3 },
  ],
  未: [
    { element: Element.Earth, proportion: 0.6 },
    { element: Element.Fire, proportion: 0.3 },
    { element: Element.Wood, proportion: 0.1 },
  ],
  申: [
    { element: Element.Metal, proportion: 0.7 },
    { element: Element.Water, proportion: 0.2 },
    { element: Element.Earth, proportion: 0.1 },
  ],
  酉: [{ element: Element.Metal, proportion: 1 }],
  戌: [
    { element: Element.Earth, proportion: 0.6 },
    { element: Element.Metal, proportion: 0.3 },
    { element: Element.Fire, proportion: 0.1 },
  ],
  亥: [
    { element: Element.Water, proportion: 0.7 },
    { element: Element.Wood, proportion: 0.3 },
  ],
}

/** 宫位力量系数（年/月/日/时柱的权重比例） */
export const PALACE_COEFFICIENTS: Record<string, number> = {
  year: 0.1, // 年柱占10%
  month: 0.2, // 月柱占20%
  day: 0.4, // 日柱占40%（核心）
  hour: 0.3, // 时柱占30%
}

/** 刑冲合害破关系定义 */
export const INTERACTIONS = {
  // 三会局（同五行连续三支）
  threeMeet: {
    [Element.Wood]: ['寅', '卯', '辰'],
    [Element.Fire]: ['巳', '午', '未'],
    [Element.Metal]: ['申', '酉', '戌'],
    [Element.Water]: ['亥', '子', '丑'],
  },
  // 三合局（长生-帝旺-墓库三支）
  threeCombine: {
    [Element.Wood]: ['寅', '午', '戌'],
    [Element.Fire]: ['巳', '酉', '丑'],
    [Element.Metal]: ['申', '子', '辰'],
    [Element.Water]: ['亥', '卯', '未'],
  },
  // 六合（地支两两相合）
  sixCombine: {
    子丑: Element.Earth,
    寅亥: Element.Wood,
    卯戌: Element.Fire,
    辰酉: Element.Metal,
    巳申: Element.Water,
    午未: Element.Earth,
  },
  // 相冲（地支两两对冲）
  conflict: {
    子: '午',
    午: '子',
    丑: '未',
    未: '丑',
    寅: '申',
    申: '寅',
    卯: '酉',
    酉: '卯',
    辰: '戌',
    戌: '辰',
    巳: '亥',
    亥: '巳',
  },
  // 相刑（地支相互刑伤）
  punishment: {
    寅巳申: [Element.Wood, Element.Fire, Element.Metal],
    丑戌未: [Element.Earth, Element.Earth, Element.Earth],
    子卯: [Element.Water, Element.Wood],
    辰午酉亥: [Element.Earth, Element.Fire, Element.Metal, Element.Water],
  },
  // 相害（地支相互妨害）
  harm: {
    子未: [Element.Water, Element.Earth],
    丑午: [Element.Earth, Element.Fire],
    寅巳: [Element.Wood, Element.Fire],
    卯辰: [Element.Wood, Element.Earth],
    申亥: [Element.Metal, Element.Water],
    酉戌: [Element.Metal, Element.Earth],
  },
  // 相破（地支相互破坏）
  break: {
    子酉: [Element.Water, Element.Metal],
    丑辰: [Element.Earth, Element.Earth],
    寅亥: [Element.Wood, Element.Water],
    卯午: [Element.Wood, Element.Fire],
    巳申: [Element.Fire, Element.Metal],
    未戌: [Element.Earth, Element.Earth],
  },
}

/** 季节系数表（月令对应的旺相休囚死系数） */
export const SEASON_COEFFICIENTS: Record<Element, Record<string, number>> = {
  [Element.Wood]: { 寅卯: 1.641, 亥子: 1.498, 辰丑未戌: 1.012, 巳午: 0.674, 申酉: 0.795 },
  [Element.Fire]: { 巳午: 1.641, 寅卯: 1.498, 辰丑未戌: 1.012, 申酉: 0.674, 亥子: 0.795 },
  [Element.Earth]: { 辰丑未戌: 1.641, 巳午: 1.498, 申酉: 1.012, 亥子: 0.674, 寅卯: 0.795 },
  [Element.Metal]: { 申酉: 1.641, 辰丑未戌: 1.498, 亥子: 1.012, 寅卯: 0.674, 巳午: 0.795 },
  [Element.Water]: { 亥子: 1.641, 申酉: 1.498, 寅卯: 1.012, 巳午: 0.674, 辰丑未戌: 0.795 },
}

// -------------- 核心计算函数 --------------
/**
 * 初始化五行能量对象（所有元素初始化为0）
 * @returns 初始能量对象
 */
const initElementEnergy = (): ElementEnergy => ({
  [Element.Wood]: 0,
  [Element.Fire]: 0,
  [Element.Earth]: 0,
  [Element.Metal]: 0,
  [Element.Water]: 0,
})

/**
 * 计算基础能量（天干+地支藏干）
 * @param pillars 四柱数据
 * @returns 基础能量值（未归一化）
 */
export const calculateBaseEnergy = (pillars: FourPillars): ElementEnergy => {
  const energy = initElementEnergy()
  const pillarsEntries = Object.entries(pillars) as [keyof FourPillars, { heavenly: string; earthly: string }][]

  // 处理天干能量
  pillarsEntries.forEach(([palace, { heavenly }]) => {
    const element = HEAVENLY_STEMS[heavenly]
    const coefficient = PALACE_COEFFICIENTS[palace]
    energy[element] += 1 * coefficient // 天干全能量×宫位系数
  })

  // 处理地支藏干能量
  pillarsEntries.forEach(([palace, { earthly }]) => {
    const hiddenStems = EARTHLY_BRANCHES[earthly]
    const coefficient = PALACE_COEFFICIENTS[palace]
    hiddenStems.forEach(({ element, proportion }) => {
      energy[element] += proportion * coefficient // 藏干比例×宫位系数
    })
  })

  return energy
}

/**
 * 处理透干与通根增强
 * @param pillars 四柱数据
 * @param baseEnergy 基础能量值
 * @returns 增强后的能量值
 */
export const handleStemRevealAndRoot = (pillars: FourPillars, baseEnergy: ElementEnergy): ElementEnergy => {
  const energy = { ...baseEnergy }
  const allStems = [pillars.year.heavenly, pillars.month.heavenly, pillars.day.heavenly, pillars.hour.heavenly]
  const allBranches = [pillars.year.earthly, pillars.month.earthly, pillars.day.earthly, pillars.hour.earthly]

  // 透干增强：地支藏干透出天干时，能量额外+1倍（原已计算1倍，现再加1倍）
  allBranches.forEach((earthly, branchIndex) => {
    const palace = ['year', 'month', 'day', 'hour'][branchIndex]
    const coefficient = PALACE_COEFFICIENTS[palace]
    EARTHLY_BRANCHES[earthly].forEach(({ element, proportion }) => {
      const isRevealed = allStems.some(stem => HEAVENLY_STEMS[stem] === element)
      if (isRevealed) {
        energy[element] += proportion * coefficient // 额外增加藏干比例×宫位系数
      }
    })
  })

  // 通根增强：天干在地支有根时能量增强
  allStems.forEach((stem, stemIndex) => {
    const stemElement = HEAVENLY_STEMS[stem]
    const palace = ['year', 'month', 'day', 'hour'][stemIndex]
    const stemCoefficient = PALACE_COEFFICIENTS[palace]

    allBranches.forEach(earthly => {
      const hiddenStems = EARTHLY_BRANCHES[earthly]
      // 查找本气根（比例≥70%）
      const mainRoot = hiddenStems.find(h => h.element === stemElement && h.proportion >= 0.7)
      if (mainRoot) {
        energy[stemElement] += stemCoefficient * 0.5 // 本气根×1.5倍（原1倍+0.5倍）
        return
      }
      // 查找中气根（20%≤比例<70%）
      const midRoot = hiddenStems.find(h => h.element === stemElement && h.proportion >= 0.2)
      if (midRoot) {
        energy[stemElement] += stemCoefficient * 0.2 // 中气根×1.2倍（原1倍+0.2倍）
        return
      }
      // 查找余气根（10%≤比例<20%）
      const residueRoot = hiddenStems.find(h => h.element === stemElement && h.proportion >= 0.1)
      if (residueRoot) {
        energy[stemElement] += stemCoefficient * 0.1 // 余气根×1.1倍（原1倍+0.1倍）
      }
    })
  })

  return energy
}

/**
 * 处理刑冲合害破相互作用
 * @param pillars 四柱数据
 * @param energy 待调整的能量值
 * @returns 调整后的能量值
 */
export const handleInteractions = (pillars: FourPillars, energy: ElementEnergy): ElementEnergy => {
  const updatedEnergy = { ...energy }
  const allBranches = [pillars.year.earthly, pillars.month.earthly, pillars.day.earthly, pillars.hour.earthly]

  // 1. 三会局处理（能量×10/20倍）
  Object.entries(INTERACTIONS.threeMeet).forEach(([elementStr, branches]) => {
    const element = elementStr as Element
    const presentBranches = allBranches.filter(b => branches.includes(b))
    if (presentBranches.length === 3) {
      const isRevealed = Object.keys(HEAVENLY_STEMS).some(
        stem => HEAVENLY_STEMS[stem] === element && allBranches.includes(stem)
      )
      const multiplier = isRevealed ? 20 : 10
      updatedEnergy[element] *= multiplier
    }
  })

  // 2. 三合局处理（能量×7.5/15倍）
  Object.entries(INTERACTIONS.threeCombine).forEach(([elementStr, branches]) => {
    const element = elementStr as Element
    const presentBranches = allBranches.filter(b => branches.includes(b))
    if (presentBranches.length >= 2) {
      const isRevealed = Object.keys(HEAVENLY_STEMS).some(
        stem => HEAVENLY_STEMS[stem] === element && allBranches.includes(stem)
      )
      const multiplier = isRevealed ? 15 : 7.5
      updatedEnergy[element] *= multiplier
    }
  })

  // 3. 六合处理（能量×5/10倍）
  Object.entries(INTERACTIONS.sixCombine).forEach(([branchPair, element]) => {
    const [b1, b2] = branchPair.split('')
    if (allBranches.includes(b1) && allBranches.includes(b2)) {
      const isRevealed = Object.keys(HEAVENLY_STEMS).some(
        stem => HEAVENLY_STEMS[stem] === element && allBranches.includes(stem)
      )
      const multiplier = isRevealed ? 10 : 5
      updatedEnergy[element] *= multiplier
      // 减少原五行能量（示例处理子丑合土，其他组合类似）
      if (b1 === '子') updatedEnergy[Element.Water] *= 0.3
      if (b2 === '丑') updatedEnergy[Element.Earth] *= 0.3
    }
  })

  // 4. 相冲处理（能量×50%）
  const conflictBranches = new Set<string>()
  allBranches.forEach(branch => {
    const opponent = INTERACTIONS.conflict[branch]
    if (opponent && allBranches.includes(opponent)) {
      conflictBranches.add(branch)
      conflictBranches.add(opponent)
    }
  })
  conflictBranches.forEach(branch => {
    EARTHLY_BRANCHES[branch].forEach(({ element }) => {
      updatedEnergy[element] *= 0.5
    })
  })

  // 5. 相刑处理（能量×70%）
  Object.entries(INTERACTIONS.punishment).forEach(([branchStr, elements]) => {
    const branches = branchStr.split('')
    const presentBranches = allBranches.filter(b => branches.includes(b))
    if (presentBranches.length >= 2) {
      elements.forEach(element => {
        updatedEnergy[element] *= 0.7
      })
    }
  })

  // 6. 相害处理（能量×80%）
  Object.entries(INTERACTIONS.harm).forEach(([branchPair, elements]) => {
    const [b1, b2] = branchPair.split('')
    if (allBranches.includes(b1) && allBranches.includes(b2)) {
      elements.forEach(element => {
        updatedEnergy[element] *= 0.8
      })
    }
  })

  // 7. 相破处理（能量×90%）
  Object.entries(INTERACTIONS.break).forEach(([branchPair, elements]) => {
    const [b1, b2] = branchPair.split('')
    if (allBranches.includes(b1) && allBranches.includes(b2)) {
      elements.forEach(element => {
        updatedEnergy[element] *= 0.9
      })
    }
  })

  return updatedEnergy
}

/**
 * 应用季节系数（根据月令旺相休囚死调整）
 * @param pillars 四柱数据
 * @param energy 待调整的能量值
 * @returns 调整后的能量值
 */
export const applySeasonCoefficient = (pillars: FourPillars, energy: ElementEnergy): ElementEnergy => {
  const monthBranch = pillars.month.earthly
  let seasonKey = ''

  // 根据月令地支确定季节键
  if (['寅', '卯'].includes(monthBranch)) seasonKey = '寅卯'
  else if (['巳', '午'].includes(monthBranch)) seasonKey = '巳午'
  else if (['辰', '丑', '未', '戌'].includes(monthBranch)) seasonKey = '辰丑未戌'
  else if (['申', '酉'].includes(monthBranch)) seasonKey = '申酉'
  else if (['亥', '子'].includes(monthBranch)) seasonKey = '亥子'

  if (!seasonKey) return energy

  // 应用季节系数
  return Object.entries(energy).reduce((acc, [elementStr, value]) => {
    const element = elementStr as Element
    const coeff = SEASON_COEFFICIENTS[element][seasonKey] || 1
    acc[element] = value * coeff
    return acc
  }, initElementEnergy())
}

/**
 * 归一化能量值为百分比
 * @param energy 原始能量值
 * @returns 百分比形式的能量值（保留两位小数）
 */
export const normalizeToPercentage = (energy: ElementEnergy): ElementEnergy => {
  const total = Object.values(energy).reduce((sum, val) => sum + val, 0)
  if (total === 0) return initElementEnergy()

  return Object.entries(energy).reduce((acc, [elementStr, value]) => {
    const element = elementStr as Element
    acc[element] = Number(((value / total) * 100).toFixed(2))
    return acc
  }, initElementEnergy())
}

/**
 * 完整计算流程（主函数）
 * @param pillars 四柱数据
 * @returns 五行能量百分比
 */
export const calculatePillarEnergy = (pillars: FourPillars): ElementEnergy => {
  const baseEnergy = calculateBaseEnergy(pillars)
  const stemRootEnergy = handleStemRevealAndRoot(pillars, baseEnergy)
  const interactionEnergy = handleInteractions(pillars, stemRootEnergy)
  const seasonEnergy = applySeasonCoefficient(pillars, interactionEnergy)
  return normalizeToPercentage(seasonEnergy)
}

// -------------- 测试数据 --------------
const testCases: Record<string, FourPillars> = {
  // 案例1：木旺格局（甲木透干，寅卯亥多木根）
  woodDominant: {
    year: { heavenly: '甲', earthly: '寅' }, // 甲寅（木）
    month: { heavenly: '丁', earthly: '卯' }, // 丁卯（木火）
    day: { heavenly: '乙', earthly: '亥' }, // 乙亥（木水）
    hour: { heavenly: '己', earthly: '卯' }, // 己卯（木土）
  },

  // 案例2：火旺格局（丙丁透干，巳午戌多火根）
  fireDominant: {
    year: { heavenly: '丙', earthly: '午' }, // 丙午（火火）
    month: { heavenly: '丁', earthly: '巳' }, // 丁巳（火火）
    day: { heavenly: '丙', earthly: '戌' }, // 丙戌（火土）
    hour: { heavenly: '甲', earthly: '午' }, // 甲午（火木）
  },

  // 案例3：土旺格局（戊己透干，辰戌丑未全土）
  earthDominant: {
    year: { heavenly: '己', earthly: '未' }, // 己未（土土）
    month: { heavenly: '戊', earthly: '辰' }, // 戊辰（土土）
    day: { heavenly: '戊', earthly: '戌' }, // 戊戌（土土）
    hour: { heavenly: '己', earthly: '丑' }, // 己丑（土土）
  },

  // 案例4：金水旺格局（庚辛透干，申酉亥子全金水）
  metalWaterDominant: {
    year: { heavenly: '庚', earthly: '申' }, // 庚申（金金）
    month: { heavenly: '辛', earthly: '酉' }, // 辛酉（金金）
    day: { heavenly: '壬', earthly: '子' }, // 壬子（水水）
    hour: { heavenly: '癸', earthly: '亥' }, // 癸亥（水水）
  },
}

// -------------- 执行测试 --------------
console.log('=== 四柱五行能量计算测试 ===')
Object.entries(testCases).forEach(([caseName, pillars]) => {
  console.log(`\n测试案例：${caseName}`)
  const result = calculatePillarEnergy(pillars)
  console.table(result)
})
