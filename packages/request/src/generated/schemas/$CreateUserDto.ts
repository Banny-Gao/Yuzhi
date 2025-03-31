/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateUserDto = {
    properties: {
        username: {
            type: 'string',
            description: `用户名`,
            isRequired: true,
        },
        email: {
            type: 'string',
            description: `电子邮件`,
            isRequired: true,
        },
        phoneNumber: {
            type: 'string',
            description: `手机号码`,
            isRequired: true,
        },
        password: {
            type: 'string',
            description: `密码`,
            isRequired: true,
        },
    },
} as const;
