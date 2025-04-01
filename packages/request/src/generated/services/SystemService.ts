/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemService {
    /**
     * 获取CORS白名单
     * @returns any
     * @throws ApiError
     */
    public static corsControllerGetAllowedOrigins(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/system/cors/origins',
        });
    }
    /**
     * 添加Origin到CORS白名单
     * @returns any
     * @throws ApiError
     */
    public static corsControllerAddOrigin({
        requestBody,
    }: {
        requestBody: {
            origin?: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/system/cors/origins',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 从CORS白名单移除Origin
     * @returns any
     * @throws ApiError
     */
    public static corsControllerRemoveOrigin({
        origin,
    }: {
        origin: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/system/cors/origins/{origin}',
            path: {
                'origin': origin,
            },
        });
    }
    /**
     * 检查Origin是否在CORS白名单中
     * @returns any
     * @throws ApiError
     */
    public static corsControllerIsOriginAllowed({
        origin,
    }: {
        origin: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/system/cors/origins/check/{origin}',
            path: {
                'origin': origin,
            },
        });
    }
}
