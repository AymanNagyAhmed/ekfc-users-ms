import { HTTP_STATUS } from '@/common/constants/api.constants';
import { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/common/interfaces/api-response.interface';

export class ApiResponseUtil {
    static success<T>(
        data: T,
        message: string,
        path: string,
        statusCode: typeof HTTP_STATUS[keyof typeof HTTP_STATUS] = HTTP_STATUS.OK,
    ): ApiSuccessResponse<T> {
        return {
            success: true,
            statusCode,
            message,
            path,
            timestamp: new Date().toISOString(),
            data,
        };
    }

    static error(
        message: string,
        path: string,
        statusCode: typeof HTTP_STATUS[keyof typeof HTTP_STATUS] = HTTP_STATUS.BAD_REQUEST,
        errors?: Record<string, any>,
    ): ApiErrorResponse {
        return {
            success: false,
            statusCode,
            message,
            path,
            timestamp: new Date().toISOString(),
            data: null,
            ...(errors && { errors }),
        };
    }
} 