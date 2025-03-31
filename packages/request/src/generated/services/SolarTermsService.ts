/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SolarTerm } from '../models/SolarTerm';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SolarTermsService {
    /**
     * 获取二十四节气
     * @param year 年份，默认为当前年份
     * @returns SolarTerm 返回二十四节气数据
     * @throws ApiError
     */
    public static solarTermsControllerGetSolarTerms(
        year?: number,
    ): CancelablePromise<Array<SolarTerm>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendar/solar-terms',
            query: {
                'year': year,
            },
        });
    }
}
