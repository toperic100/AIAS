
// frontend/web/src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import toast from 'react-hot-toast';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || '/api') {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加请求ID用于追踪
        config.headers['X-Request-ID'] = this.generateRequestId();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error: AxiosError<ApiError>) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): void {
    if (!error.response) {
      toast.error('网络错误,请检查网络连接');
      return;
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        // 未授权,清除token并跳转登录
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast.error('登录已过期,请重新登录');
        break;

      case 403:
        toast.error('没有权限执行此操作');
        break;

      case 404:
        toast.error('请求的资源不存在');
        break;

      case 422:
        // 验证错误
        if (data.errors) {
          Object.values(data.errors).forEach((messages) => {
            messages.forEach((msg) => toast.error(msg));
          });
        } else {
          toast.error(data.message || '数据验证失败');
        }
        break;

      case 429:
        toast.error('请求过于频繁,请稍后再试');
        break;

      case 500:
        toast.error('服务器错误,请稍后再试');
        break;

      default:
        toast.error(data.message || '请求失败');
    }
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // GET请求
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<any, T>(url, config);
  }

  // POST请求
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<any, T>(url, data, config);
  }

  // PUT请求
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<any, T>(url, data, config);
  }

  // PATCH请求
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch<any, T>(url, data, config);
  }

  // DELETE请求
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<any, T>(url, config);
  }

  // 上传文件
  async upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.instance.post<any, T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // 下载文件
  async download(url: string, filename: string): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}

// 导出单例
export const api = new ApiClient();

// 导出类型化的API方法
export default api;