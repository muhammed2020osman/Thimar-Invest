import apiClient from './api';
import { type AxiosResponse } from 'axios';

// NOTE: Flexible responses to accommodate different backend wrappers (data, payload, meta, links)
export const createBaseService = (resource: string) => ({
  async getAll(params: any = {}): Promise<any> {
    const response: AxiosResponse<any> = await apiClient.get(`${resource}`, { params });
    // Handle different response structures
    const data = response.data;
    console.log(`Base service response for ${resource}:`, data);
    
    // Check if data has the expected structure
    if (data.success && data.data) {
      return data; // Return full response with success/data structure
    }
    if (data.payload && data.payload.data) {
      return data; // Return full response with payload structure
    }
    return data;
  },

  async customGet(url: string): Promise<any> {
    const response: AxiosResponse<any> = await apiClient.get(url);
    return response.data;
  },

  async customPost(url: string, data: any): Promise<any> {
    const response: AxiosResponse<any> = await apiClient.post(url, data);
    return response.data;
  },

  async customPostWithFormData(url: string, data: any): Promise<any> {
    const isFormData = data instanceof FormData;

    const response: AxiosResponse<any> = await apiClient.post(url, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });

    return response.data;
  },

  async customPut(url: string, data: any): Promise<any> {
    const response: AxiosResponse<any> = await apiClient.put(url, data);
    return response.data;
  },

  async getById(id: string | number): Promise<any> {
    const response: AxiosResponse<any> = await apiClient.get(`${resource}/${id}`);
    return response.data;
  },

  async create(data: any): Promise<any> {
    const response: AxiosResponse<any> = await apiClient.post(`${resource}`, data);
    return response.data;
  },

  async update(id: string | number, data: any): Promise<any> {
    const response: AxiosResponse<any> = await apiClient.put(`${resource}/${id}`, data);
    return response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`${resource}/${id}`);
  },
});