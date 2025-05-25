export const NOUN = {
  solar: '阳历',
  year: '年',
  month: '月',
  day: '日',
  hour: '时',
  minute: '分',
  second: '秒',
  date: '日期',
  dateString: '阳历时间',
  lunar: '农历',
  lunarMonth: '农历月份',
  lunarDay: '农历日',
  isLeap: '是否闰月',
  lunarDateString: '农历时间',
  monthIndex: '月份索引',
  dateIndex: '日索引',
  currentSolarTerms: '前后节气',
  solarTermDateString: '节气时间',
  solarTermName: '节气名称',
  seasonName: '季节名称',
  introduction: '简介',
  youLai: '由来',
  xiSu: '习俗',
  yangSheng: '养生建议',
  name: '名称',
  summary: '总结',
  qoutes: '引用',
  content: '内容',
  title: '标题',
  yinYang: '阴阳',
  opposite: '相反',
  wuXing: '五行',
  wuShu: '五行数字',
  wuFang: '五行方位',
  wuChang: '五常',
  wuZang: '五脏',
  liuFu: '六腑',
  wuSe: '五色',
  wuWei: '五味',
  wuZhi: '五志',
  shengWo: '生我者',
  keWo: '克我者',
  ke: '我克者',
  sheng: '我生者',
  liuShen: '六神',
  tianGan: '天干',
  diZhi: '地支',
  tianWen: '天文',
  twelvePlace: '五行寄生十二宫',
  zhangSheng: '长生',
  muYu: '沐浴',
  guanDai: '冠带',
  linGuan: '临官',
  diWang: '帝旺',
  shuai: '衰',
  bing: '病',
  si: '死',
  mu: '墓',
  jue: '绝',
  tai: '胎',
  yang: '养',
  he: '合',
  hua: '化',
  chong: '冲',
  hui: '会',
  wuHudun: '五虎遁',
  wuShuDun: '五鼠遁',
  desc: '描述',
  represent: '代表',
  siYu: '四隅',
  siZheng: '四正',
  siKu: '四库',
  sanHui: '三会',
  sanHe: '三合',
  banHe: '半合',
  shengWang: '生旺半合',
  muWang: '墓旺半合',
  shengMu: '生墓拱合',
  cangGan: '地支藏干',
  benQi: '本气',
  zhongQi: '中气',
  yuQi: '余气',
  hai: '相害',
  po: '相破',
  xing: '相刑',
  anHe: '暗合',
  forTarget: '我为',
  forMe: '为我',
  shiShen: '十神',
  bijian: '比肩',
  jiecai: '劫财',
  pianYin: '偏印',
  zhengYin: '正印',
  shishen: '食神', // 注意区分 shiShen
  shangguan: '伤官',
  qisha: '七杀',
  zhengguan: '正官',
  piancai: '偏财',
  zhengcai: '正财',
  shengXiao: '生肖',
  dili: '地理',
  zhangJu: '掌诀',
}

/** 季节 */
export const SEASON_NAME = ['春', '夏', '秋', '冬'] as const
/** 农历月份 */
export const LUNAR_MONTH = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'] as const
export const LUNAR_MONTH_WITH_LEAP = [...LUNAR_MONTH.map(item => `闰${item}`)] as const
/** 农历日 */
export const LUNAR_DAY = [
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
] as const
export const SOLAR_TERM = [
  '立春',
  '雨水',
  '惊蛰',
  '春分',
  '清明',
  '谷雨',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪',
  '冬至',
  '小寒',
  '大寒',
] as const

