/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ApiResponse = {
    properties: {
        code: {
            type: 'number',
            description: `响应状态码`,
            isRequired: true,
        },
        data: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isRequired: true,
        },
        message: {
            type: 'string',
            description: `响应消息`,
            isRequired: true,
        },
    },
} as const;
