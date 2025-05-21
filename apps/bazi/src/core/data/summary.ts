export type Summary = {
  title: string
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
