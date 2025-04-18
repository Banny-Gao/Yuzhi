/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RegisterResponseDto = {
    properties: {
        accessToken: {
            type: 'string',
            description: `访问令牌`,
            isRequired: true,
        },
        refreshToken: {
            type: 'string',
            description: `刷新令牌`,
            isRequired: true,
        },
        user: {
            type: 'all-of',
            description: `用户信息`,
            contains: [{
                type: 'UserDto',
            }],
            isRequired: true,
        },
    },
} as const;
