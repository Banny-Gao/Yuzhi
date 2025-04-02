/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from './UserDto';
export type SmsLoginResponseDto = {
    /**
     * 访问令牌
     */
    accessToken: string;
    /**
     * 刷新令牌
     */
    refreshToken: string;
    /**
     * 用户信息
     */
    user: UserDto;
    /**
     * 是否为新用户
     */
    isNewUser: boolean;
};

