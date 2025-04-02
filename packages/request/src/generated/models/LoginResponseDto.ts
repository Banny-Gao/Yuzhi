/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from './UserDto';
export type LoginResponseDto = {
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
};

