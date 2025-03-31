/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SolarTerm = {
    properties: {
        id: {
            type: 'string',
            description: `主键ID`,
            isRequired: true,
        },
        pub_year: {
            type: 'number',
            description: `年份`,
            isRequired: true,
        },
        name: {
            type: 'string',
            description: `节气名称`,
            isRequired: true,
        },
        pub_date: {
            type: 'string',
            description: `节气公历日期`,
            isRequired: true,
        },
        pri_date: {
            type: 'string',
            description: `节气农历日期`,
            isRequired: true,
        },
        pub_time: {
            type: 'string',
            description: `节气时间`,
            isRequired: true,
        },
        des: {
            type: 'string',
            description: `节气简介`,
            isRequired: true,
        },
        youLai: {
            type: 'string',
            description: `节气由来`,
            isRequired: true,
        },
        xiSu: {
            type: 'string',
            description: `节气习俗`,
            isRequired: true,
        },
        heath: {
            type: 'string',
            description: `节气养生建议`,
            isRequired: true,
        },
    },
} as const;
