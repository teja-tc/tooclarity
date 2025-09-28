// // API configuration and methods for authentication

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Types for API requests and responses

export interface SignUpData {
  name: string;
  email: string;
  contactNumber: string;
  designation: string;
  linkedin: string;
  password: string;
  type?: "admin" | "institution";
}

export interface LoginData {
  email: string;
  password: string;
  type?: "admin" | "institution";
}

export interface OTPData {
  email: string;
  otp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface InstitutionData {
  instituteName: string;
  instituteType: string;
  establishmentDate?: string;
  approvedBy?: string;
  contactInfo?: string;
  additionalContactInfo?: string;
  headquartersAddress?: string;
  state?: string;
  pincode?: string;
  locationURL?: string;
}

// L2DialogBox Types
export interface CourseData {
  id: number;
  courseName: string;
  aboutCourse: string;
  courseDuration: string;
  mode: string;
  priceOfCourse: string;
  location: string;
  image?: File | null;
  brochure?: File | null;
  // Additional fields for Under Graduate/Post graduate
  graduationType?: string;
  streamType?: string;
  selectBranch?: string;
  aboutBranch?: string;
  educationType?: string;
  classSize?: string;
  // Additional fields for Coaching centers
  categoriesType?: string;
  domainType?: string;
  // Additional fields for Study Hall
  seatingOption?: string;
  openingTime?: string;
  closingTime?: string;
  operationalDays?: string[];
  totalSeats?: string;
  availableSeats?: string;
  pricePerSeat?: string;
  hasWifi?: boolean;
  hasChargingPoints?: boolean;
  hasAC?: boolean;
  hasPersonalLocker?: boolean;
  // Additional fields for Tuition Centers
  tuitionType?: string;
  instructorProfile?: string;
  subject?: string;
}

export interface BranchData {
  id: number;
  branchName: string;
  branchAddress: string;
  contactInfo: string;
  locationUrl: string;
}

// L3DialogBox Types
export interface KindergartenData {
  schoolType: string;
  curriculumType: string;
  openingTime: string;
  closingTime: string;
  operationalDays: string[];
  extendedCare: boolean;
  mealsProvided: boolean;
  outdoorPlayArea: boolean;
}

export interface SchoolData {
  schoolType: string;
  schoolCategory: string;
  curriculumType: string;
  operationalDays: string[];
  otherActivities: string;
  hostelFacility: boolean;
  playground: boolean;
  busService: boolean;
}

export interface CoachingData {
  placementDrives: boolean;
  mockInterviews: boolean;
  resumeBuilding: boolean;
  linkedinOptimization: boolean;
  exclusiveJobPortal: boolean;
  certification: boolean;
}

export interface CollegeData {
  collegeType: string;
  collegeCategory: string;
  curriculumType: string;
  operationalDays: string[];
  otherActivities: string;
  hostelFacility: boolean;
  playground: boolean;
  busService: boolean;
}

export interface UndergraduateData {
  ownershipType: string;
  collegeCategory: string;
  affiliationType: string;
  placementDrives: boolean;
  mockInterviews: boolean;
  resumeBuilding: boolean;
  linkedinOptimization: boolean;
  exclusiveJobPortal: boolean;
  library: boolean;
  hostelFacility: boolean;
  entranceExam: boolean;
  managementQuota: boolean;
  playground: boolean;
  busService: boolean;
}

export interface PaymentInitPayload {
  amount: number; // Payable amount in INR
  planType?: string; // e.g., "yearly" | "monthly"
  couponCode?: string | null;
  // institutionId: string;
}

export interface PaymentVerifyPayload {
  orderId: string;
  paymentId: string;
  signature: string;
  planType?: string;
  coupon?: string | null;
  amount?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (options.body && typeof options.body === "string") {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      credentials: "include",
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    if (typeof data.success === "undefined") {
      if (data.status === "success") {
        return {
          success: true,
          message: data.message || "Operation successful",
          data: data,
        };
      }
      return {
        success: true,
        message: data.message || "Operation successful",
        data: data,
      };
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

// Authentication API methods
export const authAPI = {
  signUp: async (userData: SignUpData): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
  login: async (loginData: LoginData): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  },
  verifyOTP: async (otpData: OTPData): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(otpData),
    });
  },
  resendOTP: async (email: string): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  googleAuth: async (token: string): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },
  logout: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/logout", {
      method: "POST",
    });
  },
  getProfile: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/profile", {
      method: "GET",
    });
  },
};

