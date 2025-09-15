// API configuration and methods for authentication

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Types for API requests and responses
export interface SignUpData {
  name: string;
  email: string;
  contactNumber: string;
  designation: string;
  linkedin: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  otp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
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

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Automatically set Content-Type for requests with JSON body
    // Don't set Content-Type for FormData - browser will set it automatically with boundary
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

    // Ensure the response always has a success field
    // Handle different response formats from backend
    if (typeof data.success === "undefined") {
      // Check if backend uses 'status' field instead of 'success'
      if (data.status === "success") {
        return {
          success: true,
          message: data.message || "Operation successful",
          data: data,
        };
      }

      // If no success or status field but response is ok, assume success
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
  // Sign up user
  signUp: async (userData: SignUpData): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (loginData: LoginData): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  },

  // Verify OTP
  verifyOTP: async (otpData: OTPData): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(otpData),
    });
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Google OAuth
  googleAuth: async (token: string): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/auth/logout", {
      method: "POST",
    });
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/profile", {
      method: "GET",
    });
  },
};

// Institution API methods
export const institutionAPI = {
  // Create institution
  createInstitution: async (
    institutionData: InstitutionData
  ): Promise<ApiResponse> => {
    return apiRequest("/v1/institutions", {
      method: "POST",
      body: JSON.stringify(institutionData),
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
  // Common fields for all institution types
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

  // Add institution-specific fields
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
      // These institution types only need common fields (basic course form)
      return commonFields;

    default:
      // If institution type is not recognized, send only common fields
      return commonFields;
  }
};

// L2DialogBox API methods
export const courseAPI = {
  /**
   * Create courses - accepts single course or array of courses
   * @param courseData - Single CourseData object or array of CourseData objects
   * @param institutionId - Optional institution ID (will use localStorage if not provided)
   * @returns Promise<ApiResponse>
   */

  createCourse: async (
    courseData: CourseData | CourseData[],
    institutionId?: string
  ): Promise<ApiResponse> => {
    // Use provided institutionId or get from localStorage
    const finalInstitutionId = institutionId || getInstitutionId();

    if (!finalInstitutionId) {
      return {
        success: false,
        message:
          "Institution ID not found. Please complete L1 (Institution Details) first.",
      };
    }

    // Convert single course to array for consistent processing
    const coursesArray = Array.isArray(courseData) ? courseData : [courseData];

    // Get institution type to filter relevant fields
    const institutionType = getInstitutionType();

    // Filter fields (remove invalid ones based on institution type)
    const filteredCourses = coursesArray.map((course) =>
      filterCourseFieldsByInstitutionType(course, institutionType)
    );

    // Create request payload
    const requestData = {
      courses: filteredCourses,
      totalCourses: filteredCourses.length,
      ...(institutionType && { institutionType }),
    };

    return apiRequest(`/v1/institutions/${finalInstitutionId}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
  },

  /**
   * Create multiple courses (explicit function for better clarity)
   * @param coursesData - Array of CourseData objects
   * @param institutionId - Optional institution ID (will use localStorage if not provided)
   * @returns Promise<ApiResponse>
   */
  createCourses: async (
    coursesData: CourseData[],
    institutionId?: string
  ): Promise<ApiResponse> => {
    return courseAPI.createCourse(coursesData, institutionId);
  },

  // Update course
  updateCourse: async (
    courseId: number,
    courseData: Partial<CourseData>
  ): Promise<ApiResponse> => {  
    const formData = new FormData();

    Object.entries(courseData).forEach(([key, value]) => {
      if (key === "image" || key === "brochure") {
        if (value instanceof File) {
          formData.append(key, value);
        }
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

  // Get courses
  getCourses: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/courses", {
      method: "GET",
    });
  },

  // Delete course
  deleteCourse: async (courseId: number): Promise<ApiResponse> => {
    return apiRequest(`/v1/courses/${courseId}`, {
      method: "DELETE",
    });
  },
};

export const branchAPI = {
  /**
   * Create branches - accepts single branch or array of branches
   * @param branchData - Single BranchData object or array of BranchData objects
   * @param institutionId - Optional institution ID (will use localStorage if not provided)
   * @returns Promise<ApiResponse>
   */
  createBranch: async (
    branchData: BranchData | BranchData[],
    institutionId?: string
  ): Promise<ApiResponse> => {
    // Use provided institutionId or get from localStorage
    const finalInstitutionId = institutionId || getInstitutionId();

    if (!finalInstitutionId) {
      return {
        success: false,
        message:
          "Institution ID not found. Please complete L1 (Institution Details) first.",
      };
    }

    // Convert single branch to array for consistent processing
    const branchesArray = Array.isArray(branchData) ? branchData : [branchData];

    // Create request payload
    const requestData = {
      branches: branchesArray,
      totalBranches: branchesArray.length,
    };

    return apiRequest(`/v1/institutions/${finalInstitutionId}/branches`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },

  /**
   * Create multiple branches (explicit function for better clarity)
   * @param branchesData - Array of BranchData objects
   * @param institutionId - Optional institution ID (will use localStorage if not provided)
   * @returns Promise<ApiResponse>
   */
  createBranches: async (
    branchesData: BranchData[],
    institutionId?: string
  ): Promise<ApiResponse> => {
    return branchAPI.createBranch(branchesData, institutionId);
  },

  // Update branch
  updateBranch: async (
    branchId: number,
    branchData: Partial<BranchData>
  ): Promise<ApiResponse> => {
    return apiRequest(`/v1/branches/${branchId}`, {
      method: "PUT",
      body: JSON.stringify(branchData),
    });
  },

  // Get branches
  getBranches: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/branches", {
      method: "GET",
    });
  },

  // Delete branch
  deleteBranch: async (branchId: number): Promise<ApiResponse> => {
    return apiRequest(`/v1/branches/${branchId}`, {
      method: "DELETE",
    });
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
  // Create institution details (unified endpoint)
  createInstitutionDetails: async (
    detailsData: InstitutionDetailsData
  ): Promise<ApiResponse> => {
    // // Get institution type to include in the request
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

  // Get institution details
  getInstitutionDetails: async (): Promise<ApiResponse> => {
    return apiRequest("/v1/institution-details", {
      method: "GET",
    });
  },
};

// Dashboard data helpers (non-destructive additions)
export const getMyInstitution = async (): Promise<any> => {
  const res = await apiRequest<any>("/v1/institutions/me", { method: "GET" });
  return (res as any).data;
};

export const getInstitutionBranches = async (
  institutionId: string
): Promise<any[]> => {
  const res = await apiRequest<any>(
    `/v1/institutions/${institutionId}/branches`,
    { method: "GET" }
  );
  const payload = (res as any);
  // Support both {success, data} and raw array responses
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
  const payload = (res as any);
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
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
  }
};

// Course views helpers (real-time and initial summary)
export const courseViewsAPI = {
  incrementView: async (institutionId: string, courseId: string): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/${institutionId}/courses/${courseId}/views`, { method: "POST" });
  },
  getInstitutionViewsSummary: async (institutionId: string): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/${institutionId}/courses/summary/views`, { method: "GET" });
  },
  getOwnerViewsSummary: async (): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/summary/views/owner`, { method: "GET" });
  },
  getOwnerViewsByRange: async (range: 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/summary/views/owner/range?range=${range}`, { method: "GET" });
  }
};

// Comparisons helpers
export const comparisonsAPI = {
  increment: async (institutionId: string, courseId: string): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/${institutionId}/courses/${courseId}/comparisons`, { method: "POST" });
  },
  getOwnerSummary: async (): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/summary/comparisons/owner`, { method: "GET" });
  },
  getOwnerByRange: async (range: 'weekly' | 'monthly' | 'yearly'): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/summary/comparisons/owner/range?range=${range}`, { method: "GET" });
  }
};

