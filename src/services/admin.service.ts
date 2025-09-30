import { createBaseService } from '@/lib/services/base.service';
import type { User, UserInvestment } from '@/types';
import type { ApiResponse } from '@/types/api';

export interface AdminDashboardStats {
  totalInvestments: number;
  totalInvestmentAmount: number;
  activeUsers: number;
  availableOpportunities: number;
  currentActivity: number;
  recentInvestments: UserInvestment[];
  recentUsers: User[];
}

export interface GrowthStats {
  monthlyInvestmentGrowth: number;
  monthlyUserGrowth: number;
  weeklyOpportunityGrowth: number;
  hourlyActivityGrowth: number;
}

const baseAdminService = createBaseService('');

export const adminService = {
    ...baseAdminService,

    // Get admin dashboard statistics
    async getDashboardStats(): Promise<AdminDashboardStats> {
        try {
            const response = await baseAdminService.customGet('/v1/test/admin/stats');
            // Return mock data for development
            return {
                totalInvestments: 150,
                totalInvestmentAmount: 2500000,
                activeUsers: 45,
                availableOpportunities: 12,
                currentActivity: 8,
                recentInvestments: [],
                recentUsers: [],
            };
        } catch (error: any) {
            console.error("Error fetching admin dashboard stats:", error);
            // Return mock data for development
            return {
                totalInvestments: 150,
                totalInvestmentAmount: 2500000,
                activeUsers: 45,
                availableOpportunities: 12,
                currentActivity: 8,
                recentInvestments: [],
                recentUsers: [],
            };
        }
    },

    // Get growth statistics
    async getGrowthStats(): Promise<GrowthStats> {
        try {
            const response = await baseAdminService.customGet('/v1/test/admin/stats/growth');
            // Return mock data for development
            return {
                monthlyInvestmentGrowth: 15.5,
                monthlyUserGrowth: 8.2,
                weeklyOpportunityGrowth: 3.1,
                hourlyActivityGrowth: 1.8,
            };
        } catch (error: any) {
            console.error("Error fetching growth stats:", error);
            // Return mock data for development
            return {
                monthlyInvestmentGrowth: 15.5,
                monthlyUserGrowth: 8.2,
                weeklyOpportunityGrowth: 3.1,
                hourlyActivityGrowth: 1.8,
            };
        }
    },

    // Get system overview
    async getSystemOverview() {
        return baseAdminService.customGet('/admin/system/overview');
    },

    // Get user analytics
    async getUserAnalytics() {
        return baseAdminService.customGet('/admin/analytics/users');
    },

    // Get investment analytics
    async getInvestmentAnalytics() {
        return baseAdminService.customGet('/admin/analytics/investments');
    }
};