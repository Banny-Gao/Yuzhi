/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserDto = {
    /**
     * 用户ID
     */
    id: string;
    /**
     * 用户名
     */
    username: string;
    /**
     * 邮箱
     */
    email: string;
    /**
     * 手机号
     */
    phoneNumber: string;
    /**
     * 手机号是否已验证
     */
    isPhoneVerified: boolean;
    /**
     * 邮箱是否已验证
     */
    isEmailVerified: boolean;
    /**
     * 用户头像URL
     */
    avatar?: string;
    /**
     * 用户创建时间
     */
    createdAt: string;
    /**
     * 用户更新时间
     */
    updatedAt: string;
};

