
import { createBaseService } from '@/lib/services/base.service';
import type { User } from '@/types';

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

interface UserParams {
    page?: number;
    per_page?: number;
    search?: string;
    type?: string;
    status?: string;
}

const baseUserService = createBaseService('investment/users');

export const userService = {
    ...baseUserService,

    // Get all users with pagination and filters
    async getAllUsers(params: UserParams = {}): Promise<PaginatedResponse<User>> {
        return baseUserService.getAll(params);
    },

    // Get user by phone number
    async getUserByPhone(phone: string): Promise<User | null> {
        try {
            return await baseUserService.customGet(`/investment/users/search?phone=${phone}`);
        } catch (error: any) {
            console.error(`Error fetching user with phone ${phone}:`, error);
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch user');
        }
    },

    // Create user with validation
    async createUser(data: { 
        name: string; 
        email: string | null; 
        phone: string; 
        type: string; 
        status: string; 
    }): Promise<User> {
        try {
            const userData = {
                name: data.name.trim(),
                email: data.email ? data.email.trim().toLowerCase() : null,
                phone: data.phone.trim(),
                type: data.type,
                status: data.status,
            };
            return await baseUserService.create(userData);
        } catch (error: any) {
            console.error('Error creating user:', error);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors.phone) {
                    throw new Error('رقم الهاتف هذا مستخدم بالفعل');
                }
                if (errors.email) {
                    throw new Error('هذا البريد الإلكتروني مستخدم بالفعل');
                }
            }
            throw new Error(error.response?.data?.message || 'Failed to create user');
        }
    },

    // Update user with validation
    async updateUser(id: number, data: Partial<{
        name: string;
        email: string;
        phone: string;
        type: string;
        status: string;
    }>): Promise<User> {
        try {
            const updateData: { [key: string]: any } = {};
            if (data.name) updateData.name = data.name.trim();
            if (data.email) updateData.email = data.email.trim().toLowerCase();
            if (data.phone) updateData.phone = data.phone.trim();
            if (data.type) updateData.type = data.type;
            if (data.status) updateData.status = data.status;

            if (Object.keys(updateData).length === 0) {
                return await baseUserService.getById(id);
            }

            return await baseUserService.update(id, updateData);
        } catch (error: any) {
            console.error('Error updating user:', error);
            if (error.response?.status === 404) {
                throw new Error('المستخدم غير موجود');
            }
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors.email) {
                    throw new Error('هذا البريد الإلكتروني مستخدم بالفعل');
                }
                if (errors.phone) {
                    throw new Error('رقم الهاتف هذا مستخدم بالفعل');
                }
            }
            throw new Error(error.response?.data?.message || 'Failed to update user');
        }
    },

    // Delete user
    async deleteUser(id: number): Promise<boolean> {
        try {
            await baseUserService.delete(id);
            return true;
        } catch (error: any) {
            console.error('Error deleting user:', error);
            if (error.response?.status === 404) {
                throw new Error('المستخدم غير موجود');
            }
            throw new Error(error.response?.data?.message || 'Failed to delete user');
        }
    }
};
