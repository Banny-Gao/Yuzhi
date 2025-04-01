/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RefreshTokenResponseDto = {
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
    },
} as const;
