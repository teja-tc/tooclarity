"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Eye, EyeOff, Upload, KeyRound, CheckCircle } from "lucide-react";
import { authAPI } from "@/lib/api";
import { dashboardAPI, } from "@/lib/dashboard_api";
import { toast } from 'react-toastify';
import axios from 'axios';
import { getFullDashboardData, saveFullDashboardData } from "@/lib/dashboardDB";

// Form Component Imports
import KindergartenCourseForm from "@/components/dashboard/DashboardEditProgramParts/KindergartenCourseForm";
import SchoolCourseForm from "@/components/dashboard/DashboardEditProgramParts/SchoolCourseForm";
import IntermediateCollegeCourseForm from "@/components/dashboard/DashboardEditProgramParts/IntermediateCollegeCourseForm";
import CoachingCourseForm from "@/components/dashboard/DashboardEditProgramParts/CoachingCourseForm";
import UnderPostGraduateCourseForm from "@/components/dashboard/DashboardEditProgramParts/UnderPostGraduateCourseForm";
import StudyHallCourseForm from "@/components/dashboard/DashboardEditProgramParts/StudyHallCourseForm";
import TuitionCenterCourseForm from "@/components/dashboard/DashboardEditProgramParts/TuitionCenterCourseForm";


// Validation Schema Imports
import {
    combinedKindergartenCourseSchema,
    operationalDaysOptions,
    combinedIntermediateCollegeSchema,
    combinedSchoolCourseSchema,
    combinedCoachingCenterSchema,
    combinedUgPgSchema,
    combinedStudyHallSchema,
    combinedTutionCenterSchema
} from "@/lib/validations/DashboardSchema";

// --- INTERFACES ---

interface AdminFormData {
    currentEmail: string;
    newPassword: string;
    confirmPassword: string;
}

interface CourseUpdateData {
    _id?: string;
    courseId?: string;
    [key: string]: any;
}

export interface CourseData {
    _id?: string;
    courseName?: string;
    aboutCourse?: string;
    courseDuration?: string;
    mode?: string;
    priceOfCourse?: number | string;
    location?: string;
    classSize?: number | string;
    eligibilityCriteria?: string;
    graduationType?: string;
    streamType?: string;
    selectBranch?: string;
    aboutBranch?: string;
    educationType?: string;
    ownershipType?: string;
    collegeCategory?: string;
    affiliationType?: string;
    categoriesType?: string;
    domainType?: string;
    schoolType?: string;
    schoolCategory?: string;
    collegeType?: string;
    curriculumType?: string;
    otherActivities?: string;
    openingTime?: string;
    closingTime?: string;
    operationalDays?: string[];
    hallName?: string;
    seatingOption?: string;
    totalSeats?: number | string;
    availableSeats?: number | string;
    pricePerSeat?: number | string;
    hasWifi?: boolean | string;
    hasChargingPoints?: boolean | string;
    hasAC?: boolean | string;
    hasPersonalLocker?: boolean | string;
    tuitionType?: string;
    instructorProfile?: string;
    subject?: string;
    library?: boolean | string;
    hostelFacility?: boolean | string;
    playground?: boolean | string;
    busService?: boolean | string;
    entranceExam?: boolean | string;
    managementQuota?: boolean | string;
    extendedCare?: boolean | string;
    mealsProvided?: boolean | string;
    outdoorPlayArea?: boolean | string;
    placementDrives?: boolean | string;
    mockInterviews?: boolean | string;
    resumeBuilding?: boolean | string;
    linkedinOptimization?: boolean | string;
    exclusiveJobPortal?: boolean | string;
    certification?: boolean | string;
    [key: string]: any;
}

export interface CourseFormData {
    _id?: string;
    courseName?: string;
    aboutCourse?: string;
    courseDuration?: string;
    mode?: "Offline" | "Online" | "Hybrid" | "";
    priceOfCourse?: number | string;
    location?: string;
    classSize?: number | string;
    eligibilityCriteria?: string;
    operationalDays?: string[];
    openingTime?: string;
    closingTime?: string;
    graduationType?: string;
    streamType?: string;
    selectBranch?: string;
    aboutBranch?: string;
    educationType?: string;
    ownershipType?: string;
    collegeCategory?: string;
    affiliationType?: string;
    categoriesType?: string;
    domainType?: string;
    schoolType?: string;
    schoolCategory?: string;
    collegeType?: string;
    curriculumType?: string;
    otherActivities?: string;
    hallName?: string;
    seatingOption?: "" | "Individual Desk" | "Shared Table" | "Private Cabin" | "Open Seating";
    totalSeats?: number | string;
    availableSeats?: number | string;
    pricePerSeat?: number | string;

    // ✅ FIX FOR STUDY HALL ERROR
    hasWifi?: "Yes" | "No";
    hasChargingPoints?: "Yes" | "No";
    hasAC?: "Yes" | "No";
    hasPersonalLocker?: "Yes" | "No";

    // ✅ FIX FOR TUITION CENTER ERROR
    tuitionType?: "" | "Home Tuition" | "Center Tuition";
    
