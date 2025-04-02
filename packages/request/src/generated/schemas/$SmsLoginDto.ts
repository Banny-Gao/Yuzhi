/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SmsLoginDto = {
    properties: {
        phoneNumber: {
            type: 'string',
            description: `手机号码`,
            isRequired: true,
        },
        code: {
            type: 'string',
            description: `验证码`,
            isRequired: true,
        },
    },
} as const;
