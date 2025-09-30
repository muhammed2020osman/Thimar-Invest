
import { createBaseService } from '@/lib/services/base.service';
import type { City, AssetType } from '@/types';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

interface SettingsParams {
    page?: number;
    per_page?: number;
    search?: string;
}

const baseCityService = createBaseService<City>('investment/cities');
const baseAssetTypeService = createBaseService<AssetType>('investment/asset-types');

export const cityService = {
    ...baseCityService,

    // Get all cities
    async getCities(params: SettingsParams = {}): Promise<PaginatedResponse<City>> {
        return baseCityService.getAll(params);
    },

    // Create new city
    async createCity(name: string): Promise<City> {
        try {
            return await baseCityService.create({
                name: name.trim()
            });
        } catch (error: any) {
            console.error('Error creating city:', error);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors.name) {
                    throw new Error('هذه المدينة موجودة بالفعل');
                }
            }
            throw new Error(error.response?.data?.message || 'Failed to create city');
        }
    },

    // Update city
    async updateCity(id: number, name: string): Promise<City> {
        try {
            return await baseCityService.update(id, { name: name.trim() });
        } catch (error: any) {
            console.error('Error updating city:', error);
            if (error.response?.status === 404) {
                throw new Error('المدينة غير موجودة');
            }
            throw new Error(error.response?.data?.message || 'Failed to update city');
        }
    },

    // Delete city
    async deleteCity(id: number): Promise<boolean> {
        try {
            await baseCityService.delete(id);
            return true;
        } catch (error: any) {
            console.error('Error deleting city:', error);
            if (error.response?.status === 404) {
                throw new Error('المدينة غير موجودة');
            }
            throw new Error(error.response?.data?.message || 'Failed to delete city');
        }
    }
};

export const assetTypeService = {
    ...baseAssetTypeService,

    // Get all asset types
    async getAssetTypes(params: SettingsParams = {}): Promise<PaginatedResponse<AssetType>> {
        return baseAssetTypeService.getAll(params);
    },

    // Create new asset type
    async createAssetType(name: string): Promise<AssetType> {
        try {
            return await baseAssetTypeService.create({
                name: name.trim()
            });
        } catch (error: any) {
            console.error('Error creating asset type:', error);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors.name) {
                    throw new Error('هذا نوع الأصل موجود بالفعل');
                }
            }
            throw new Error(error.response?.data?.message || 'Failed to create asset type');
        }
    },

    // Update asset type
    async updateAssetType(id: number, name: string): Promise<AssetType> {
        try {
            return await baseAssetTypeService.update(id, { name: name.trim() });
        } catch (error: any) {
            console.error('Error updating asset type:', error);
            if (error.response?.status === 404) {
                throw new Error('نوع الأصل غير موجود');
            }
            throw new Error(error.response?.data?.message || 'Failed to update asset type');
        }
    },

    // Delete asset type
    async deleteAssetType(id: number): Promise<boolean> {
        try {
            await baseAssetTypeService.delete(id);
            return true;
        } catch (error: any) {
            console.error('Error deleting asset type:', error);
            if (error.response?.status === 404) {
                throw new Error('نوع الأصل غير موجود');
            }
            throw new Error(error.response?.data?.message || 'Failed to delete asset type');
        }
    }
};