// Unified metrics (views or comparisons)
export const metricsAPI = {
  increment: async (institutionId: string, courseId: string, metric: 'views'|'comparisons'): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/${institutionId}/courses/${courseId}/metrics?metric=${metric}`, { method: "POST" });
  },
  getOwnerSummary: async (metric: 'views'|'comparisons'): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/summary/metrics/owner?metric=${metric}`, { method: "GET" });
  },
  getOwnerByRange: async (metric: 'views'|'comparisons'|'leads', range: 'weekly'|'monthly'|'yearly'): Promise<ApiResponse> => {
    return apiRequest(`/v1/institutions/summary/metrics/owner/range?metric=${metric}&range=${range}`, { method: "GET" });
  },
  getOwnerSeries: async (metric: 'views'|'comparisons'|'leads', year?: number): Promise<ApiResponse> => {
    const q = [`metric=${metric}`];
    if (year) q.push(`year=${year}`);
    return apiRequest(`/v1/institutions/summary/metrics/owner/series?${q.join('&')}`, { method: "GET" });
  }
};


// Enquiries API helpers (leads generated and recent enquiries)
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
  getTypeSummary: async (range: 'weekly'|'monthly'|'yearly'): Promise<ApiResponse> => {
    return apiRequest(`/v1/enquiries/summary/types?range=${range}`, { method: "GET" });
  },
  getTypeSummaryRollups: async (range: 'weekly'|'monthly'|'yearly', type?: 'callback'|'demo'): Promise<ApiResponse> => {
    const q = [`range=${range}`];
    if (type) q.push(`type=${type}`);
    return apiRequest(`/v1/institutions/summary/enquiries/owner/range?${q.join('&')}`, { method: "GET" });
  },
  createEnquiry: async (enquiryData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    institution: string;
    programInterest: string;
    enquiryType: string;
  }): Promise<ApiResponse> => {
    return apiRequest(`/v1/enquiries`, { 
      method: "POST",
      body: JSON.stringify(enquiryData)
    });
  }
};

// Notifications API helpers
export const notificationsAPI = {
  list: async (params: {
    scope?: 'customer'|'institution'|'branch'|'admin';
    customerId?: string;
    institutionId?: string;
    branchId?: string;
    ownerId?: string;
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
    recipientType: 'CUSTOMER'|'INSTITUTION'|'BRANCH'|'ADMIN'|'SYSTEM';
    customer?: string;
    institution?: string;
    branch?: string;
    owner?: string;
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
  }
};