    instructorProfile?: string;
    subject?: string;
    library?: boolean | string;
    hostelFacility?: boolean | string;
    playground?: boolean | string;
    busService?: boolean | string;
    entranceExam?: boolean | string;
    managementQuota?: boolean | string;
    extendedCare?: boolean | string;
    mealsProvided?: boolean | string;
    outdoorPlayArea?: boolean | string;
    placementDrives?: boolean | string;
    mockInterviews?: boolean | string;
    resumeBuilding?: boolean | string;
    linkedinOptimization?: boolean | string;
    exclusiveJobPortal?: boolean | string;
    certification?: boolean | string;
    [key: string]: any;
}
const initialCourseFormData: CourseFormData = {
    _id: "",
    courseName: "",
    aboutCourse: "",
    courseDuration: "",
    mode: "",
    priceOfCourse: "",
    location: "",
    classSize: "",
    eligibilityCriteria: "",
    operationalDays: [],
    openingTime: "",
    closingTime: "",
    graduationType: "",
    streamType: "",
    selectBranch: "",
    aboutBranch: "",
    educationType: "",
    ownershipType: "",
    collegeCategory: "",
    affiliationType: "",
    categoriesType: "",
    domainType: "",
    schoolType: "",
    schoolCategory: "",
    collegeType: "",
    curriculumType: "",
    otherActivities: "",
    hallName: "",
    seatingOption: "",
    totalSeats: "",
    availableSeats: "",
    pricePerSeat: "",
    tuitionType: "",
    instructorProfile: "",
    subject: "",
    library: "No",
    hostelFacility: "No",
    playground: "No",
    busService: "No",
    entranceExam: "No",
    managementQuota: "No",
    extendedCare: "No",
    mealsProvided: "No",
    outdoorPlayArea: "No",
    placementDrives: "No",
    mockInterviews: "No",
    resumeBuilding: "No",
    linkedinOptimization: "No",
    exclusiveJobPortal: "No",
    certification: "No",
    hasWifi: "No",
    hasChargingPoints: "No",
    hasAC: "No",
    hasPersonalLocker: "No",
};


// --- PROPS INTERFACES ---
interface PasswordFieldProps {
    label: string;
    value: string;
    show: boolean;
    placeholder: string;
    onChange: (value: string) => void;
    onToggle: () => void;
    disabled?: boolean;
}

interface SelectFieldProps {
    label: string;
    value: string;
    options: { value: any; label: any }[];
    onChange: (value: string) => void;
    placeholder?: string;
    bgClass?: string;
}


