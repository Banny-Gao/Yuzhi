/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { LoginUserDto } from '../models/LoginUserDto';
import type { SmsLoginDto } from '../models/SmsLoginDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * 用户注册
     * @param requestBody
     * @returns any 注册成功
     * @throws ApiError
     */
    public static authControllerRegister(
        requestBody: CreateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `注册失败`,
                409: `用户名/手机号/邮箱已存在`,
            },
        });
    }
    /**
     * 用户登录
     * @param requestBody
     * @returns any 登录成功
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `未授权`,
            },
        });
    }
    /**
     * 短信验证码登录
     * @param requestBody
     * @returns any 登录成功
     * @throws ApiError
     */
    public static authControllerLoginWithSms(
        requestBody: SmsLoginDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/sms',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `登录失败`,
            },
        });
    }
    /**
     * 刷新令牌
     * @returns any 刷新成功
     * @throws ApiError
     */
    public static authControllerRefreshTokens(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            errors: {
                401: `刷新失败`,
            },
        });
    }
    /**
     * 退出登录
     * @returns any 退出成功
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
        });
    }
    /**
     * 获取当前用户信息
     * @returns any 获取成功
     * @throws ApiError
     */
    public static authControllerGetProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/profile',
            errors: {
                401: `未授权`,
            },
        });
    }
}
