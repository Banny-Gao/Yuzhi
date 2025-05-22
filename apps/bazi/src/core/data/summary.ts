export type Summary = {
  title: string
  desc?: string | string[]
  content: string
  qoutes?: string[]
}

/** 五行 */
export const WU_XING_START: Summary = {
  title: '论阴阳五行之始',
  content: `太易虚无而藏水，
            太初气动而化火，
            太始形显而成木，
            太素质固而凝金，
            太极阴阳分而生土，五行之所生也。
            <br />
            一气贯通，阴阳为体，五行为用。
            万物生灭，皆在阴阳消长、五行生克间自然成理。`,
  qoutes: [
    '阴阳合德，刚柔有体；五行顺布，四时行焉。——《三命通会》',
    '五行虽分，实则一气之流行；阴阳虽判，本乎太极之浑沦。——《渊海子平》',
  ],
}

/** 天干五行 */
export const TIAN_GAN_WU_XING: Summary = {
  title: '天干五行',
  content: `甲乙东方木，丙丁南方火，戊己中央土，庚辛西方金，壬癸北方水。`,
}

/** 五虎遁 */
export const WU_HU_DUN: Summary = {
  title: '五虎遁',
  desc: '年上起月，表示正月天干',
  content: `甲己之年丙作首，乙庚之岁戊为头，丙辛之岁寻庚起，丁壬壬位顺行流，戊癸何方发，壬子是真途。`,
}

/** 五鼠遁 */
export const WU_SHU_DUN: Summary = {
  title: '五鼠遁',
  desc: '日上起时，表示子时天干',
  content: `甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途。`,
}

/** 天干五合 */
export const TIAN_GAN_HE: Summary = {
  title: '天干五合',
  desc: ['隔五位而合', '异性相合，土水合、金木合、火金合'],
  content: `甲己合土，乙庚合金，丙辛合水，丁壬合木，戊癸合火。`,
}

/** 天干相冲 */
export const TIAN_GAN_CHONG: Summary = {
  title: '天干相冲',
  desc: ['隔六位而冲', '同性相冲，水火冲、金木冲'],
  content: `甲庚冲，乙辛冲，丙壬冲，丁癸冲。`,
}

/** 五行寄生十二宫 */
export const WU_XING_JI_SHENG_TWELVE_PALACE: Summary = {
  title: '五行寄生十二宫',
  desc: ['阳干顺行，阴干逆行'],
  content: `长生、沐浴、冠带、临官、帝旺、衰、病、死、墓、绝、胎、养。`,
}

/** 生克十神 */
export const SHENG_KE_SHI_SHEN: Summary = {
  title: '生克十神',
  desc: ['干支生克分阴阳而论，谓十神六亲'],
  content: `同我者为比劫：同为比肩，异为劫财
            生我者为枭印：同为偏印（枭神），异为正印
            克我者为杀官：同为七杀（煞），异为正官
            我生者为食伤：同为食神，异为伤官
            我克者为财：同为偏财，异为正财

            正印为母，偏财为父
            比肩劫财为兄弟姐妹
            女命伤官为儿，食神为女
            男命杀官为儿女，不见官杀看食伤，
            女命正官为夫，男命正财为妻`,
}
