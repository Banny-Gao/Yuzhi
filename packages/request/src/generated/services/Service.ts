/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddOriginDto } from '../models/AddOriginDto';
import type { AddOriginsDto } from '../models/AddOriginsDto';
import type { ApiResponse } from '../models/ApiResponse';
import type { RemoveOriginDto } from '../models/RemoveOriginDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * 获取CORS白名单列表
     * @returns any 获取成功
     * @throws ApiError
     */
    public static corsControllerGetAllowedOrigins(): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/system/cors/origins',
        });
    }
    /**
     * 批量添加域名到CORS白名单
     * @returns any 批量添加成功
     * @throws ApiError
     */
    public static corsControllerAddOrigins({
        requestBody,
    }: {
        requestBody: AddOriginsDto,
    }): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/system/cors/origins',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 添加域名到CORS白名单
     * @returns any 添加成功
     * @throws ApiError
     */
    public static corsControllerAddOrigin({
        requestBody,
    }: {
        requestBody: AddOriginDto,
    }): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/system/cors/origin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 从CORS白名单移除域名
     * @returns any 移除成功
     * @throws ApiError
     */
    public static corsControllerRemoveOrigin({
        requestBody,
    }: {
        requestBody: RemoveOriginDto,
    }): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/system/cors/origin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 检查Origin是否在CORS白名单中
     * @returns any 检查成功
     * @throws ApiError
     */
    public static corsControllerIsOriginAllowed({
        origin,
    }: {
        origin: string,
    }): CancelablePromise<ApiResponse<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/system/cors/origins/check/{origin}',
            path: {
                'origin': origin,
            },
        });
    }
}
