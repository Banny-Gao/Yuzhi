export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ApiStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  IDLE = 'IDLE',
}

export interface ApiResponse<T> {
  status: ApiStatus;
  data?: T;
  error?: string;
  timestamp: number;
} 