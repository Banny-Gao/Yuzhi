/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';
import type { CreateUserDto } from '../models/CreateUserDto';
import type { LoginUserDto } from '../models/LoginUserDto';
import type { SmsLoginDto } from '../models/SmsLoginDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * 用户注册
     * @returns any 注册成功
     * @throws ApiError
     */
    public static authControllerRegister({
        requestBody,
    }: {
        requestBody: CreateUserDto,
    }): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 用户登录
     * @returns any 登录成功
     * @throws ApiError
     */
    public static authControllerLogin({
        requestBody,
    }: {
        requestBody: LoginUserDto,
    }): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 短信验证码登录
     * @returns any 登录成功
     * @throws ApiError
     */
    public static authControllerSmsLogin({
        requestBody,
    }: {
        requestBody: SmsLoginDto,
    }): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/sms-login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 刷新访问令牌
     * @returns any 令牌刷新成功
     * @throws ApiError
     */
    public static authControllerRefreshTokens(): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
        });
    }
    /**
     * 用户退出登录
     * @returns any 退出登录成功
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
        });
    }
    /**
     * 获取当前用户信息
     * @returns any 获取用户信息成功
     * @throws ApiError
     */
    public static authControllerGetProfile(): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/profile',
        });
    }
}