// --- REUSABLE COMPONENTS ---
const PasswordField: React.FC<PasswordFieldProps> = ({ label, value, show, placeholder, onChange, onToggle, disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button type="button" onClick={onToggle} disabled={disabled} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
        </div>
    </div>
);

const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange, placeholder = "Select option", bgClass = "bg-white" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm appearance-none ${bgClass}`}
            style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
            }}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
        </select>
    </div>
);


// --- MAIN PAGE COMPONENT ---
const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"admin" | "course">("admin");
    const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });
    const [courseData, setCourseData] = useState<CourseFormData>(initialCourseFormData);
    
    const [pageLoading, setPageLoading] = useState(true);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [passwordSaveLoading, setPasswordSaveLoading] = useState(false);
    const [courseSaveLoading, setCourseSaveLoading] = useState(false);
    
    const [courseError, setCourseError] = useState("");
    const [courseId, setCourseId] = useState<string | null>(null);
    const [allCourses, setAllCourses] = useState<CourseData[]>([]);
    const [userName, setUserName] = useState("User");
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [formData, setFormData] = useState<AdminFormData>({ currentEmail: "", newPassword: "", confirmPassword: "" });
    const [institutionType, setInstitutionType] = useState<string>("");

    const isUnderPostGraduate = institutionType === "Under Graduation/Post Graduation";
    const isCoachingCenter = institutionType === "Coaching centers";
    const isStudyHall = institutionType === "Study Halls";
    const isTutionCenter = institutionType === "Tution Center's";
    const isKindergarten = institutionType === "Kindergarten/childcare center";
    const isSchool = institutionType === "School's";
    const isIntermediateCollege = institutionType === "Intermediate college(K12)";
    
    const [institutionData, setInstitutionData] = useState<any | null>(null);
    const [selectedProgramName, setSelectedProgramName] = useState<string>("");
    const [branchesWithCourses, setBranchesWithCourses] = useState<any[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [originalCourseData, setOriginalCourseData] = useState<CourseFormData | null>(null);

    const branchDropdownOptions = branchesWithCourses?.flatMap((branch: any) =>
        (branch.courses || []).map((course: any) => ({
            value: course.selectBranch,
            label: course.selectBranch,
        }))
    ) || [];

    // --- DATA FETCHING EFFECTS ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setPageLoading(true);
            try {
                const profileRes = await authAPI.getProfile();
                if (profileRes.success && profileRes.data) {
                    setFormData((prev) => ({ ...prev, currentEmail: profileRes.data.email || "" }));
                    setUserName(profileRes.data.name || "User");
                }
            } catch (error) {
                console.error("Failed to fetch admin profile:", error);
            } finally {
                setPageLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (activeTab !== "course") return;

        const fetchFullData = async () => {
            setPageLoading(true);
            setCourseError("");
            try {
                const cachedData = await getFullDashboardData("fullDashboardData");
                if (cachedData) {
                    const courses = cachedData.branchesWithCourses.flatMap((b: any) => b.courses);
                    setAllCourses(courses);
                    setBranchesWithCourses(cachedData.branchesWithCourses);
                    setInstitutionData(cachedData.institution);
                    if (cachedData.institution?.instituteType) {
                        setInstitutionType(cachedData.institution.instituteType);
                    }
                    return;
                }

                const fileOrBlob: any = await dashboardAPI.getFullDashboardDetails();
                if (fileOrBlob instanceof Blob || fileOrBlob instanceof File) {
                    const textData = await fileOrBlob.text();
                    const data = JSON.parse(textData);

                    await saveFullDashboardData("fullDashboardData", data);

                    const courses = data.branchesWithCourses.flatMap((b: any) => b.courses);
                    setAllCourses(courses);
                    setBranchesWithCourses(data.branchesWithCourses);
                    setInstitutionData(data.institution);
                    if (data.institution?.instituteType) {
                        setInstitutionType(data.institution.instituteType);
                    }
                } else {
                    setCourseError("Unexpected response type from backend.");
                }
            } catch (error) {
                setCourseError(error instanceof Error ? error.message : "An unknown error occurred.");
            } finally {
                setPageLoading(false);
            }
        };

        fetchFullData();
    }, [activeTab]);

    // --- FORM HANDLERS ---
    const handleInputChange = (field: keyof AdminFormData, value: string) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const handleCourseChange = (field: string, value: any) => {
        setCourseData((prev) => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    const handleOperationalDayChange = (day: string) => {
        const currentDays = courseData.operationalDays || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        handleCourseChange("operationalDays", newDays);
    };

    const handleProgramSelect = (selectedName: string) => {
        setSelectedProgramName(selectedName);
        const type = institutionData?.instituteType;

        const findCourse = () => {
            if (type === "Under Graduation/Post Graduation") return allCourses.find(c => c.selectBranch === selectedName);
            if (type === "Study Halls") return allCourses.find(c => c.hallName === selectedName);
            if (type === "Tution Center's") return allCourses.find(c => c.subject === selectedName);
            return allCourses.find(c => c.courseName === selectedName);
        };
        
        const selectedCourse = findCourse();
        if (!selectedCourse) return;

        let newCourseData: CourseFormData = { ...initialCourseFormData, _id: selectedCourse._id };

        const baseCourseFields = {
            courseName: selectedCourse.courseName, aboutCourse: selectedCourse.aboutCourse,
            courseDuration: selectedCourse.courseDuration, mode: selectedCourse.mode,
            priceOfCourse: selectedCourse.priceOfCourse, location: selectedCourse.location
        };

        if (isKindergarten) {
            Object.assign(newCourseData, baseCourseFields, {
                schoolType: institutionData.schoolType, curriculumType: institutionData.curriculumType,
                openingTime: institutionData.openingTime, closingTime: institutionData.closingTime,
                operationalDays: institutionData.operationalDays,
                extendedCare: institutionData.extendedCare ? "Yes" : "No",
                mealsProvided: institutionData.mealsProvided ? "Yes" : "No",
                outdoorPlayArea: institutionData.outdoorPlayArea ? "Yes" : "No",
            });
        } else if (isSchool) {
            Object.assign(newCourseData, baseCourseFields, {
                schoolType: institutionData.schoolType, schoolCategory: institutionData.schoolCategory,
                curriculumType: institutionData.curriculumType, operationalDays: institutionData.operationalDays,
                otherActivities: institutionData.otherActivities,
                hostelFacility: institutionData.hostelFacility ? "Yes" : "No",
                playground: institutionData.playground ? "Yes" : "No",
                busService: institutionData.busService ? "Yes" : "No",
            });
        } else if (isIntermediateCollege) {
             Object.assign(newCourseData, baseCourseFields, {
                collegeType: institutionData.collegeType, collegeCategory: institutionData.collegeCategory,
                curriculumType: institutionData.curriculumType, operationalDays: institutionData.operationalDays,
                otherActivities: institutionData.otherActivities,
                hostelFacility: institutionData.hostelFacility ? "Yes" : "No",
                playground: institutionData.playground ? "Yes" : "No",
                busService: institutionData.busService ? "Yes" : "No",
            });
        } else if (isCoachingCenter) {
             Object.assign(newCourseData, baseCourseFields, {
                categoriesType: selectedCourse.categoriesType, domainType: selectedCourse.domainType,
                classSize: selectedCourse.classSize,
                placementDrives: institutionData.placementDrives ? "Yes" : "No",
                mockInterviews: institutionData.mockInterviews ? "Yes" : "No",
                resumeBuilding: institutionData.resumeBuilding ? "Yes" : "No",
                linkedinOptimization: institutionData.linkedinOptimization ? "Yes" : "No",
                exclusiveJobPortal: institutionData.exclusiveJobPortal ? "Yes" : "No",
                certification: institutionData.certification ? "Yes" : "No",
            });
        } else if (isUnderPostGraduate) {
            Object.assign(newCourseData, {
                ...baseCourseFields,
                graduationType: selectedCourse.graduationType, streamType: selectedCourse.streamType,
                selectBranch: selectedCourse.selectBranch, aboutBranch: selectedCourse.aboutBranch,
                educationType: selectedCourse.educationType, classSize: selectedCourse.classSize,
                eligibilityCriteria: selectedCourse.eligibilityCriteria,
                ownershipType: institutionData.ownershipType, collegeCategory: institutionData.collegeCategory,
                affiliationType: institutionData.affiliationType,
                library: institutionData.library ? "Yes" : "No",
                hostelFacility: institutionData.hostelFacility ? "Yes" : "No",
                entranceExam: institutionData.entranceExam ? "Yes" : "No",
                managementQuota: institutionData.managementQuota ? "Yes" : "No",
                playground: institutionData.playground ? "Yes" : "No",
                busService: institutionData.busService ? "Yes" : "No",
                placementDrives: institutionData.placements?.placementDrives ? "Yes" : "No",
                mockInterviews: institutionData.placements?.mockInterviews ? "Yes" : "No",
                resumeBuilding: institutionData.placements?.resumeBuilding ? "Yes" : "No",
                linkedinOptimization: institutionData.placements?.linkedinOptimization ? "Yes" : "No",
                exclusiveJobPortal: institutionData.placements?.exclusiveJobPortal ? "Yes" : "No",
                certification: institutionData.placements?.certification ? "Yes" : "No",
            });
        } else if (isStudyHall) {
             Object.assign(newCourseData, {
                hallName: selectedCourse.hallName, seatingOption: selectedCourse.seatingOption,
                openingTime: selectedCourse.openingTime, closingTime: selectedCourse.closingTime,
                operationalDays: selectedCourse.operationalDays, totalSeats: selectedCourse.totalSeats,
                availableSeats: selectedCourse.availableSeats, pricePerSeat: selectedCourse.pricePerSeat,
                hasWifi: selectedCourse.hasWifi ? "Yes" : "No",
                hasChargingPoints: selectedCourse.hasChargingPoints ? "Yes" : "No",
                hasAC: selectedCourse.hasAC ? "Yes" : "No",
                hasPersonalLocker: selectedCourse.hasPersonalLocker ? "Yes" : "No",
            });
        } else if (isTutionCenter) {
             Object.assign(newCourseData, {
                tuitionType: selectedCourse.tuitionType, instructorProfile: selectedCourse.instructorProfile,
                subject: selectedCourse.subject, totalSeats: selectedCourse.totalSeats,
                availableSeats: selectedCourse.availableSeats, pricePerSeat: selectedCourse.pricePerSeat,
                openingTime: selectedCourse.openingTime, closingTime: selectedCourse.closingTime,
                operationalDays: selectedCourse.operationalDays,
            });
        }

        setCourseData(newCourseData);
        setCourseId(selectedCourse._id || null);
    };

    // --- VALIDATION FUNCTIONS ---
    const getValidator = () => {
        if (isKindergarten) return validateKindergartenForm;
        if (isSchool) return validateSchoolForm;
        if (isIntermediateCollege) return validateIntermediateCollegeForm;
        if (isCoachingCenter) return validateCoachingCenterForm;
        if (isUnderPostGraduate) return validateUgPgForm;
        if (isStudyHall) return validateStudyHallForm;
        if (isTutionCenter) return validateTutionCenterForm;
        return () => true;
    };

    const validateForm = (schema: any, data: object) => {
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            const newErrors = error.details.reduce((acc: any, detail: any) => {
                acc[detail.path[0]] = detail.message.replace(/"/g, '');
                return acc;
            }, {});
            setErrors(newErrors);
            return false;
        }
        setErrors({});
        return true;
    };
    
    const validateKindergartenForm = () => validateForm(combinedKindergartenCourseSchema, {
        courseName: courseData.courseName, aboutCourse: courseData.aboutCourse, courseDuration: courseData.courseDuration,
        priceOfCourse: Number(courseData.priceOfCourse), location: courseData.location, mode: courseData.mode,
        schoolType: courseData.schoolType, curriculumType: courseData.curriculumType, openingTime: courseData.openingTime,
        closingTime: courseData.closingTime, operationalDays: courseData.operationalDays, extendedCare: courseData.extendedCare,
        mealsProvided: courseData.mealsProvided, outdoorPlayArea: courseData.outdoorPlayArea
    });

    const validateSchoolForm = () => validateForm(combinedSchoolCourseSchema, {
        courseName: courseData.courseName, aboutCourse: courseData.aboutCourse, courseDuration: courseData.courseDuration,
        priceOfCourse: Number(courseData.priceOfCourse), location: courseData.location, mode: courseData.mode,
        schoolType: courseData.schoolType, schoolCategory: courseData.schoolCategory, curriculumType: courseData.curriculumType,
        operationalDays: courseData.operationalDays, otherActivities: courseData.otherActivities, hostelFacility: courseData.hostelFacility,
        playground: courseData.playground, busService: courseData.busService
    });
    
    const validateIntermediateCollegeForm = () => validateForm(combinedIntermediateCollegeSchema, {
        courseName: courseData.courseName, aboutCourse: courseData.aboutCourse, courseDuration: courseData.courseDuration,
        priceOfCourse: Number(courseData.priceOfCourse), location: courseData.location, mode: courseData.mode,
        collegeType: courseData.collegeType, collegeCategory: courseData.collegeCategory, curriculumType: courseData.curriculumType,
        operationalDays: courseData.operationalDays, otherActivities: courseData.otherActivities, hostelFacility: courseData.hostelFacility,
        playground: courseData.playground, busService: courseData.busService
    });

    const validateCoachingCenterForm = () => validateForm(combinedCoachingCenterSchema, {
        courseName: courseData.courseName, courseDuration: courseData.courseDuration, priceOfCourse: Number(courseData.priceOfCourse),
        location: courseData.location, mode: courseData.mode, categoriesType: courseData.categoriesType, domainType: courseData.domainType,
        classSize: Number(courseData.classSize), placementDrives: courseData.placementDrives, mockInterviews: courseData.mockInterviews,
        resumeBuilding: courseData.resumeBuilding, linkedinOptimization: courseData.linkedinOptimization,
        exclusiveJobPortal: courseData.exclusiveJobPortal, certification: courseData.certification
    });

    const validateUgPgForm = () => validateForm(combinedUgPgSchema, {
        graduationType: courseData.graduationType, streamType: courseData.streamType, selectBranch: courseData.selectBranch,
        aboutBranch: courseData.aboutBranch, educationType: courseData.educationType, mode: courseData.mode,
        courseDuration: courseData.courseDuration, priceOfCourse: Number(courseData.priceOfCourse), classSize: Number(courseData.classSize),
        eligibilityCriteria: courseData.eligibilityCriteria, ownershipType: courseData.ownershipType, collegeCategory: courseData.collegeCategory,
        affiliationType: courseData.affiliationType, placementDrives: courseData.placementDrives, mockInterviews: courseData.mockInterviews,
        resumeBuilding: courseData.resumeBuilding, linkedinOptimization: courseData.linkedinOptimization, exclusiveJobPortal: courseData.exclusiveJobPortal,
        library: courseData.library, hostelFacility: courseData.hostelFacility, entranceExam: courseData.entranceExam,
        managementQuota: courseData.managementQuota, playground: courseData.playground, busService: courseData.busService
    });

    const validateStudyHallForm = () => validateForm(combinedStudyHallSchema, {
        hallName: courseData.hallName, seatingOption: courseData.seatingOption, openingTime: courseData.openingTime,
        closingTime: courseData.closingTime, operationalDays: courseData.operationalDays, totalSeats: Number(courseData.totalSeats),
        availableSeats: Number(courseData.availableSeats), pricePerSeat: Number(courseData.pricePerSeat), hasWifi: courseData.hasWifi,
        hasChargingPoints: courseData.hasChargingPoints, hasAC: courseData.hasAC, hasPersonalLocker: courseData.hasPersonalLocker
    });

    const validateTutionCenterForm = () => validateForm(combinedTutionCenterSchema, {
        tuitionType: courseData.tuitionType, instructorProfile: courseData.instructorProfile, subject: courseData.subject,
        totalSeats: Number(courseData.totalSeats), availableSeats: Number(courseData.availableSeats), operationalDays: courseData.operationalDays,
        openingTime: courseData.openingTime, closingTime: courseData.closingTime, pricePerSeat: Number(courseData.pricePerSeat)
    });

    const validateField = (name: string, value: any) => {
        let schema;
        if (isSchool) schema = combinedSchoolCourseSchema;
        else if (isKindergarten) schema = combinedKindergartenCourseSchema;
        else if (isIntermediateCollege) schema = combinedIntermediateCollegeSchema;
        else if (isCoachingCenter) schema = combinedCoachingCenterSchema;
        else if (isUnderPostGraduate) schema = combinedUgPgSchema;
        else if (isStudyHall) schema = combinedStudyHallSchema;
        else if (isTutionCenter) schema = combinedTutionCenterSchema;
        else return;

        const fieldSchema = schema.extract(name);
        const { error } = fieldSchema.validate(value);

        setErrors(prev => {
            const newErrors = { ...prev };
            if (error) {
                newErrors[name] = error.message.replace(/"/g, '');
            } else {
                delete newErrors[name];
            }
            return newErrors;
        });
    };
    
    // --- ACTION HANDLERS (SAVE, OTP, etc.) ---

    const handleSendVerification = async () => {
        setVerificationLoading(true);
        setOtpError("");
        try {
            const response = await dashboardAPI.sendVerificationOTP();
            if (response.success) {
                setIsVerificationSent(true);
                toast.success("A verification code has been sent to your primary email.");
            } else {
                setOtpError(response.message || "Failed to send verification code.");
            }
        } catch (error) {
            setOtpError("An unexpected error occurred. Please try again.");
        } finally {
            setVerificationLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setOtpError("OTP must be 6 digits.");
            return;
        }
        setVerificationLoading(true);
        setOtpError("");
        try {
            const response = await dashboardAPI.verifyActionOTP(otp);
            if (response.success) {
                setIsEmailVerified(true);
                setIsVerificationSent(false);
            } else {
                setOtpError(response.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            setOtpError("An unexpected error occurred during verification.");
        } finally {
            setVerificationLoading(false);
        }
    };

    const handleSavePassword = async () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            toast.warn("Please fill in all password fields");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.warn("Passwords do not match");
            return;
        }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(formData.newPassword)) {
            toast.warn("Password must be 8+ characters and include uppercase, lowercase, number, and special character.");
            return;
        }

        setPasswordSaveLoading(true);
        try {
            const response = await dashboardAPI.updatePassword(formData.newPassword);
            if (response.success) {
                toast.success("Password updated successfully!");
                setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
                setIsEmailVerified(false);
                setOtp("");
            } else {
                toast.error(response.message || "Failed to update password.");
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || "An error occurred with the request.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setPasswordSaveLoading(false);
        }
    };
const handleSaveCourse = async () => {
    const validator = getValidator();
    if (!validator()) {
        toast.error("Please fix the errors in the form.");
        return;
    }

    const institutionIdToCheck = institutionData?._id || institutionData?.id;
    if (!institutionIdToCheck || !courseId) {
        toast.error("Institution or Course ID is missing. Please re-select the program.");
        return;
    }

    setCourseSaveLoading(true);

    // ✅ Using your precise method for building the payload
    let updatePayload: CourseUpdateData = { courseId };

    if (isKindergarten) {
        Object.assign(updatePayload, {
            courseName: courseData.courseName, aboutCourse: courseData.aboutCourse,
            courseDuration: courseData.courseDuration, mode: courseData.mode,
            priceOfCourse: Number(courseData.priceOfCourse), location: courseData.location,
            schoolType: courseData.schoolType, curriculumType: courseData.curriculumType,
            openingTime: courseData.openingTime, closingTime: courseData.closingTime,
            operationalDays: courseData.operationalDays, extendedCare: courseData.extendedCare,
            mealsProvided: courseData.mealsProvided, outdoorPlayArea: courseData.outdoorPlayArea,
        });
    } else if (isSchool) {
        Object.assign(updatePayload, {
            courseName: courseData.courseName, aboutCourse: courseData.aboutCourse,
            courseDuration: courseData.courseDuration, mode: courseData.mode,
            priceOfCourse: Number(courseData.priceOfCourse), location: courseData.location,
            schoolType: courseData.schoolType, schoolCategory: courseData.schoolCategory,
            curriculumType: courseData.curriculumType, operationalDays: courseData.operationalDays,
            otherActivities: courseData.otherActivities, hostelFacility: courseData.hostelFacility,
            playground: courseData.playground, busService: courseData.busService,
        });
    } else if (isIntermediateCollege) {
        Object.assign(updatePayload, {
            courseName: courseData.courseName, aboutCourse: courseData.aboutCourse,
            courseDuration: courseData.courseDuration, mode: courseData.mode,
            priceOfCourse: Number(courseData.priceOfCourse), location: courseData.location,
            collegeType: courseData.collegeType, collegeCategory: courseData.collegeCategory,
            curriculumType: courseData.curriculumType, operationalDays: courseData.operationalDays,
            otherActivities: courseData.otherActivities, hostelFacility: courseData.hostelFacility,
            playground: courseData.playground, busService: courseData.busService,
        });
    } else if (isCoachingCenter) {
        Object.assign(updatePayload, {
            courseName: courseData.courseName, courseDuration: courseData.courseDuration,
            mode: courseData.mode, priceOfCourse: Number(courseData.priceOfCourse),
            location: courseData.location, categoriesType: courseData.categoriesType,
            domainType: courseData.domainType, classSize: courseData.classSize,
            placementDrives: courseData.placementDrives, mockInterviews: courseData.mockInterviews,
            resumeBuilding: courseData.resumeBuilding, linkedinOptimization: courseData.linkedinOptimization,
            exclusiveJobPortal: courseData.exclusiveJobPortal, certification: courseData.certification,
        });
    } else if (isUnderPostGraduate) {
        Object.assign(updatePayload, {
            courseName: courseData.courseName, aboutCourse: courseData.aboutCourse,
            graduationType: courseData.graduationType, streamType: courseData.streamType,
            selectBranch: courseData.selectBranch, aboutBranch: courseData.aboutBranch,
            educationType: courseData.educationType, mode: courseData.mode,
            courseDuration: courseData.courseDuration, priceOfCourse: Number(courseData.priceOfCourse),
            classSize: Number(courseData.classSize), eligibilityCriteria: courseData.eligibilityCriteria,
            ownershipType: courseData.ownershipType, collegeCategory: courseData.collegeCategory,
            affiliationType: courseData.affiliationType, placementDrives: courseData.placementDrives,
            mockInterviews: courseData.mockInterviews, resumeBuilding: courseData.resumeBuilding,
            linkedinOptimization: courseData.linkedinOptimization, exclusiveJobPortal: courseData.exclusiveJobPortal,
            library: courseData.library, hostelFacility: courseData.hostelFacility,
            entranceExam: courseData.entranceExam, managementQuota: courseData.managementQuota,
            playground: courseData.playground, busService: courseData.busService,
        });
    } else if (isStudyHall) {
        Object.assign(updatePayload, {
            hallName: courseData.hallName, seatingOption: courseData.seatingOption,
            openingTime: courseData.openingTime, closingTime: courseData.closingTime,
            operationalDays: courseData.operationalDays, totalSeats: Number(courseData.totalSeats),
            availableSeats: Number(courseData.availableSeats), pricePerSeat: Number(courseData.pricePerSeat),
            hasWifi: courseData.hasWifi, hasChargingPoints: courseData.hasChargingPoints,
            hasAC: courseData.hasAC, hasPersonalLocker: courseData.hasPersonalLocker,
        });
    } else if (isTutionCenter) {
        Object.assign(updatePayload, {
            tuitionType: courseData.tuitionType, instructorProfile: courseData.instructorProfile,
            subject: courseData.subject, totalSeats: Number(courseData.totalSeats),
            availableSeats: Number(courseData.availableSeats), operationalDays: courseData.operationalDays,
            openingTime: courseData.openingTime, closingTime: courseData.closingTime,
            pricePerSeat: Number(courseData.pricePerSeat),
        });
    }
    
    try {
        const response = await dashboardAPI.updateInstitutionAndCourse(institutionIdToCheck, updatePayload);

        if (response.success && response.data) {
            toast.success("Details updated successfully!");
            setErrors({});

            const { institution: updatedInstitution, course: updatedCourse } = response.data;
            
            setInstitutionData(updatedInstitution);
            const updatedCourses = allCourses.map(c => c._id === updatedCourse._id ? updatedCourse : c);
            setAllCourses(updatedCourses);

            const cachedData = await getFullDashboardData("fullDashboardData");
            if (cachedData) {
                const updatedBranchesWithCourses = cachedData.branchesWithCourses.map((branch: any) => ({
                    ...branch,
                    courses: branch.courses.map((c: any) => c._id === updatedCourse._id ? updatedCourse : c),
                }));
                const newFullData = { ...cachedData, institution: updatedInstitution, branchesWithCourses: updatedBranchesWithCourses };
                await saveFullDashboardData("fullDashboardData", newFullData);
            }

            const newCourseStateForForm: CourseFormData = {
                ...initialCourseFormData, ...updatedInstitution, ...updatedCourse, _id: updatedCourse._id,
            };

            const booleanFields = [
                'extendedCare', 'mealsProvided', 'outdoorPlayArea', 'placementDrives', 'mockInterviews', 
                'resumeBuilding', 'linkedinOptimization', 'exclusiveJobPortal', 'library', 'hostelFacility', 
                'playground', 'busService', 'certification', 'entranceExam', 'managementQuota', 'hasWifi', 
                'hasChargingPoints', 'hasAC', 'hasPersonalLocker'
            ];

            booleanFields.forEach(field => {
                let value = updatedInstitution[field];
                if (updatedInstitution.placements && updatedInstitution.placements[field] !== undefined) {
                    value = updatedInstitution.placements[field];
                }
                if (updatedCourse[field] !== undefined) {
                    value = updatedCourse[field];
                }
                if (typeof value === 'boolean') {
                    newCourseStateForForm[field] = value ? "Yes" : "No";
                }
            });

            setCourseData(newCourseStateForForm);

        } else {
            toast.error(response.message || "Failed to update details.");
        }
    } catch (error) {
        console.error("Error updating details:", error);
        toast.error("An unexpected error occurred while saving.");
    } finally {
        setCourseSaveLoading(false);
    }
};
    const handleSubmitWrapper = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveCourse();
    };


    if (pageLoading && activeTab === 'course' && !allCourses.length) {
        return <div className="min-h-screen flex items-center justify-center">Loading settings...</div>;
    }

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="flex-1 p-4 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="flex space-x-8">
                            <button onClick={() => setActiveTab("admin")} className={`py-2 px-1 border-b-2 font-medium text-base transition-colors duration-200 ${activeTab === "admin" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Admin Details</button>
                            <button onClick={() => setActiveTab("course")} className={`py-2 px-1 border-b-2 font-medium text-base transition-colors duration-200 ${activeTab === "course" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Edit Program</button>
                        </nav>
                    </div>

                    {activeTab === "admin" && (
                        <div className="space-y-8">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
                                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                                    {userName.charAt(0).toUpperCase()}{(userName.split(" ")[1]?.charAt(0).toUpperCase() || "")}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-800">{userName}</h2>
                                    <p className="text-gray-500">Admin</p>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                    <Edit3 className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Settings</h3>
                                <label className="block text-base font-medium text-gray-700 mb-1">Your Primary Email</label>
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 text-base">
                                    {formData.currentEmail || "Loading..."}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                                <div className="space-y-4">
                                    {!isEmailVerified ? (
                                        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <KeyRound className="h-6 w-6 text-blue-500 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-blue-800">Secure Your Account</h4>
                                                    <p className="text-sm text-blue-700">Verify your email to enable password changes.</p>
                                                </div>
                                                {!isVerificationSent && (
                                                    <button onClick={handleSendVerification} disabled={verificationLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm font-medium">
                                                        {verificationLoading ? "Sending..." : "Verify Email"}
                                                    </button>
                                                )}
                                            </div>
                                            {isVerificationSent && (
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit code</label>
                                                    <div className="flex items-end space-x-2">
                                                        <div className="flex-1">
                                                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-base ${otpError ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-blue-500"}`} placeholder="123456" />
                                                        </div>
                                                        <button onClick={handleVerifyOtp} disabled={verificationLoading || otp.length !== 6} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors text-sm font-medium">
                                                            {verificationLoading ? "Verifying..." : "Verify OTP"}
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-red-600 mt-1 min-h-[1.25rem]">{otpError || "\u00A0"}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                         <div className="p-4 border border-green-200 bg-green-50 rounded-lg flex items-center space-x-3">
                                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-green-800">Email Verified</h4>
                                                <p className="text-sm text-green-700">You can now set your new password below.</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <PasswordField label="New Password" value={formData.newPassword} show={showPasswords.new} placeholder="Enter new password" onChange={(val) => handleInputChange("newPassword", val)} onToggle={() => setShowPasswords(p => ({ ...p, new: !p.new }))} disabled={!isEmailVerified} />
                                        <PasswordField label="Confirm Password" value={formData.confirmPassword} show={showPasswords.confirm} placeholder="Confirm new password" onChange={(val) => handleInputChange("confirmPassword", val)} onToggle={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))} disabled={!isEmailVerified} />
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={handleSavePassword} disabled={!isEmailVerified || passwordSaveLoading || !formData.newPassword || !formData.confirmPassword} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors text-base font-medium">
                                            {passwordSaveLoading ? "Saving..." : "Save New Password"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "course" && (
                        <div>
                            <div className="inline-block w-full max-w-xs mb-4">
                                <SelectField
                                    label="Select a Program to Edit"
                                    value={selectedProgramName}
                                    options={
                                        isUnderPostGraduate ? branchDropdownOptions :
                                        isStudyHall ? allCourses.map(c => ({ value: c.hallName, label: c.hallName })) :
                                        isTutionCenter ? allCourses.map(c => ({ value: c.subject, label: c.subject })) :
                                        allCourses.map(c => ({ value: c.courseName, label: c.courseName }))
                                    }
                                    onChange={(value) => handleProgramSelect(value)}
                                    placeholder="Choose a Program"
                                    bgClass="bg-white"
                                />
                            </div>

                            {courseError && <p className="text-red-600 text-sm mb-4">{courseError}</p>}

                            {selectedProgramName && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                {isKindergarten && (
                                        <KindergartenCourseForm
                                            formData={courseData as any} 
                                            formErrors={errors}
                                            handleFieldChange={handleCourseChange}
                                            handleOperationalDayToggle={handleOperationalDayChange}
                                            operationalDaysOptions={operationalDaysOptions}
                                            handleSubmit={handleSubmitWrapper}
                                            isLoading={courseSaveLoading}
                                        />
                                    )}
                                    {isSchool && (
                                                <SchoolCourseForm
                                                    formData={courseData as any}
                                                    formErrors={errors}
                                                    handleFieldChange={handleCourseChange}
                                                    handleOperationalDayToggle={handleOperationalDayChange}
                                                    operationalDaysOptions={operationalDaysOptions}
                                                    handleSubmit={handleSubmitWrapper}
                                                    isLoading={courseSaveLoading}
                                                    onPrevious={() => setSelectedProgramName("")}
                                                />
                                                )}
                                    {isIntermediateCollege && (
                                        <IntermediateCollegeCourseForm
                                            formData={courseData}
                                            formErrors={errors}
                                            handleFieldChange={handleCourseChange}
                                            handleOperationalDayToggle={handleOperationalDayChange}
                                            operationalDaysOptions={operationalDaysOptions}
                                            handleSubmit={handleSubmitWrapper}
                                            isLoading={courseSaveLoading}
                                            onPrevious={() => setSelectedProgramName("")}
                                        />
                                    )}
                                    {isCoachingCenter && (
                                        <CoachingCourseForm
                                            formData={courseData}
                                            formErrors={errors}
                                            handleFieldChange={handleCourseChange}
                                            handleSubmit={handleSubmitWrapper}
                                            isLoading={courseSaveLoading}
                                            onPrevious={() => setSelectedProgramName("")}
                                        />
                                    )}
                                    {isUnderPostGraduate && (
                                        <UnderPostGraduateCourseForm
                                            formData={courseData}
                                            formErrors={errors}
                                            handleFieldChange={handleCourseChange}
                                            handleSubmit={handleSubmitWrapper}
                                            isLoading={courseSaveLoading}
                                            onPrevious={() => setSelectedProgramName("")}
                                        />
                                    )}
                                    {isStudyHall && (
                                        <StudyHallCourseForm
                                            formData={courseData}
                                            formErrors={errors}
                                            handleFieldChange={handleCourseChange}
                                            handleOperationalDayToggle={handleOperationalDayChange}
                                            operationalDaysOptions={operationalDaysOptions}
                                            handleSubmit={handleSubmitWrapper}
                                            isLoading={courseSaveLoading}
                                            onPrevious={() => setSelectedProgramName("")}
                                        />
                                    )}
                                    {isTutionCenter && (
                                        <TuitionCenterCourseForm
                                            formData={courseData}
                                            formErrors={errors}
                                            handleFieldChange={handleCourseChange}
                                            handleOperationalDayToggle={handleOperationalDayChange}
                                            operationalDaysOptions={operationalDaysOptions}
                                            handleSubmit={handleSubmitWrapper}
                                            isLoading={courseSaveLoading}
                                            onPrevious={() => setSelectedProgramName("")}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;