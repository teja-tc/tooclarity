
"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Eye, EyeOff, Upload, Calendar, MapPin, Users } from "lucide-react";
import { courseAPI, CourseData, institutionDetailsAPI , UndergraduateData, authAPI } from "@/lib/api";



interface FormData {
  currentEmail: string;
  secondaryEmail: string; // Added for secondary email
  newPassword: string;
  confirmPassword: string;
}

interface CourseFormData {
  program: string;
  graduationType: string;
  streamType: string;
  branch: string;
  branchDescription: string;
  educationType: string;
  mode: string;
  duration: string;
  price: string;
  location: string;
  classSize: string;
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

interface PasswordFieldProps {
  label: string;
  value: string;
  show: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  bgClass?: string;
}

interface RadioGroupProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

interface FileUploadProps {
  label: string;
  accept: string;
  placeholder: string;
  onChange?: (file: File | null) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  show,
  placeholder,
  onChange,
  onToggle,
}) => {
  return (
    <div className="mb-3">
      <label className="block text-base font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 text-base"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select option",
  bgClass = "bg-gray-50",
}) => {
  return (
    <div className="mb-3">
      <label className="block text-base font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${bgClass} text-gray-900 text-base shadow-sm hover:shadow-md`}
        style={{
          borderRadius: "1.5rem",
          WebkitAppearance: "none",
          MozAppearance: "none",
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, #3b82f6 50%), linear-gradient(135deg, #3b82f6 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 1rem) calc(1rem), calc(100% - 0.75rem) calc(1rem)",
          backgroundSize: "0.5rem 0.5rem, 0.5rem 0.5rem",
          backgroundRepeat: "no-repeat",
          paddingRight: "2.5rem",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="rounded-lg text-gray-900 bg-white hover:bg-blue-50 cursor-pointer"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const RadioGroup: React.FC<RadioGroupProps> = ({ label, value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="block text-base font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            checked={value === true}
            onChange={() => onChange(true)}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-1 text-base text-gray-700">Yes</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            checked={value === false}
            onChange={() => onChange(false)}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-1 text-base text-gray-700">No</span>
        </label>
      </div>
    </div>
  );
};

const FileUpload: React.FC<FileUploadProps> = ({ label, accept, placeholder, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onChange) {
      onChange(file);
    }
    e.target.value = '';
  };

  return (
    <div className="mb-3">
      <label className="block text-base font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
        <p className="text-sm text-gray-500 mb-1">{placeholder}</p>
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
        />
        <label
          htmlFor={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Choose file
        </label>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"admin" | "course">("admin");
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [allCourses, setAllCourses] = useState<CourseData[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [userName, setUserName] = useState("Raghavendar Reddy"); // Added for dynamic profile name

  const [formData, setFormData] = useState<FormData>({
    currentEmail: "",
    secondaryEmail: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [courseData, setCourseData] = useState<CourseFormData>({
    program: "",
    graduationType: "",
    streamType: "",
    branch: "",
    branchDescription: "",
    educationType: "",
    mode: "",
    duration: "",
    price: "",
    location: "",
    classSize: "",
    ownershipType: "",
    collegeCategory: "",
    affiliationType: "",
    placementDrives: false,
    mockInterviews: false,
    resumeBuilding: false,
    linkedinOptimization: false,
    exclusiveJobPortal: false,
    library: false,
    hostelFacility: false,
    entranceExam: false,
    managementQuota: false,
    playground: false,
    busService: false,
  });

  useEffect(() => {
    const fetchProfileAndCourses = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        const profileResponse = await authAPI.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setFormData((prev) => ({
            ...prev,
            currentEmail: profileResponse.data.email || "",
            secondaryEmail: profileResponse.data.secondaryEmail || "",
          }));
          setUserName(profileResponse.data.name || "User");
        } else {
          setEmailError(profileResponse.message || "Failed to fetch profile.");
        }

        // Fetch courses
        const courseResponse = await courseAPI.getCourses();
        if (courseResponse.success && courseResponse.data) {
          setAllCourses(courseResponse.data);
        } else {
          setCourseError(courseResponse.message || "Failed to fetch courses.");
        }
      } catch (error) {
        setEmailError("Error fetching profile or courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndCourses();
  }, []);

  const handleProgramSelect = async (programName: string) => {
    const selectedCourse = allCourses.find(
      (course) => course.courseName === programName
    );

    if (selectedCourse) {
      setCourseId(selectedCourse.id.toString());

      setCourseData({
        program: selectedCourse.courseName || "",
        graduationType: selectedCourse.graduationType || "",
        streamType: selectedCourse.streamType || "",
        branch: selectedCourse.selectBranch || "",
        branchDescription: selectedCourse.aboutBranch || "",
        educationType: selectedCourse.educationType || "",
        mode: selectedCourse.mode || "",
        duration: selectedCourse.courseDuration || "",
        price: selectedCourse.priceOfCourse.toString() || "",
        location: selectedCourse.location || "",
        classSize: selectedCourse.classSize || "",
        ownershipType: "",
        collegeCategory: "",
        affiliationType: "",
        placementDrives: false,
        mockInterviews: false,
        resumeBuilding: false,
        linkedinOptimization: false,
        exclusiveJobPortal: false,
        library: false,
        hostelFacility: false,
        entranceExam: false,
        managementQuota: false,
        playground: false,
        busService: false,
      });

      setImageFile(null);
      setBrochureFile(null);

      if (selectedCourse.graduationType === "Under graduation" || selectedCourse.graduationType === "Post graduation") {
        setLoading(true);
        try {
          const response = await institutionDetailsAPI.getInstitutionDetails();
          if (response.success && response.data) {
            setCourseData((prev) => ({
              ...prev,
              ownershipType: response.data.ownershipType || "",
              collegeCategory: response.data.collegeCategory || "",
              affiliationType: response.data.affiliationType || "",
              placementDrives: response.data.placementDrives || false,
              mockInterviews: response.data.mockInterviews || false,
              resumeBuilding: response.data.resumeBuilding || false,
              linkedinOptimization: response.data.linkedinOptimization || false,
              exclusiveJobPortal: response.data.exclusiveJobPortal || false,
              library: response.data.library || false,
              hostelFacility: response.data.hostelFacility || false,
              entranceExam: response.data.entranceExam || false,
              managementQuota: response.data.managementQuota || false,
              playground: response.data.playground || false,
              busService: response.data.busService || false,
            }));
          } else {
            setCourseError(response.message || "Failed to fetch institution details.");
          }
        } catch (error) {
          setCourseError("Error fetching institution details.");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    if (!email.endsWith("@gmail.com")) return false;
    if (email.length <= 5) return false;
    return true;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "secondaryEmail" && emailError) {
      setEmailError("");
    }
  };

  const handleCourseChange = (field: keyof CourseFormData, value: string | boolean) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (courseError) {
      setCourseError("");
    }
  };

  const handleSaveSecondaryEmail = async () => {
    if (!formData.secondaryEmail) {
      setEmailError("Please enter a secondary email address");
      return;
    }

    if (!validateEmail(formData.secondaryEmail)) {
      setEmailError("Please enter a valid Gmail address (minimum 6 characters)");
      return;
    }

    if (formData.secondaryEmail === formData.currentEmail) {
      setEmailError("Secondary email must be different from primary email");
      return;
    }

    setLoading(true);
    setEmailError("");

    try {
      const response = await authAPI.updateSecondaryEmail({
        secondaryEmail: formData.secondaryEmail,
      });

      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          secondaryEmail: formData.secondaryEmail, // Keep the updated secondary email
        }));
        alert("Secondary email updated successfully!");
      } else {
        setEmailError(response.message || "Failed to update secondary email.");
      }
    } catch (error) {
      setEmailError("Failed to update secondary email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(formData.newPassword)) {
      alert("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.updatePassword({
        newPassword: formData.newPassword,
      });

      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
        alert("Password updated successfully!");
      } else {
        alert(response.message || "Failed to update password");
      }
    } catch (error) {
      alert("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!courseId) {
      setCourseError("No course selected to update.");
      return;
    }

    setLoading(true);
    setCourseError("");

    try {
      const courseUpdateData: Partial<CourseData> = {
        courseName: courseData.program,
        graduationType: courseData.graduationType,
        streamType: courseData.streamType,
        selectBranch: courseData.branch,
        aboutBranch: courseData.branchDescription,
        educationType: courseData.educationType,
        mode: courseData.mode,
        courseDuration: courseData.duration,
        priceOfCourse: courseData.price,
        location: courseData.location,
        classSize: courseData.classSize,
        ...(imageFile && { image: imageFile }),
        ...(brochureFile && { brochure: brochureFile }),
      };

      const response = await courseAPI.updateCourse(parseInt(courseId), courseUpdateData);

      if (response.success) {
        if (courseData.graduationType === "Under graduation" || courseData.graduationType === "Post graduation") {
          const institutionUpdateData: UndergraduateData = {
            ownershipType: courseData.ownershipType,
            collegeCategory: courseData.collegeCategory,
            affiliationType: courseData.affiliationType,
            placementDrives: courseData.placementDrives,
            mockInterviews: courseData.mockInterviews,
            resumeBuilding: courseData.resumeBuilding,
            linkedinOptimization: courseData.linkedinOptimization,
            exclusiveJobPortal: courseData.exclusiveJobPortal,
            library: courseData.library,
            hostelFacility: courseData.hostelFacility,
            entranceExam: courseData.entranceExam,
            managementQuota: courseData.managementQuota,
            playground: courseData.playground,
            busService: courseData.busService,
          };

          const instResponse = await institutionDetailsAPI.createInstitutionDetails(institutionUpdateData);
          if (!instResponse.success) {
            setCourseError(instResponse.message || "Failed to update institution details.");
            return;
          }
        }

        setImageFile(null);
        setBrochureFile(null);
        alert("Course and institution details updated successfully!");
      } else {
        setCourseError(response.message || "Failed to update course details.");
      }
    } catch (error) {
      setCourseError("Error updating details.");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        console.log("Profile Details:", response.data); // <-- profile data here
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>

            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("admin")}
                  className={`py-2 px-4 border-b-2 font-medium text-base transition-all duration-200 ${
                    activeTab === "admin"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Admin Details
                </button>
                <button
                  onClick={() => setActiveTab("course")}

                  className={`py-2 px-4 border-b-2 font-medium text-base transition-all duration-200 ${
                    activeTab === "course"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Edit Program
                </button>
              </nav>
            </div>

            {activeTab === "admin" && (
              <div className="space-y-6">
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center space-x-4 w-full max-w-xl">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {userName.charAt(0).toUpperCase() + (userName.split(" ")[1]?.charAt(0).toUpperCase() || "")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">{userName}</h2>
                      <p className="text-gray-500 text-sm">Admin</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                      <Edit3 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-800 mb-3">Email Settings</h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">
                        Your Primary Email
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-base">
                        {formData.currentEmail || "Loading..."}
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          Secondary Email
                        </label>
                        <input
                          type="email"
                          placeholder="Enter secondary email"
                          value={formData.secondaryEmail}
                          onChange={(e) => handleInputChange("secondaryEmail", e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base ${
                            emailError ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500"
                          }`}
                        />
                        {emailError && (
                          <p className="mt-1 text-sm text-red-600">{emailError}</p>
                        )}
                      </div>
                      <button
                        onClick={handleSaveSecondaryEmail}
                        disabled={loading || !formData.secondaryEmail}
                        className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 text-base"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-800 mb-3">Change Password</h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <PasswordField
                        label="New Password"
                        value={formData.newPassword}
                        show={showPasswords.new}
                        placeholder="Enter new password"
                        onChange={(val) => handleInputChange("newPassword", val)}
                        onToggle={() =>
                          setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                        }
                      />
                      <PasswordField
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        show={showPasswords.confirm}
                        placeholder="Confirm new password"
                        onChange={(val) => handleInputChange("confirmPassword", val)}
                        onToggle={() =>
                          setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                        }
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSavePassword}
                        disabled={loading || !formData.newPassword || !formData.confirmPassword}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 text-base"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "course" && (
              <div>
                <div className="inline-block w-auto px-1 py-0.5 mb-4">
                  <SelectField
                    label=""
                    value={courseData.program}
                    options={allCourses.map(course => ({ value: course.courseName, label: course.courseName }))}
                    onChange={(val) => handleProgramSelect(val)}
                    placeholder="Choose Program to see"
                    bgClass="bg-white"
                  />
                </div>
                {courseError && (
                  <p className="text-red-600 text-sm mb-4">{courseError}</p>
                )}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <SelectField
                        label="Graduation type"
                        value={courseData.graduationType}
                        options={[{value:"Under graduation", label:"Under graduation"}, {value:"Post graduation", label:"Post graduation"}, {value:"Diploma", label:"Diploma"}]}
                        onChange={(val) => handleCourseChange("graduationType", val)}
                      />
                      <SelectField
                        label="Stream type"
                        value={courseData.streamType}
                        options={[{value:"Engineering", label:"Engineering"}, {value:"Management", label:"Management"}, {value:"Medical", label:"Medical"}, {value:"Arts", label:"Arts"}, {value:"Science", label:"Science"}]}
                        onChange={(val) => handleCourseChange("streamType", val)}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <SelectField
                        label="Select branch"
                        value={courseData.branch}
                        options={[{value:"Electrical engineering", label:"Electrical engineering"}, {value:"Computer Science", label:"Computer Science"}, {value:"Mechanical engineering", label:"Mechanical engineering"}, {value:"Civil engineering", label:"Civil engineering"}]}
                        onChange={(val) => handleCourseChange("branch", val)}
                      />
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          About branch
                        </label>
                        <textarea
                          value={courseData.branchDescription}
                          onChange={(e) => handleCourseChange("branchDescription", e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-base"
                          placeholder="Enter branch description"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">
                          Education type
                        </label>
                        <div className="flex rounded-full border border-gray-200 p-1 bg-gray-100">
                          {["Full time", "Part time", "Distance"].map((type) => (
                            <button
                              key={type}
                              onClick={() => handleCourseChange("educationType", type)}
                              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 
                              ${
                                courseData.educationType === type
                                  ? "bg-blue-200 text-blue-800 rounded-full shadow-sm"
                                  : "text-gray-500 hover:bg-gray-200 hover:rounded-full"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">
                          Mode
                        </label>
                        <div className="flex rounded-full border border-gray-200 p-1 bg-gray-100">
                          {["Offline", "Online", "Hybrid"].map((type) => (
                            <button
                              key={type}
                              onClick={() => handleCourseChange("mode", type)}
                              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 
                              ${
                                courseData.mode === type
                                  ? "bg-blue-200 text-blue-800 rounded-full shadow-sm"
                                  : "text-gray-500 hover:bg-gray-200 hover:rounded-full"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          Course Duration
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={courseData.duration}
                            onChange={(e) => handleCourseChange("duration", e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                            placeholder="e.g., 4years"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          Price of Course
                        </label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                          <input
                            type="text"
                            value={courseData.price}
                            onChange={(e) => handleCourseChange("price", e.target.value)}
                            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                            placeholder="e.g., 4,00,000 /-"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={courseData.location}
                            onChange={(e) => handleCourseChange("location", e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                            placeholder="Enter location"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          Class size
                        </label>
                        <div className="relative">
                          <Users className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={courseData.classSize}
                            onChange={(e) => handleCourseChange("classSize", e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                            placeholder="e.g., 60"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FileUpload
                        label="Add Image"
                        accept=".jpg,.jpeg,.png"
                        placeholder="Upload Course Image (jpg / jpeg)"
                        onChange={setImageFile}
                      />
                      <FileUpload
                        label="Add Brochure"
                        accept=".pdf"
                        placeholder="Upload Brochure Course (pdf)"
                        onChange={setBrochureFile}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <SelectField
                        label="Ownership type"
                        value={courseData.ownershipType}
                        options={[{value:"Private", label:"Private"}, {value:"Government", label:"Government"}, {value:"Semi-Government", label:"Semi-Government"}, {value:"Autonomous", label:"Autonomous"}]}
                        onChange={(val) => handleCourseChange("ownershipType", val)}
                        placeholder="Select ownership type"
                      />
                      <SelectField
                        label="College category"
                        value={courseData.collegeCategory}
                        options={[{value:"Engineering", label:"Engineering"}, {value:"Management", label:"Management"}, {value:"Medical", label:"Medical"}, {value:"Arts & Science", label:"Arts & Science"}]}
                        onChange={(val) => handleCourseChange("collegeCategory", val)}
                        placeholder="Select Category"
                      />
                    </div>

                    <div>
                      <SelectField
                        label="Affiliation type"
                        value={courseData.affiliationType}
                        options={[{value:"University Affiliated", label:"University Affiliated"}, {value:"Autonomous", label:"Autonomous"}, {value:"Deemed University", label:"Deemed University"}]}
                        onChange={(val) => handleCourseChange("affiliationType", val)}
                        placeholder="Select Affiliation type"
                      />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Placements</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <RadioGroup
                          label="Placement drives ?"
                          value={courseData.placementDrives}
                          onChange={(val) => handleCourseChange("placementDrives", val)}
                        />
                        <RadioGroup
                          label="Mock interviews ?"
                          value={courseData.mockInterviews}
                          onChange={(val) => handleCourseChange("mockInterviews", val)}
                        />
                        <RadioGroup
                          label="Resume building ?"
                          value={courseData.resumeBuilding}
                          onChange={(val) => handleCourseChange("resumeBuilding", val)}
                        />
                        <RadioGroup
                          label="Linked-in optimization ?"
                          value={courseData.linkedinOptimization}
                          onChange={(val) => handleCourseChange("linkedinOptimization", val)}
                        />
                        <RadioGroup
                          label="Access to exclusive job portal ?"
                          value={courseData.exclusiveJobPortal}
                          onChange={(val) => handleCourseChange("exclusiveJobPortal", val)}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Other questions</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <RadioGroup
                          label="Library ?"
                          value={courseData.library}
                          onChange={(val) => handleCourseChange("library", val)}
                        />
                        <RadioGroup
                          label="Hostel facility ?"
                          value={courseData.hostelFacility}
                          onChange={(val) => handleCourseChange("hostelFacility", val)}
                        />
                        <RadioGroup
                          label="Entrance exam ?"
                          value={courseData.entranceExam}
                          onChange={(val) => handleCourseChange("entranceExam", val)}
                        />
                        <RadioGroup
                          label="Management Quota ?"
                          value={courseData.managementQuota}
                          onChange={(val) => handleCourseChange("managementQuota", val)}
                        />
                        <RadioGroup
                          label="Playground ?"
                          value={courseData.playground}
                          onChange={(val) => handleCourseChange("playground", val)}
                        />
                        <RadioGroup
                          label="Bus service ?"
                          value={courseData.busService}
                          onChange={(val) => handleCourseChange("busService", val)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-center pt-15">
                      <button
                        onClick={handleSaveCourse}
                        disabled={loading}
                        className="w-full sm:w-auto px-16 py-4 bg-blue-800 text-white rounded-md hover:bg-blue-900 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 text-base font-semibold shadow-md"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
