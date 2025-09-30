// Student-specific API configuration placeholder

import { API_BASE_URL, apiRequest, type ApiResponse } from "./api";

export type StudentApiResponse<T = unknown> = ApiResponse<T>;

// This helper mirrors the admin API setup but leaves implementation stubs for now
async function studentApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<StudentApiResponse<T>> {
  // Delegate to shared request helper to keep behavior consistent
  return apiRequest<T>(endpoint, options);
}

// ===== Student Authentication Types =====
export interface StudentLoginData {
  email: string;
  password: string;
}

// ===== Student Dashboard Types =====
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface StudentCourse {
  id: string;
  title: string;
  progress: number; // 0-100
  enrolledAt: string;
  completedAt?: string | null;
}

export interface StudentListParams {
  search?: string;
  page?: number;
  limit?: number;
}

// ===== Student Dashboard API (stubs) =====
export const studentDashboardAPI = {
  // Fetch the current student's profile
  getProfile: async (): Promise<StudentApiResponse<StudentProfile>> => {
    return studentApiRequest("/v1/student/profile", {
      method: "GET",
    });
  },

  // Fetch courses the student is enrolled in
  listCourses: async (
    params: StudentListParams = {}
  ): Promise<StudentApiResponse<{ items: StudentCourse[]; total: number }>> => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();

    return studentApiRequest(`/v1/student/courses${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  // Update student profile details
  updateProfile: async (
    payload: Partial<StudentProfile>
  ): Promise<StudentApiResponse<StudentProfile>> => {
    return studentApiRequest("/v1/student/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};

// ===== Student Authentication API =====
export const studentAuthAPI = {
  // Student login
  login: async (loginData: StudentLoginData): Promise<StudentApiResponse> => {
    return studentApiRequest("/v1/student/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  },
};