// Institution API methods
export const institutionAPI = {
  createInstitution: async (
    institutionData: InstitutionData
  ): Promise<ApiResponse> => {
    return apiRequest("/v1/institutions", {
      method: "POST",
      body: JSON.stringify(institutionData),
    });
  },
  uploadInstitutionFile: async (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest("/v1/institutions/upload", {
      method: "POST",
      body: formData,
    });
  },
};

// Utility functions for institution data management
export const getInstitutionId = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("institutionId");
  }
  return null;
};

export const getInstitutionType = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("institutionType");
  }
  return null;
};

export const clearInstitutionData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("institutionId");
    localStorage.removeItem("institutionType");
  }
};

// Filter course fields based on institution type
const filterCourseFieldsByInstitutionType = (
  course: any,
  institutionType: string | null
) => {
  const commonFields = {
    id: course.id,
    courseName: course.courseName,
    aboutCourse: course.aboutCourse,
    courseDuration: course.courseDuration,
    mode: course.mode,
    priceOfCourse: course.priceOfCourse,
    location: course.location,
    image: course.image,
    brochure: course.brochure,
  };

  switch (institutionType) {
    case "Under Graduation/Post Graduation":
      return {
        ...commonFields,
        graduationType: course.graduationType,
        streamType: course.streamType,
        selectBranch: course.selectBranch,
        aboutBranch: course.aboutBranch,
        educationType: course.educationType,
        classSize: course.classSize,
      };
    case "Coaching centers":
      return {
        ...commonFields,
        categoriesType: course.categoriesType,
        domainType: course.domainType,
      };
    case "Study Halls":
      return {
        ...commonFields,
        seatingOption: course.seatingOption,
        openingTime: course.openingTime,
        closingTime: course.closingTime,
        operationalDays: course.operationalDays,
        totalSeats: course.totalSeats,
        availableSeats: course.availableSeats,
        pricePerSeat: course.pricePerSeat,
        hasWifi: course.hasWifi,
        hasChargingPoints: course.hasChargingPoints,
        hasAC: course.hasAC,
        hasPersonalLocker: course.hasPersonalLocker,
      };
    case "Tution Center's":
      return {
        ...commonFields,
        tuitionType: course.tuitionType,
        instructorProfile: course.instructorProfile,
        subject: course.subject,
        openingTime: course.openingTime,
        closingTime: course.closingTime,
        operationalDays: course.operationalDays,
        totalSeats: course.totalSeats,
        availableSeats: course.availableSeats,
        pricePerSeat: course.pricePerSeat,
      };
    case "Kindergarten/childcare center":
    case "School":
    case "Intermediate college(K12)":
      return commonFields;
    default:
      return commonFields;
  }
};

