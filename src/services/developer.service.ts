
import { createBaseService } from '@/lib/services/base.service';
import type { Developer } from '@/types';
import type { DeveloperFormValues } from '@/types/forms';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

interface DeveloperParams {
    page?: number;
    per_page?: number;
    search?: string;
}

const baseDeveloperService = createBaseService<Developer>('investment/developers');

export const developerService = {
    ...baseDeveloperService,

    // Get all developers with pagination and filters
    async getDevelopers(params: DeveloperParams = {}): Promise<PaginatedResponse<Developer>> {
        return baseDeveloperService.getAll(params);
    },

    // Get developer by ID
    async getDeveloperById(id: number): Promise<Developer | null> {
        try {
            return await baseDeveloperService.getById(id);
        } catch (error: any) {
            console.error(`Error fetching developer with id ${id}:`, error);
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch developer');
        }
    },

    // Create new developer
    async createDeveloper(data: DeveloperFormValues): Promise<Developer> {
        try {
            const payload = {
                name: data.name.trim(),
                email: data.email.trim(),
                description: data.description?.trim() || null,
                phone: data.phone.trim()
            };
            console.log('Creating developer with payload:', payload);
            return await baseDeveloperService.create(payload);
        } catch (error: any) {
            console.error('Error creating developer:', error);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors.name) {
                    throw new Error('هذا المطور موجود بالفعل');
                }
            }
            throw new Error(error.response?.data?.message || 'Failed to create developer');
        }
    },

    // Update developer
    async updateDeveloper(id: number, data: DeveloperFormValues): Promise<Developer> {
        try {
            return await baseDeveloperService.update(id, {
                name: data.name.trim(),
                email: data.email.trim(),
                description: data.description?.trim() || null,
                phone: data.phone.trim()
            });
        } catch (error: any) {
            console.error('Error updating developer:', error);
            if (error.response?.status === 404) {
                throw new Error('المطور غير موجود');
            }
            throw new Error(error.response?.data?.message || 'Failed to update developer');
        }
    },

    // Delete developer
    async deleteDeveloper(id: number): Promise<boolean> {
        try {
            await baseDeveloperService.delete(id);
            return true;
        } catch (error: any) {
            console.error('Error deleting developer:', error);
            if (error.response?.status === 404) {
                throw new Error('المطور غير موجود');
            }
            throw new Error(error.response?.data?.message || 'Failed to delete developer');
        }
    },

    // Get developer statistics
    async getStatistics() {
        return baseDeveloperService.customGet('/investment/developers/statistics');
    }
};
