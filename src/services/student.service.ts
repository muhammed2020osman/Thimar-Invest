import { createBaseService } from '@/lib/services/base.service';
import type { Student, StudentStatistics, CreateStudentDto } from '@/types/student';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

interface StudentParams {
    page?: number;
    per_page?: number;
    search?: string;
    grade?: string;
    status?: string;
}

const baseStudentService = createBaseService<Student>('school/students');

export const studentService = {
    ...baseStudentService,

    // Get all students with pagination and filters
    async getAllStudents(params: StudentParams = {}): Promise<PaginatedResponse<Student>> {
        return baseStudentService.getAll(params);
    },

    // Get student statistics
    async getStatistics() {
        return baseStudentService.customGet('/school/students/report/statistics');
    },

    // Toggle student status
    async toggleStatus(id: number) {
        return baseStudentService.customPost(`/${id}/toggle-status`);
    }
}; 