// L2DialogBox API methods
export const courseAPI = {
  createCourse: async (
    courseData: CourseData | CourseData[],
    institutionId?: string
  ): Promise<ApiResponse> => {
    const finalInstitutionId = institutionId || getInstitutionId();
    if (!finalInstitutionId) {
      return {
        success: false,
        message:
          "Institution ID not found. Please complete L1 (Institution Details) first.",
      };
    }
    const coursesArray = Array.isArray(courseData) ? courseData : [courseData];
    const institutionType = getInstitutionType();
    const filteredCourses = coursesArray.map((course) =>
      filterCourseFieldsByInstitutionType(course, institutionType)
    );
    const requestData = {
      courses: filteredCourses,
      totalCourses: filteredCourses.length,
      ...(institutionType && { institutionType }),
    };
    return apiRequest(`/v1/institutions/${finalInstitutionId}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });
  },
  createCourses: async (
    coursesData: CourseData[],
    institutionId?: string
  ): Promise<ApiResponse> => {
    return courseAPI.createCourse(coursesData, institutionId);
  },
  updateCourse: async (
    courseId: number,
    courseData: Partial<CourseData>
  ): Promise<ApiResponse> => {
    const formData = new FormData();
    Object.entries(courseData).forEach(([key, value]) => {
      if (key === "image" || key === "brochure") {
        if (value instanceof File) formData.append(key, value);
      } else if (key === "operationalDays" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    return apiRequest(`/v1/courses/${courseId}`, {
      method: "PUT",
      body: formData,
    });
  },
  getCourses: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/courses", { method: "GET" });
  },
  deleteCourse: async (courseId: number): Promise<ApiResponse> => {
    return apiRequest(`/v1/courses/${courseId}`, { method: "DELETE" });
  },
};

export const branchAPI = {
  createBranch: async (
    branchData: BranchData | BranchData[],
    institutionId?: string
  ): Promise<ApiResponse> => {
    const finalInstitutionId = institutionId || getInstitutionId();
    if (!finalInstitutionId) {
      return {
        success: false,
        message:
          "Institution ID not found. Please complete L1 (Institution Details) first.",
      };
    }
    const branchesArray = Array.isArray(branchData) ? branchData : [branchData];
    const requestData = {
      branches: branchesArray,
      totalBranches: branchesArray.length,
    };
    return apiRequest(`/v1/institutions/${finalInstitutionId}/branches`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },
  createBranches: async (
    branchesData: BranchData[],
    institutionId?: string
  ): Promise<ApiResponse> => {
    return branchAPI.createBranch(branchesData, institutionId);
  },
  updateBranch: async (
    branchId: number,
    branchData: Partial<BranchData>
  ): Promise<ApiResponse> => {
    return apiRequest(`/v1/branches/${branchId}`, {
      method: "PUT",
      body: JSON.stringify(branchData),
    });
  },
  getBranches: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/branches", { method: "GET" });
  },
  deleteBranch: async (branchId: number): Promise<ApiResponse> => {
    return apiRequest(`/v1/branches/${branchId}`, { method: "DELETE" });
  },
};

// Union type for all institution detail data types
export type InstitutionDetailsData =
  | KindergartenData
  | SchoolData
  | CoachingData
  | CollegeData
  | UndergraduateData;

// L3DialogBox API methods
export const institutionDetailsAPI = {
  createInstitutionDetails: async (
    detailsData: InstitutionDetailsData
  ): Promise<ApiResponse> => {
    // Get institution type to include in the request
    // const institutionType = getInstitutionType();


    const requestData = {
      ...detailsData,
      // institutionType,
    };

    return apiRequest(`/v1/institutions/details`, {
      method: "PUT",
      body: JSON.stringify(requestData),
    });
  },
  getInstitutionDetails: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/institution-details", { method: "GET" });
  },
};

// Dashboard data helpers
export const getMyInstitution = async (): Promise<any> => {
  const res = await apiRequest<any>("/v1/institutions/me", { method: "GET" });
  const payload: any = res as any;
  return payload?.data || payload;
};

// Analytics API helpers
export type TimeRangeParam = "weekly" | "monthly" | "yearly";

export const analyticsAPI = {
  getSummary: async (range: TimeRangeParam = "weekly"): Promise<ApiResponse> => {
    return apiRequest(`/v1/analytics/summary?range=${range}`, { method: "GET" });
  },
  getCoursePerformance: async (range: TimeRangeParam = "weekly"): Promise<ApiResponse> => {
    return apiRequest(`/v1/analytics/course-performance?range=${range}`, { method: "GET" });
  },
  getLeadTypes: async (range: TimeRangeParam = "weekly"): Promise<ApiResponse> => {
    return apiRequest(`/v1/analytics/lead-types?range=${range}`, { method: "GET" });
  },
  getSummaryPrevious: async (range: TimeRangeParam = "weekly"): Promise<ApiResponse> => {
    return apiRequest(`/v1/analytics/summary?range=${range}&compare=prev`, { method: "GET" });
  },
};

// Unified metrics (views or comparisons)
export const metricsAPI = {
  increment: async (institutionId: string, courseId: string, metric: 'views'|'comparisons'): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/${institutionId}/courses/${courseId}/metrics?metric=${metric}`, { method: "POST" });
  },
  // Accept optional institutionId; if missing, resolve via getMyInstitution()
  getInstitutionAdminSummary: async (metric: 'views'|'comparisons', institutionId?: string): Promise<ApiResponse> => {
    let iid = institutionId;
    if (!iid) {
      try { const inst = await getMyInstitution() as any; iid = inst?._id || inst?.data?._id; } catch (err) { console.error('metricsAPI.getInstitutionAdminSummary: resolve institution failed', err); }
    }
    if (!iid) throw new Error('institutionId not available');
    return apiRequest(`/v1/institutions/${iid}/courses/summary/metrics/institution-admin?metric=${metric}`, { method: "GET" });
  },
  getInstitutionAdminByRange: async (
    metric: 'views'|'comparisons'|'leads' | string,
    range: 'weekly'|'monthly'|'yearly',
    institutionId?: string
  ): Promise<ApiResponse> => {
    let iid = institutionId as string | undefined;
    if (!iid) {
      try { const inst = await getMyInstitution() as any; iid = inst?._id || inst?.data?._id; } catch (err) { console.error('metricsAPI.getInstitutionAdminByRange: resolve institution failed', err); }
    }
    if (!iid) throw new Error('institutionId not available');
    return apiRequest(`/v1/institutions/${iid}/courses/summary/metrics/institution-admin/range?metric=${metric}&range=${range}`, { method: "GET" });
  },
  getInstitutionAdminSeries: async (
    metric: 'views'|'comparisons'|'leads',
    year?: number,
    institutionId?: string
  ): Promise<ApiResponse> => {
    const q = [`metric=${metric}`];
    if (year) q.push(`year=${year}`);
    let iid = institutionId;
    if (!iid) {
      try { const inst = await getMyInstitution() as any; iid = inst?._id || inst?.data?._id; } catch (err) { console.error('metricsAPI.getInstitutionAdminSeries: resolve institution failed', err); }
    }
    if (!iid) throw new Error('institutionId not available');
    return apiRequest(`/v1/institutions/${iid}/courses/summary/metrics/institution-admin/series?${q.join('&')}`, { method: "GET" });
  }
};

