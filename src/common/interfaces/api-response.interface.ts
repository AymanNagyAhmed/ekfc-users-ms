import { HTTP_STATUS } from '@/common/constants/api.constants';

export interface ApiResponseMetadata {
  path: string;
  timestamp: string;
}

export interface ApiSuccessResponse<T> extends ApiResponseMetadata {
  success: true;
  statusCode: typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
  message: string;
  data: T;
}

export interface ApiErrorResponse extends ApiResponseMetadata {
  success: false;
  statusCode: typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
  message: string;
  errors?: Record<string, any>;
  data: null;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse; 