/** 阴阳 */
export const YIN_YANG_NAME = ['阴', '阳'] as const
/** 五行 */
export const WX_NAME = ['木', '火', '土', '金', '水'] as const
/** 五数 */
export const WX_SHU = [
  /** 五行数字 */
  [3, 8], // 木
  [2, 7], // 火
  [5, 10], // 土
  [4, 9], // 金
  [1, 6], // 水
] as const
/** 五行方位 */
export const WU_FANG_NAME = ['东', '南', '中', '西', '北'] as const
/** 五常 */
export const WU_CHANG_NAME = ['仁', '礼', '信', '义', '智'] as const
/** 五脏 */
export const WU_ZANG_NAME = ['肝', '心', '脾', '肺', '肾'] as const
/** 六腑 */
export const LIU_FU_NAME = ['胆', '小肠', '胃', '大肠', '膀胱'] as const
/** 五色 */
export const WU_SE_NAME = ['青', '赤', '黄', '白', '黑'] as const
/** 五味 */
export const WU_WEI_NAME = ['酸', '苦', '甘', '辛', '咸'] as const
/** 五志 */
export const WU_ZHI_NAME = ['怒', '喜', '思', '悲', '恐'] as const
/** 六神 */
export const LIU_SHEN_NAME = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'] as const
/** 天干 */
export const GAN_NAME = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
/** 地支 */
export const ZHI_NAME = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const
/** 五行对应六神 */
export const WX_LIUSHEN = ['青龙', '朱雀', ['勾陈', '腾蛇'], '白虎', '玄武'] as const
/** 五行对应天干 */
export const WX_TIAN_GAN = [
  ['甲', '乙'],
  ['丙', '丁'],
  ['戊', '己'],
  ['庚', '辛'],
  ['壬', '癸'],
] as const
/** 五行对应地支 */
export const WX_DI_ZHI = [
  ['寅', '卯'],
  ['巳', '午'],
  ['辰', '戌', '丑', '未'],
  ['申', '酉'],
  ['亥', '子'],
] as const

/** 十天干对应天文 */
export const GAN_TIAN_WEN = ['雷', '风', '日', '星', '霞', '云', '月', '霜', '秋露', '春霖'] as const
/** 天干对应六神 */
export const GAN_LIU_SHEN = [
  ['甲', '青龙'],
  ['丙', '朱雀'],
  ['戊', '勾陈'],
  ['己', '腾蛇'],
  ['庚', '白虎'],
  ['壬', '玄武'],
] as const
/** 天干五合 */
export const GAN_HE = [
  ['甲', '己', '土', '中正之合'],
  ['乙', '庚', '金', '仁义之合'],
  ['丙', '辛', '水', '威制之合'],
  ['丁', '壬', '木', '淫慝之合'],
  ['戊', '癸', '火', '无情之合'],
] as const
/** 天干四冲 */
export const GAN_CHONG = [
  ['甲', '庚'],
  ['乙', '辛'],
  ['丙', '壬'],
  ['丁', '癸'],
] as const
/** 五行寄生十二宫 */
export const TWELVE_PLACE_NAME = [
  '长生',
  '沐浴',
  '冠带',
  '临官',
  '帝旺',
  '衰',
  '病',
  '死',
  '墓',
  '绝',
  '胎',
  '养',
] as const

/** 生肖 */
export const SHENG_XIAO_NAME = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'] as const
/** 地理 */
export const DI_LI_NAME = [
  '墨池',
  '柳岸',
  '广谷',
  '琼林',
  '草泽',
  '大驿',
  '烽堠',
  '花园',
  '名都',
  '寺钟',
  '烧原',
  '悬河',
] as const
/** 四正|四旺（子午卯酉）旺：水火木金 */
export const SI_ZHENG_NAME = [
  ['子', '水'],
  ['午', '火/土'],
  ['卯', '木'],
  ['酉', '金'],
] as const
/** 四隅|四长生（寅申巳亥）长生：火水金木 */
export const SI_YU_NAME = [
  ['寅', '火'],
  ['申', '水'],
  ['巳', '金'],
  ['亥', '木'],
] as const