// Enquiries API helpers
export const enquiriesAPI = {
  getLeadsSummary: async (): Promise<ApiResponse> => {
    return apiRequest(`/v1/enquiries/summary/leads`, { method: "GET" });
  },
  getEnquiriesForChart: async (year?: number): Promise<ApiResponse> => {
    const yearParam = year ? `?year=${year}` : "";
    return apiRequest(`/v1/enquiries/chart${yearParam}`, { method: "GET" });
  },
  getRecentEnquiries: async (): Promise<ApiResponse> => {
    return apiRequest(`/v1/enquiries/recent`, { method: "GET" });
  },
  getRecentEnquiriesWithOffset: async (offset: number, limit: number): Promise<ApiResponse> => {
    const q = [`offset=${Math.max(0, offset)}`, `limit=${Math.max(1, Math.min(100, limit))}`].join('&');
    return apiRequest(`/v1/enquiries/recent?${q}`, { method: "GET" });
  },
  getTypeSummary: async (range: 'weekly'|'monthly'|'yearly'): Promise<ApiResponse> => {
    return apiRequest(`/v1/enquiries/summary/types?range=${range}`, { method: "GET" });
  },
  getTypeSummaryRollups: async (range: 'weekly'|'monthly'|'yearly', type?: 'callback'|'demo'): Promise<ApiResponse> => {
    const q = [`range=${range}`];
    if (type) q.push(`type=${type}`);
    return apiRequest(`/v1/enquiries/summary/types/range?${q.join('&')}`, { method: "GET" });
  },
  createEnquiry: async (enquiryData: {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    institution: string;
    programInterest: string;
    enquiryType: string;
  }): Promise<ApiResponse> => {
    return apiRequest(`/v1/enquiries`, {
      method: "POST",
      body: JSON.stringify(enquiryData),
    });
  },
};

// Notifications API helpers
export const notificationsAPI = {
  list: async (params: {
    scope?: 'student'|'institution'|'branch'|'admin';
    studentId?: string;
    institutionId?: string;
    branchId?: string;
    institutionAdminId?: string;
    page?: number;
    limit?: number;
    unread?: boolean;
    category?: string;
  } = {}): Promise<ApiResponse> => {
    const q: string[] = [];
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) q.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    });
    const qs = q.length ? `?${q.join('&')}` : '';
    return apiRequest(`/v1/notifications${qs}`, { method: 'GET' });
  },
  create: async (payload: {
    title: string;
    description?: string;
    category?: string;
    recipientType: 'STUDENT'|'INSTITUTION'|'BRANCH'|'ADMIN'|'SYSTEM';
    student?: string;
    institution?: string;
    branch?: string;
    institutionAdmin?: string;
    metadata?: any;
  }): Promise<ApiResponse> => {
    return apiRequest(`/v1/notifications`, { method: 'POST', body: JSON.stringify(payload) });
  },
  markRead: async (ids: string[]): Promise<ApiResponse> => {
    return apiRequest(`/v1/notifications/read`, { method: 'POST', body: JSON.stringify({ ids }) });
  },
  markUnread: async (ids: string[]): Promise<ApiResponse> => {
    return apiRequest(`/v1/notifications/unread`, { method: 'POST', body: JSON.stringify({ ids }) });
  },
  remove: async (ids: string[]): Promise<ApiResponse> => {
    return apiRequest(`/v1/notifications`, { method: 'DELETE', body: JSON.stringify({ ids }) });
  },
};

