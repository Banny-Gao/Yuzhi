/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserDto = {
    properties: {
        id: {
            type: 'string',
            description: `用户ID`,
            isRequired: true,
        },
        username: {
            type: 'string',
            description: `用户名`,
            isRequired: true,
        },
        email: {
            type: 'string',
            description: `邮箱`,
            isRequired: true,
        },
        phoneNumber: {
            type: 'string',
            description: `手机号`,
            isRequired: true,
        },
        isPhoneVerified: {
            type: 'boolean',
            description: `手机号是否已验证`,
            isRequired: true,
        },
        isEmailVerified: {
            type: 'boolean',
            description: `邮箱是否已验证`,
            isRequired: true,
        },
        avatar: {
            type: 'string',
            description: `用户头像URL`,
        },
        createdAt: {
            type: 'string',
            description: `用户创建时间`,
            isRequired: true,
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            description: `用户更新时间`,
            isRequired: true,
            format: 'date-time',
        },
        nickname: {
            type: 'string',
        },
        roles: {
            type: 'array',
            contains: {
                type: 'string',
            },
            isRequired: true,
        },
        isActive: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