/** 四库｜四墓（辰戌丑未）, 皆属土 墓： 水 火 金 木 */
export const SI_KU_NAME = [
  ['辰', '水'],
  ['戌', '火'],
  ['丑', '金'],
  ['未', '木'],
] as const
/** 地支三会 */
export const ZHI_SAN_HUI = [
  ['寅', '卯', '辰', '木'],
  ['巳', '午', '未', '火'],
  ['申', '酉', '戌', '金'],
  ['亥', '子', '丑', '水'],
] as const
/** 地支三合 */
export const ZHI_SAN_HE = [
  ['亥', '卯', '未', '木'],
  ['寅', '午', '戌', '火'],
  ['巳', '酉', '丑', '金'],
  ['申', '子', '辰', '水'],
] as const
/** 生旺半合 */
export const SHENG_WANG = [
  ['申', '子', '水'],
  ['寅', '午', '火'],
  ['亥', '卯', '木'],
  ['巳', '酉', '金'],
] as const
/** 墓旺半合 */
export const MU_WANG = [
  ['子', '辰', '水'],
  ['午', '戌', '火'],
  ['卯', '未', '木'],
  ['酉', '丑', '金'],
] as const
/** 生墓拱合 */
export const SHENG_MU = [
  ['申', '辰', '水'],
  ['寅', '戌', '火'],
  ['巳', '丑', '金'],
  ['亥', '未', '木'],
] as const
/** 地支藏干 */
export const ZHI_CANG_GAN = [
  ['子', '癸', null, null],
  ['丑', '己', '辛', '癸'],
  ['寅', '甲', '丙', '戊'],
  ['卯', '乙', null, null],
  ['辰', '戊', '癸', '乙'],
  ['巳', '丙', '庚', '戊'],
  ['午', '丁', '己', null],
  ['未', '己', '乙', '丁'],
  ['申', '庚', '壬', '戊'],
  ['酉', '辛', null, null],
  ['戌', '戊', '丁', '辛'],
  ['亥', '壬', '甲', null],
] as const
/** 掌诀: 原点为 中指末关节 和 无名指末关节 中间 */
export const FINGER_POSITION = [
  [1, 0], // 子
  [-1, 0], // 丑
  [-3, 0], // 寅
  [-3, 1], // 卯
  [-3, 2], // 辰
  [-3, 3], // 巳
  [-1, 3], // 午
  [1, 3], // 未
  [3, 3], // 申
  [3, 2], // 酉
  [3, 1], // 戌
  [3, 0], // 亥
] as const
/** 地支六合 */
export const ZHI_HE = [
  ['子', '丑', '土/水', '泥合'],
  ['寅', '亥', '木', '义合'],
  ['卯', '戌', '火', '淫合'],
  ['辰', '酉', '金', '融合'],
  ['巳', '申', '水', '刑合'],
  ['午', '未', '土/火', '和合'],
] as const
/** 地支六冲*/
export const ZHI_CHONG = [
  ['子', '午'],
  ['丑', '未'],
  ['寅', '申'],
  ['卯', '酉'],
  ['辰', '戌'],
  ['巳', '亥'],
] as const
/** 地支六害 */
export const ZHI_HAI = [
  ['子', '未', '势家相害'],
  ['丑', '午', '官鬼相害'],
  ['寅', '巳', '临官相害'],
  ['卯', '辰', '凌长相害'],
  ['申', '亥', '争进相害'],
  ['酉', '戌', '嫉妒相害'],
] as const
/** 地支六破 */
export const ZHI_PO = [
  ['子', '酉'],
  ['午', '卯'],
  ['寅', '亥'],
  ['巳', '申'],
  ['辰', '丑'],
  ['戌', '未'],
] as const
/** 地支三刑 */
export const ZHI_XING = [
  ['寅', '巳', '无恩之刑'],
  ['巳', '申', '无恩之刑'],
  ['申', '寅', '无恩之刑'],
  ['丑', '戌', '恃势之刑'],
  ['戌', '未', '恃势之刑'],
  ['未', '丑', '恃势之刑'],
  ['子', '卯', '无礼之刑'],
  ['卯', '子', '无礼之刑'],
  ['辰', '辰', '自刑之刑'],
  ['午', '午', '自刑之刑'],
  ['酉', '酉', '自刑之刑'],
  ['亥', '亥', '自刑之刑'],
] as const
/** 地支暗合 */
export const ZHI_AN_HE = [
  ['寅', '丑', '通合'],
  ['亥', '午', '通合'],
  ['卯', '申', '通禄合'],
  ['巳', '酉', '通禄合'],
  ['子', '巳', '通禄合'],
  ['寅', '午', '通禄合'],
] as const

/** 十神 */
export const SHI_SHEN_NAME = [
  ['比肩', '劫财'], // 同我者为比劫
  ['偏印', '正印'], // 生我者为枭印
  ['食神', '伤官'], // 我生者为食伤
  ['七杀', '正官'], // 克我者为官杀
  ['偏财', '正财'], // 我克者为财
] as const