export const getInstitutionBranches = async (
  institutionId: string
): Promise<any[]> => {
  const res = await apiRequest<any>(
    `/v1/institutions/${institutionId}/branches`,
    { method: "GET" }
  );
  const payload = res as any;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export const getInstitutionCourses = async (
  institutionId: string
): Promise<any[]> => {
  const res = await apiRequest<any>(
    `/v1/institutions/${institutionId}/courses`,
    { method: "GET" }
  );
  const payload = res as any;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export const paymentAPI = {
  /**
   * Initiate a payment on the backend
   * - Sends the payable amount and optional context to create an order/session
   */
  initiatePayment: async (
    payload: PaymentInitPayload
  ): Promise<ApiResponse> => {
    return apiRequest("/v1/payment/create-order", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Apply coupon to get discount amount from backend
   */
  applyCoupon: async (code: string): Promise<ApiResponse<{ discountAmount: number }>> => {
    return apiRequest("/v1/coupon/apply-coupon", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  /**
   * Verify Razorpay payment on backend with polling until status is final
   * - Polls the backend until message is "active" or "expired"
   * - Treats intermediate "pending" as continue polling
   */
  verifyPayment: async (
    payload: PaymentVerifyPayload,
    options?: { intervalMs?: number; timeoutMs?: number }
  ): Promise<ApiResponse> => {
    const intervalMs = options?.intervalMs ?? 2000; // 2s poll interval
    const timeoutMs = options?.timeoutMs ?? 120000; // 2 min timeout
    const start = Date.now();
    let lastRes: ApiResponse | null = null;

    while (Date.now() - start < timeoutMs) {
      // Build query string for GET verification (preserves original method)
      const qs = new URLSearchParams({
        orderId: payload.orderId,
        paymentId: payload.paymentId,
        signature: payload.signature,
        ...(payload.planType ? { planType: payload.planType } : {}),
        ...(payload.coupon ? { coupon: String(payload.coupon) } : {}),
        ...(typeof payload.amount !== "undefined" ? { amount: String(payload.amount) } : {}),
      }).toString();
      const endpoint = `/v1/payment/verify-payment?${qs}`;

      lastRes = await apiRequest(endpoint, {
        method: "GET",
      });

      const statusMsg = (lastRes.message || "").toLowerCase();

      // Break on final states
      if (statusMsg === "active" || statusMsg === "expired") {
        return lastRes;
      }

      // Continue polling on pending/unknown states
      await new Promise((r) => setTimeout(r, intervalMs));
    }

    // Timed out waiting for final status
    return {
      success: false,
      message: "verification_timeout",
      data: lastRes?.data,
    };
  },

  /**
   * Build receipt URL for opening/downloading receipt
   */
  getReceiptUrl: (q: { transactionId?: string | null; paymentId?: string | null; orderId?: string | null }): string => {
    const params = new URLSearchParams({
      ...(q.paymentId ? { paymentId: q.paymentId } : {}),
      ...(q.orderId ? { orderId: q.orderId } : {}),
      ...(q.transactionId ? { transactionId: q.transactionId } : {}),
    }).toString();
    return `${API_BASE_URL}/v1/payment/receipt?${params}`;
  },

  /**
   * Optional helper to programmatically download receipt as file
   */
  downloadReceiptFile: async (
    q: { transactionId?: string | null; paymentId?: string | null; orderId?: string | null },
    filename = "receipt.pdf"
  ): Promise<ApiResponse> => {
    try {
      const url = paymentAPI.getReceiptUrl(q);
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        return { success: false, message: `Failed to download receipt (${res.status})` };
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      return { success: true, message: "Receipt downloaded" };
    } catch (e) {
      return { success: false, message: e instanceof Error ? e.message : "Download failed" };
    }
  },
};