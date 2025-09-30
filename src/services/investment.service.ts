
import { createBaseService } from '@/lib/services/base.service';
import type { UserInvestment, Transaction } from '@/types';

interface InvestmentParams {
    page?: number;
    per_page?: number;
    status?: string;
    opportunity_id?: number;
    user_id?: number;
}

interface TransactionParams {
    page?: number;
    per_page?: number;
    type?: string;
    status?: string;
    user_id?: number;
}

const baseInvestmentService = createBaseService('investment/user-investments');
const baseTransactionService = createBaseService('investment/transactions');

export const investmentService = {
    ...baseInvestmentService,

    // Get all user investments with pagination and filters
    async getUserInvestments(params: InvestmentParams = {}) {
        try {
            const response = await baseInvestmentService.getAll(params);
            console.log('getUserInvestments response:', response);
            
            // Handle different response structures
            if (response.payload && response.payload.data && Array.isArray(response.payload.data)) {
                return response.payload.data;
            }
            if (response.data && Array.isArray(response.data)) {
                return response.data;
            }
            if (Array.isArray(response)) {
                return response;
            }
            
            console.warn('Unexpected user investments response structure:', response);
            return [];
        } catch (error: any) {
            console.error('Error fetching user investments:', error);
            throw new Error('Failed to fetch user investments');
        }
    },

    // Create new investment
    async createInvestment(data: {
        opportunity_id: number;
        amount: number;
        status?: string;
    }): Promise<UserInvestment> {
        try {
            return await baseInvestmentService.create({
                opportunity_id: data.opportunity_id,
                amount: data.amount,
                status: data.status || 'pending',
            });
        } catch (error: any) {
            console.error('Error creating investment:', error);
            if (error.response?.status === 404) {
                throw new Error('فرصة الاستثمار غير موجودة');
            }
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors.opportunity_id) {
                    throw new Error('فرصة الاستثمار غير موجودة');
                }
            }
            throw new Error(error.response?.data?.message || 'Failed to create investment');
        }
    },

    // Update investment status
    async updateInvestmentStatus(id: number, status: string): Promise<UserInvestment> {
        return baseInvestmentService.update(id, { status });
    },

    // Get investment statistics
    async getStatistics() {
        return baseInvestmentService.customGet('/investment/user-investments-statistics');
    },

    // Get user investment statistics (portfolio stats)
    async getUserInvestmentStatistics(userId?: number) {
        try {
            const url = userId 
                ? `/investment/user-investments-statistics?user_id=${userId}`
                : '/investment/user-investments-statistics';
            const response = await baseInvestmentService.customGet(url);
            
            // Handle different response structures
            if (response.payload) {
                return response.payload;
            }
            if (response.data) {
                return response.data;
            }
            
            return response;
        } catch (error: any) {
            console.error('Error fetching user investment statistics:', error);
            throw new Error('Failed to fetch user investment statistics');
        }
    }
};

export const transactionService = {
    ...baseTransactionService,

    // Get all transactions with pagination and filters
    async getTransactions(params: TransactionParams = {}) {
        try {
            const response = await baseTransactionService.getAll(params);
            console.log('Transaction service response:', response);
            
            // Handle different response structures
            if (response.payload && response.payload.data && Array.isArray(response.payload.data)) {
                return response.payload.data;
            }
            if (response.data && Array.isArray(response.data)) {
                return response.data;
            }
            if (Array.isArray(response)) {
                return response;
            }
            
            console.warn('Unexpected transaction response structure:', response);
            return [];
        } catch (error: any) {
            console.error('Error fetching transactions:', error);
            throw new Error('Failed to fetch transactions');
        }
    },

    // Create new transaction
    async createTransaction(data: {
        type: string;
        amount: number;
        status?: string;
    }): Promise<Transaction> {
        try {
            // Translate Arabic values to English for backend
            const typeTranslation: { [key: string]: string } = {
                'إيداع': 'deposit',
                'سحب': 'withdrawal', 
                'استثمار': 'investment',
                'أرباح': 'refund'
            };

            const statusTranslation: { [key: string]: string } = {
                'مكتمل': 'completed',
                'قيد المعالجة': 'pending',
                'فشل': 'failed',
                'ملغي': 'cancelled'
            };

            return await baseTransactionService.create({
                type: typeTranslation[data.type] || data.type,
                amount: data.amount,
                status: statusTranslation[data.status || 'مكتمل'] || data.status || 'completed',
                date: new Date().toISOString(),
            });
        } catch (error: any) {
            console.error('Error creating transaction:', error);
            throw new Error(error.response?.data?.message || 'Failed to create transaction');
        }
    },

    // Get transaction statistics
    async getStatistics() {
        return baseTransactionService.customGet('/investment/transactions/statistics');
    }
};
