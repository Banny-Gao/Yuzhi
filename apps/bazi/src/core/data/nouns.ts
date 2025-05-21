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
export const TIAN_GAN_NAME = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
/** 地支 */
export const DI_ZHI_NAME = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const
