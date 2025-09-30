import { createBaseService } from '@/lib/services/base.service';
import type { InvestmentOpportunity } from '@/types';

// API Response types
interface ApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

interface OpportunityParams {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    city_id?: number;
    asset_type_id?: number;
    developer_id?: number;
}

const baseOpportunityService = createBaseService('test/investment/opportunities');

export const opportunityService = {
    ...baseOpportunityService,

    // Get all opportunities with pagination and filters
    async getAllOpportunities(params: OpportunityParams = {}): Promise<PaginatedResponse<InvestmentOpportunity>> {
        return baseOpportunityService.getAll(params);
    },

    // Get all opportunities (simple version for dashboard)
    async getOpportunities(): Promise<InvestmentOpportunity[]> {
        try {
            const response = await baseOpportunityService.getAll();
            console.log('getOpportunities response:', response);
            
            // Handle different response structures
            if (Array.isArray(response)) {
                return response;
            }
            if (response.data && Array.isArray(response.data)) {
                return response.data;
            }
            if (response.payload && Array.isArray(response.payload)) {
                return response.payload;
            }
            if (response.payload?.data && Array.isArray(response.payload.data)) {
                return response.payload.data;
            }
            
            console.warn('Unexpected response structure:', response);
            return [];
        } catch (error: any) {
            console.error('Error fetching opportunities:', error);
            throw new Error('Failed to fetch opportunities');
        }
    },

    // Get opportunity by ID
    async getOpportunityById(id: number): Promise<InvestmentOpportunity | null> {
        try {
            const response = await baseOpportunityService.customGet(`test/investment/opportunities/${id}`);
            return response.payload || response.data || response;
        } catch (error: any) {
            console.error(`Error fetching opportunity with ID ${id}:`, error);
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch opportunity');
        }
    },

    // Create opportunity with validation
    async createOpportunity(data: { 
        name: string; 
        description: string; 
        expected_return: number;
        duration: string;
        funded: number;
        status: string;
        developer_id: number;
        city_id: number;
        asset_type_id: number;
        image_ids?: string;
    }): Promise<InvestmentOpportunity> {
        try {
            const opportunityData = {
                name: data.name.trim(),
                description: data.description.trim(),
                expected_return: data.expected_return,
                duration: data.duration.trim(),
                funded: data.funded,
                status: data.status,
                developer_id: data.developer_id,
                city_id: data.city_id,
                asset_type_id: data.asset_type_id,
                image_ids: data.image_ids || null,
            };
            return await baseOpportunityService.create(opportunityData);
        } catch (error: any) {
            console.error('Error creating opportunity:', error);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors.name) {
                    throw new Error('اسم الفرصة هذا مستخدم بالفعل');
                }
                if (errors.developer_id) {
                    throw new Error('المطور المحدد غير موجود');
                }
                if (errors.city_id) {
                    throw new Error('المدينة المحددة غير موجودة');
                }
                if (errors.asset_type_id) {
                    throw new Error('نوع الأصل المحدد غير موجود');
                }
            }
            throw new Error(error.response?.data?.message || 'Failed to create opportunity');
        }
    },

    // Update opportunity with validation
    async updateOpportunity(id: number, data: Partial<{
        name: string;
        description: string;
        expected_return: number;
        duration: string;
        funded: number;
        status: string;
        developer_id: number;
        city_id: number;
        asset_type_id: number;
        image_ids: string;
    }>): Promise<InvestmentOpportunity> {
        try {
            const updateData: { [key: string]: any } = {};
            if (data.name) updateData.name = data.name.trim();
            if (data.description) updateData.description = data.description.trim();
            if (data.expected_return !== undefined) updateData.expected_return = data.expected_return;
            if (data.duration) updateData.duration = data.duration.trim();
            if (data.funded !== undefined) updateData.funded = data.funded;
            if (data.status) updateData.status = data.status;
            if (data.developer_id) updateData.developer_id = data.developer_id;
            if (data.city_id) updateData.city_id = data.city_id;
            if (data.asset_type_id) updateData.asset_type_id = data.asset_type_id;
            if (data.image_ids !== undefined) updateData.image_ids = data.image_ids;

            if (Object.keys(updateData).length === 0) {
                return await baseOpportunityService.getById(id);
            }

            return await baseOpportunityService.customPut(`test/investment/opportunities/${id}`, updateData);
        } catch (error: any) {
            console.error('Error updating opportunity:', error);
            if (error.response?.status === 404) {
                throw new Error('الفرصة غير موجودة');
            }
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors.name) {
                    throw new Error('اسم الفرصة هذا مستخدم بالفعل');
                }
                if (errors.developer_id) {
                    throw new Error('المطور المحدد غير موجود');
                }
                if (errors.city_id) {
                    throw new Error('المدينة المحددة غير موجودة');
                }
                if (errors.asset_type_id) {
                    throw new Error('نوع الأصل المحدد غير موجود');
                }
            }
            throw new Error(error.response?.data?.message || 'Failed to update opportunity');
        }
    },

    // Delete opportunity
    async deleteOpportunity(id: number): Promise<boolean> {
        try {
            await baseOpportunityService.delete(id);
            return true;
        } catch (error: any) {
            console.error('Error deleting opportunity:', error);
            if (error.response?.status === 404) {
                throw new Error('الفرصة غير موجودة');
            }
            throw new Error(error.response?.data?.message || 'Failed to delete opportunity');
        }
    },

    // Get opportunities by status
    async getOpportunitiesByStatus(status: string): Promise<InvestmentOpportunity[]> {
        try {
            const response = await baseOpportunityService.getAll({ status });
            return response.data || response.payload?.data || response;
        } catch (error: any) {
            console.error(`Error fetching opportunities with status ${status}:`, error);
            throw new Error('Failed to fetch opportunities');
        }
    },

    // Get opportunities by city
    async getOpportunitiesByCity(cityId: number): Promise<InvestmentOpportunity[]> {
        try {
            const response = await baseOpportunityService.getAll({ city_id: cityId });
            return response.data || response.payload?.data || response;
        } catch (error: any) {
            console.error(`Error fetching opportunities for city ${cityId}:`, error);
            throw new Error('Failed to fetch opportunities');
        }
    },

    // Get opportunities by asset type
    async getOpportunitiesByAssetType(assetTypeId: number): Promise<InvestmentOpportunity[]> {
        try {
            const response = await baseOpportunityService.getAll({ asset_type_id: assetTypeId });
            return response.data || response.payload?.data || response;
        } catch (error: any) {
            console.error(`Error fetching opportunities for asset type ${assetTypeId}:`, error);
            throw new Error('Failed to fetch opportunities');
        }
    }
};