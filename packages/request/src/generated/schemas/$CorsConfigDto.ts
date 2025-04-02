/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CorsConfigDto = {
    properties: {
        origin: {
            type: 'string',
            description: `域名`,
            isRequired: true,
        },
        isActive: {
            type: 'boolean',
            description: `是否启用`,
            isRequired: true,
        },
        createdAt: {
            type: 'string',
            description: `创建时间`,
            isRequired: true,
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            description: `更新时间`,
            isRequired: true,
            format: 'date-time',
        },
    },
} as const;
