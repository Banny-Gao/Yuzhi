/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LoginUserDto = {
    properties: {
        usernameOrPhone: {
            type: 'string',
            description: `用户名或手机号`,
            isRequired: true,
        },
        password: {
            type: 'string',
            description: `密码`,
            isRequired: true,
        },
        rememberMe: {
            type: 'boolean',
            description: `是否记住登录状态`,
        },
    },
} as const;
