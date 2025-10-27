"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  _Dialog,
  _DialogContent,
  _DialogHeader,
  _DialogTitle,
  _DialogDescription,
  _DialogTrigger,
} from "@/components/ui/dialog";
import {
  _Card,
  _CardHeader,
  _CardTitle,
  _CardDescription,
  _CardContent,
  _CardFooter,
} from "@/components/ui/card";
import InputField from "@/components/ui/InputField";
import { Upload, Plus, MoreVertical } from "lucide-react";
import SlidingIndicator from "@/components/ui/SlidingIndicator";
//import CourseOrBranchSelection_Dialog from "./CourseOrBranchSelection_Dialog";
import { courseAPI, branchAPI } from "@/lib/api";
//import CoachingCourseForm from "./L2DialogBoxParts/Course/CoachingCourseForm";


interface L2DialogBoxProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
   onPrevious?: () => void; 
}

export default function L2DialogBox({
  trigger,
  open,
  onOpenChange,
  onSuccess,
  onPrevious
}: L2DialogBoxProps) {
  const router = useRouter();
  // const [institutionType, setInstitutionType] = useState<string | null>(null);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedType = localStorage.getItem("institutionType");
  //     setInstitutionType(storedType);
  //   }
  // }, []);

  const institutionType = localStorage.getItem("institutionType");
  const isUnderPostGraduate =
    institutionType === "Under Graduation/Post Graduation";
  const isCoachingCenter = institutionType === "Coaching centers";
  const isStudyHall = institutionType === "Study Halls";
  const isTutionCenter = institutionType === "Tution Center's";
  const isKindergarten = institutionType === "Kindergarten/childcare center";
  const isSchool = institutionType === "School";
  const isIntermediateCollege = institutionType === "Intermediate college(K12)";

  // Basic course form (only common fields) for these institution types
  const isBasicCourseForm = isKindergarten || isSchool || isIntermediateCollege;

  // Institution types that should skip L3DialogBox and go directly to dashboard
  const shouldSkipL3 = isStudyHall || isTutionCenter;

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "course" | "branch" | "Study Halls" | "Tuition Hall"
  >(isStudyHall ? "Study Halls" : isTutionCenter ? "Tuition Hall" : "course");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(1);
  const [showSelection_Dialog, setShowSelection_Dialog] = useState(false);

  // Get institution type from localStorage
  const [courses, setCourses] = useState([
    {
      id: 1,
      courseName: "",
      aboutCourse: "",
      courseDuration: "",
      mode: "Offline",
      priceOfCourse: "",
      location: "",
      image: null as File | null,
      brochure: null as File | null,
      // Additional fields for Under Graduate/Post graduate
      graduationType: "",
      streamType: "",
      selectBranch: "",
      aboutBranch: "",
      educationType: "Full time",
      classSize: "",
      // Additional fields for Coaching centers
      categoriesType: "",
      domainType: "",
      // Additional fields for Study Hall
      seatingOption: "",
      openingTime: "",
      closingTime: "",
      operationalDays: [] as string[],
      totalSeats: "",
      availableSeats: "",
      pricePerSeat: "",
      hasWifi: false,
      hasChargingPoints: false,
      hasAC: false,
      hasPersonalLocker: false,
      // Additional fields for Tuition Centers
      tuitionType: "",
      instructorProfile: "",
      subject: "",
    },
  ]);

  // Handle controlled open state
  const _DialogOpen = open !== undefined ? open : isOpen;
  const set_DialogOpen = onOpenChange || setIsOpen;

  // Show selection _Dialog when L2DialogBox opens (for all institution types)
  useEffect(() => {
    if (_DialogOpen) {
      setShowSelection_Dialog(true);
    }
  }, [_DialogOpen]);

  // Get current course
  const currentCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Branch state
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [branches, setBranches] = useState([
    {
      id: 1,
      branchName: "",
      branchAddress: "",
      contactInfo: "",
      locationUrl: "",
    },
  ]);

  // Get current branch
  const currentBranch =
    branches.find((b) => b.id === selectedBranchId) || branches[0];

  type UploadField = {
    label: string;
    type: "image" | "brochure";
    accept: string;
  };

  const uploadFields: UploadField[] = [
    { label: "Add Image", type: "image", accept: "image/jpeg,image/jpg" },
    { label: "Add Brochure", type: "brochure", accept: "application/pdf" },
  ];

  // Handlers
  const handleCourseChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === selectedCourseId
          ? { ...course, [e.target.name]: e.target.value }
          : course
      )
    );
  };

  const handleBranchChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setBranches(
      branches.map((branch) =>
        branch.id === selectedBranchId
          ? { ...branch, [e.target.name]: e.target.value }
          : branch
      )
    );
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "image" | "brochure"
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      setCourses(
        courses.map((course) =>
          course.id === selectedCourseId
            ? { ...course, [type]: files[0] }
            : course
        )
      );
    }
  };

  const handleOperationalDayChange = (day: string) => {
    setCourses(
      courses.map((course) =>
        course.id === selectedCourseId
          ? {
              ...course,
              operationalDays: course.operationalDays.includes(day)
                ? course.operationalDays.filter((d) => d !== day)
                : [...course.operationalDays, day],
            }
          : course
      )
    );
  };

  const handleSelection_DialogChoice = (selection: "course" | "branch") => {
    if (selection === "branch") {
      setActiveTab("branch");
    } else {
      setActiveTab(
        isStudyHall ? "Study Halls" : isTutionCenter ? "Tuition Hall" : "course"
      );
    }
  };

  const addNewCourse = () => {
    const newId = Math.max(...courses.map((c) => c.id)) + 1;
    const newCourse = {
      id: newId,
      courseName: "",
      aboutCourse: "",
      courseDuration: "",
      mode: "Offline",
      priceOfCourse: "",
      location: "",
      image: null as File | null,
      brochure: null as File | null,
      // Additional fields for Under Graduate/Post graduate
      graduationType: "",
      streamType: "",
      selectBranch: "",
      aboutBranch: "",
      educationType: "Full time",
      classSize: "",
      // Additional fields for Coaching centers
      categoriesType: "",
      domainType: "",
      // Additional fields for Study Hall
      seatingOption: "",
      openingTime: "",
      closingTime: "",
      operationalDays: [] as string[],
      totalSeats: "",
      availableSeats: "",
      pricePerSeat: "",
      hasWifi: false,
      hasChargingPoints: false,
      hasAC: false,
      hasPersonalLocker: false,
      // Additional fields for Tuition Centers
      tuitionType: "",
      instructorProfile: "",
      subject: "",
    };
    setCourses([...courses, newCourse]);
    setSelectedCourseId(newId);
  };

  const deleteCourse = (courseId: number) => {
    if (courses.length > 1) {
      const updatedCourses = courses.filter((c) => c.id !== courseId);
      setCourses(updatedCourses);
      if (selectedCourseId === courseId) {
        setSelectedCourseId(updatedCourses[0].id);
      }
    }
  };

  const addNewBranch = () => {
    const newId = Math.max(...branches.map((b) => b.id)) + 1;
    const newBranch = {
      id: newId,
      branchName: "",
      branchAddress: "",
      contactInfo: "",
      locationUrl: "",
    };
    setBranches([...branches, newBranch]);
    setSelectedBranchId(newId);
  };

  const deleteBranch = (branchId: number) => {
    if (branches.length > 1) {
      const updatedBranches = branches.filter((b) => b.id !== branchId);
      setBranches(updatedBranches);
      if (selectedBranchId === branchId) {
        setSelectedBranchId(updatedBranches[0].id);
      }
    }
  };

  const validateCourses = () => {
    const requiredFields = [
      "courseName",
      "courseDuration",
      "priceOfCourse",
      "location",
    ];

    for (const course of courses) {
      for (const field of requiredFields) {
        if (
          !course[field as keyof typeof course] ||
          String(course[field as keyof typeof course]).trim() === ""
        ) {
          return `Please fill in the ${field} field for course: ${
            course.courseName || "Unnamed course"
          }`;
        }
      }

      // Additional validation for specific institution types
      if (isUnderPostGraduate) {
        if (
          !course.graduationType ||
          !course.streamType ||
          !course.selectBranch
        ) {
          return `Please fill in all graduation details for course: ${course.courseName}`;
        }
      }

      if (isCoachingCenter) {
        if (!course.categoriesType || !course.domainType) {
          return `Please fill in all coaching details for course: ${course.courseName}`;
        }
      }

      if (isStudyHall) {
        if (
          !course.openingTime ||
          !course.closingTime ||
          !course.totalSeats ||
          !course.availableSeats
        ) {
          return `Please fill in all study hall details for: ${course.courseName}`;
        }
      }

      if (isTutionCenter) {
        if (
          !course.tuitionType ||
          !course.instructorProfile ||
          !course.subject ||
          !course.openingTime ||
          !course.closingTime ||
          !course.totalSeats ||
          !course.availableSeats
        ) {
          return `Please fill in all tuition center details for: ${course.courseName}`;
        }
      }

      // Basic course form types (Kindergarten, School, Intermediate college) only need common fields
      // No additional validation needed for these types
    }

    return null;
  };

  const handleCourseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate courses before submission
    const validationError = validateCourses();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Send all courses to the backend
      console.log("Sending courses data:", courses);

      const response = await courseAPI.createCourses(courses);

      if (response.success) {
        console.log("Courses created successfully:", response.data);

        // Always switch to branch tab after submission
        setActiveTab("branch");

        // Reset course form
        setCourses([
          {
            id: 1,
            courseName: "",
            aboutCourse: "",
            courseDuration: "",
            mode: "Offline",
            priceOfCourse: "",
            location: "",
            image: null,
            brochure: null,
            graduationType: "",
            streamType: "",
            selectBranch: "",
            aboutBranch: "",
            educationType: "Full time",
            classSize: "",
            categoriesType: "",
            domainType: "",
            seatingOption: "",
            openingTime: "",
            closingTime: "",
            operationalDays: [] as string[],
            totalSeats: "",
            availableSeats: "",
            pricePerSeat: "",
            hasWifi: false,
            hasChargingPoints: false,
            hasAC: false,
            hasPersonalLocker: false,
            // Additional fields for Tuition Centers
            tuitionType: "",
            instructorProfile: "",
            subject: "",
          },
        ]);
        setSelectedCourseId(1);
      } else {
        throw new Error(response.message || "Failed to create courses");
      }
    } catch (error) {
      console.error("Error saving courses:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save course details. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const validateBranches = () => {
    const requiredFields = [
      "branchName",
      "branchAddress",
      "contactInfo",
      "locationUrl",
    ];

    for (const branch of branches) {
      for (const field of requiredFields) {
        if (
          !branch[field as keyof typeof branch] ||
          String(branch[field as keyof typeof branch]).trim() === ""
        ) {
          return `Please fill in the ${field} field for branch: ${
            branch.branchName || "Unnamed branch"
          }`;
        }
      }

      // Validate contact number format
      if (branch.contactInfo && !/^\d{10}$/.test(branch.contactInfo)) {
        return `Please enter a valid 10-digit contact number for branch: ${branch.branchName}`;
      }
    }

    return null;
  };

  

  const handleBranchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate branches before submission
    const validationError = validateBranches();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Send all branches to the backend
      console.log("Sending branches data:", branches);

      const response = await branchAPI.createBranches(branches);

      if (response.success) {
        console.log("Branches created successfully:", response.data);
      } else {
        throw new Error(response.message || "Failed to create branches");
      }

      // Close _Dialog and handle next step based on institution type
      set_DialogOpen(false);

      // For Study Halls and Tution Centers, redirect directly to dashboard
      if (shouldSkipL3) {
        router.push("/dashboard");
      } else {
        // For other institution types, proceed to L3DialogBox
        onSuccess?.();
      }

      // Reset forms
      setCourses([
        {
          id: 1,
          courseName: "",
          aboutCourse: "",
          courseDuration: "",
          mode: "Offline",
          priceOfCourse: "",
          location: "",
          image: null,
          brochure: null,
          // Additional fields for Under Graduate/Post graduate
          graduationType: "",
          streamType: "",
          selectBranch: "",
          aboutBranch: "",
          educationType: "Full time",
          classSize: "",
          // Additional fields for Coaching centers
          categoriesType: "",
          domainType: "",
          // Additional fields for Study Hall
          seatingOption: "",
          openingTime: "",
          closingTime: "",
          operationalDays: [] as string[],
          totalSeats: "",
          availableSeats: "",
          pricePerSeat: "",
          hasWifi: false,
          hasChargingPoints: false,
          hasAC: false,
          hasPersonalLocker: false,
          // Additional fields for Tuition Centers
          tuitionType: "",
          instructorProfile: "",
          subject: "",
        },
      ]);
      setSelectedCourseId(1);
      setBranches([
        {
          id: 1,
          branchName: "",
          branchAddress: "",
          contactInfo: "",
          locationUrl: "",
        },
      ]);
      setSelectedBranchId(1);
      setActiveTab(
        isStudyHall ? "Study Halls" : isTutionCenter ? "Tuition Hall" : "course"
      );
    } catch (error) {
      console.error("Error saving branch:", error);
      alert("Failed to save branch details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <_Dialog open={_DialogOpen} onOpenChange={set_DialogOpen}>
        {trigger && <_DialogTrigger asChild>{trigger}</_DialogTrigger>}

        <_DialogContent
          className="w-[95vw] sm:w-[90vw] md:w-[800px] lg:w-[900px] xl:max-w-4xl scrollbar-hide"
          showCloseButton={false}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {/* Tabs - Outside the card */}
          <div className="mx-auto max-w-md mb-6">
            <SlidingIndicator
              options={
                [
                  isStudyHall
                    ? "Study Halls"
                    : isTutionCenter
                    ? "Tuition Hall"
                    : "course",
                  "branch",
                ] as const
              }
              activeOption={activeTab}
              onOptionChange={setActiveTab}
              size="md"
            />
          </div>

          <_Card className="w-full sm:p-6 rounded-[24px] bg-white border-0 shadow-none">
            <_CardContent className="space-y-6">
              {/* Course Form */}
              {(activeTab === "course" ||
                activeTab === "Study Halls" ||
                activeTab === "Tuition Hall") && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold">
                      {isStudyHall
                        ? "Study Hall"
                        : isTutionCenter
                        ? "Tuition Hall"
                        : "Course Details"}
                    </h3>
                    <p className="text-[#697282] text-sm">
                      {isStudyHall
                        ? "Enter the details of the study hall."
                        : isTutionCenter
                        ? "Enter the details of the tuition hall."
                        : "Enter the courses your institution offers."}
                    </p>
                  </div>

                  {/* Course Tabs */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      {courses.map((course) => (
                        <div key={course.id} className="flex items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setSelectedCourseId(course.id)}
                            className={`px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2 ${
                              selectedCourseId === course.id
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span>
                              {course.courseName ||
                                (isStudyHall
                                  ? `Hall ${course.id}`
                                  : isTutionCenter
                                  ? `Hall ${course.id}`
                                  : `Course ${course.id}`)}
                            </span>
                            {courses.length > 1 && (
                              <MoreVertical
                                size={14}
                                className="text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteCourse(course.id);
                                }}
                              />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={addNewCourse}
                      className="bg-[#0222D7] hover:bg-[#0222D7]/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Plus size={16} />
                      {isStudyHall
                        ? "Add Hall"
                        : isTutionCenter
                        ? "Add Hall"
                        : "Add Course"}
                    </Button>
                  </div>

                  <form onSubmit={handleCourseSubmit} className="space-y-6">
                    {isCoachingCenter ? (
                      // Coaching centers form fields
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField
                          label="Categories type"
                          name="categoriesType"
                          value={currentCourse.categoriesType}
                          onChange={handleCourseChange}
                          isSelect={true}
                          options={[
                            "Academic",
                            "Competitive Exam",
                            "Professional",
                            "Skill Development",
                            "Language",
                            "Arts & Crafts",
                            "Sports",
                            "Music & Dance",
                          ]}
                          placeholder="Select Categories type"
                          required
                        />

                        <InputField
                          label="Domain type"
                          name="domainType"
                          value={currentCourse.domainType}
                          onChange={handleCourseChange}
                          isSelect={true}
                          options={[
                            "Engineering",
                            "Medical",
                            "Management",
                            "Law",
                            "Banking",
                            "Government Jobs",
                            "IT & Software",
                            "Design",
                            "Marketing",
                            "Finance",
                          ]}
                          placeholder="Select domain type"
                          required
                        />

                        <InputField
                          label="Course name"
                          name="courseName"
                          value={currentCourse.courseName}
                          onChange={handleCourseChange}
                          placeholder="Enter course name"
                          required
                        />

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Mode
                          </label>
                          <SlidingIndicator
                            options={["Offline", "Online", "Hybrid"] as const}
                            activeOption={currentCourse.mode}
                            onOptionChange={(mode) =>
                              setCourses(
                                courses.map((course) =>
                                  course.id === selectedCourseId
                                    ? { ...course, mode }
                                    : course
                                )
                              )
                            }
                            size="md"
                            
                          />
                        </div>
                        

                        <InputField
                          label="Course Duration"
                          name="courseDuration"
                          value={currentCourse.courseDuration}
                          onChange={handleCourseChange}
                          placeholder="e.g, 3 months"
                          required
                        />

                        <InputField
                          label="Price of Course"
                          name="priceOfCourse"
                          value={currentCourse.priceOfCourse}
                          onChange={handleCourseChange}
                          placeholder="Enter Course price"
                          type="number"
                          required
                        />

                        <InputField
                          label="Location"
                          name="location"
                          value={currentCourse.location}
                          onChange={handleCourseChange}
                          placeholder="Enter Place name"
                          required
                        />

                        <InputField
                          label="Class size"
                          name="classSize"
                          value={currentCourse.classSize}
                          onChange={handleCourseChange}
                          placeholder="Enter no of students per class"
                          type="number"
                        />
                      </div>
                    ) : isStudyHall ? (
                      // Study Hall form fields
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField
                          label="Seating option"
                          name="seatingOption"
                          value={currentCourse.seatingOption}
                          onChange={handleCourseChange}
                          isSelect={true}
                          options={[
                            "Individual Desk",
                            "Shared Table",
                            "Private Cabin",
                            "Open Seating",
                          ]}
                          placeholder="Select seating option"
                        />

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Operational Time&apos;s
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="time"
                              name="openingTime"
                              value={currentCourse.openingTime}
                              onChange={handleCourseChange}
                              placeholder="Opening time"
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            />
                            <input
                              type="time"
                              name="closingTime"
                              value={currentCourse.closingTime}
                              onChange={handleCourseChange}
                              placeholder="Closing time"
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Operational Day&apos;s
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map(
                              (day) => (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() =>
                                    handleOperationalDayChange(day)
                                  }
                                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                                    currentCourse.operationalDays.includes(day)
                                      ? "bg-blue-50 border-blue-200 text-blue-700"
                                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {day}
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Total Seats
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              name="totalSeats"
                              value={currentCourse.totalSeats}
                              onChange={handleCourseChange}
                              placeholder="Total seats"
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            />
                            <input
                              type="number"
                              name="availableSeats"
                              value={currentCourse.availableSeats}
                              onChange={handleCourseChange}
                              placeholder="Available seats"
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            />
                          </div>
                        </div>

                        <InputField
                          label="Price of the Seat"
                          name="pricePerSeat"
                          value={currentCourse.pricePerSeat}
                          onChange={handleCourseChange}
                          placeholder="Enter price per seat"
                          type="number"
                        />

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Add Image
                          </label>
                          <label className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors">
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              {currentCourse.image
                                ? (currentCourse.image as File).name
                                : "Upload Course Image (jpg / jpeg)"}
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "image")}
                            />
                          </label>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Wi-fi ?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="hasWifi"
                                checked={currentCourse.hasWifi === true}
                                onChange={() =>
                                  setCourses(
                                    courses.map((course) =>
                                      course.id === selectedCourseId
                                        ? { ...course, hasWifi: true }
                                        : course
                                    )
                                  )
                                }
                                className="text-blue-600"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="hasWifi"
                                checked={currentCourse.hasWifi === false}
                                onChange={() =>
                                  setCourses(
                                    courses.map((course) =>
                                      course.id === selectedCourseId
                                        ? { ...course, hasWifi: false }
                                        : course
                                    )
                                  )
                                }
                                className="text-blue-600"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Charging Points ?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="hasChargingPoints"
                                checked={
                                  currentCourse.hasChargingPoints === true
                                }
                                onChange={() =>
                                  setCourses(
                                    courses.map((course) =>
                                      course.id === selectedCourseId
                                        ? { ...course, hasChargingPoints: true }
                                        : course
                                    )
                                  )
                                }
                                className="text-blue-600"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="hasChargingPoints"
                                checked={
                                  currentCourse.hasChargingPoints === false
                                }
                                onChange={() =>
                                  setCourses(
                                    courses.map((course) =>
                                      course.id === selectedCourseId
                                        ? {
                                            ...course,
                                            hasChargingPoints: false,
                                          }
                                        : course
                                    )
                                  )
                                }
                                className="text-blue-600"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Air Conditioner (AC) ?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="hasAC"
                                checked={currentCourse.hasAC === true}
                                onChange={() =>
                                  setCourses(
                                    courses.map((course) =>
                                      course.id === selectedCourseId
                                        ? { ...course, hasAC: true }
                                        : course
                                    )
                                  )
                                }
                                className="text-blue-600"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="hasAC"
                                checked={currentCourse.hasAC === false}
                                onChange={() =>
                                  setCourses(
                                    courses.map((course) =>
                                      course.id === selectedCourseId
                                        ? { ...course, hasAC: false }
                                        : course
                                    )
                                  )
                                }
                                className="text-blue-600"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Personal Locker&apos;s ?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="hasPersonalLocker"
                                checked={
                                  currentCourse.hasPersonalLocker === true
                                }
                                onChange={() =>
                                  setCourses(
                                    courses.map((course) =>
                                      course.id === selectedCourseId
                                        ? { ...course, hasPersonalLocker: true }
                                        : course
                                    )
                                  )
                                }
                                className="text-blue-600"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="hasPersonalLocker"
                                checked={
                                  currentCourse.hasPersonalLocker === false
                                }
                                onChange={() =>
                                  setCourses(
                                    courses.map((course) =>
                                      course.id === selectedCourseId
                                        ? {
                                            ...course,
                                            hasPersonalLocker: false,
                                          }
                                        : course
                                    )
                                  )
                                }
                                className="text-blue-600"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : isTutionCenter ? (
                      // Tuition Center form fields
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField
                          label="Tuition type"
                          name="tuitionType"
                          value={currentCourse.tuitionType}
                          onChange={handleCourseChange}
                          isSelect={true}
                          options={["Individual", "Group", "Online", "Hybrid"]}
                          placeholder="Select tuition type"
                        />

                        <InputField
                          label="Instructor Profile"
                          name="instructorProfile"
                          value={currentCourse.instructorProfile}
                          onChange={handleCourseChange}
                          placeholder="Instructor name"
                        />

                        <InputField
                          label="Subject"
                          name="subject"
                          value={currentCourse.subject}
                          onChange={handleCourseChange}
                          placeholder="Enter subject name"
                        />

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Total Seats
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              name="totalSeats"
                              value={currentCourse.totalSeats}
                              onChange={handleCourseChange}
                              placeholder="Total seats"
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            />
                            <input
                              type="number"
                              name="availableSeats"
                              value={currentCourse.availableSeats}
                              onChange={handleCourseChange}
                              placeholder="Available seats"
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Operational Day&apos;s
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map(
                              (day) => (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() =>
                                    handleOperationalDayChange(day)
                                  }
                                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                                    currentCourse.operationalDays.includes(day)
                                      ? "bg-blue-50 border-blue-200 text-blue-700"
                                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {day}
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Operational Time&apos;s
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="time"
                              name="openingTime"
                              value={currentCourse.openingTime}
                              onChange={handleCourseChange}
                              placeholder="Opening time"
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            />
                            <input
                              type="time"
                              name="closingTime"
                              value={currentCourse.closingTime}
                              onChange={handleCourseChange}
                              placeholder="Closing time"
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                            />
                          </div>
                        </div>

                        <InputField
                          label="Price of the Seat"
                          name="pricePerSeat"
                          value={currentCourse.pricePerSeat}
                          onChange={handleCourseChange}
                          placeholder="Enter price per seat"
                          type="number"
                        />

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Add Image
                          </label>
                          <label className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors">
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              {currentCourse.image
                                ? (currentCourse.image as File).name
                                : "Upload Course Image (jpg / jpeg)"}
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "image")}
                            />
                          </label>
                        </div>
                      </div>
                    ) : isUnderPostGraduate ? (
                      // Under Graduate/Post graduate form fields
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField
                          label="Graduation type"
                          name="graduationType"
                          value={currentCourse.graduationType}
                          onChange={handleCourseChange}
                          isSelect={true}
                          options={[
                            "Under Graduate",
                            "Post Graduate",
                            "Diploma",
                            "Certificate",
                          ]}
                          placeholder="Select graduation type"
                        />

                        <InputField
                          label="Stream type"
                          name="streamType"
                          value={currentCourse.streamType}
                          onChange={handleCourseChange}
                          isSelect={true}
                          options={[
                            "Engineering",
                            "Medical",
                            "Commerce",
                            "Arts",
                            "Science",
                            "Management",
                            "Law",
                          ]}
                          placeholder="Select Stream type"
                        />

                        <InputField
                          label="Select branch"
                          name="selectBranch"
                          value={currentCourse.selectBranch}
                          onChange={handleCourseChange}
                          isSelect={true}
                          options={[
                            "Computer Science",
                            "Mechanical",
                            "Electrical",
                            "Civil",
                            "Electronics",
                            "Chemical",
                          ]}
                          placeholder="Select branch type"
                        />

                        <InputField
                          label="About branch"
                          name="aboutBranch"
                          value={currentCourse.aboutBranch}
                          onChange={handleCourseChange}
                          placeholder="Enter the course info"
                        />

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Education type
                          </label>
                          <SlidingIndicator
                            options={
                              ["Full time", "part time", "Distance"] as const
                            }
                            activeOption={currentCourse.educationType}
                            onOptionChange={(educationType) =>
                              setCourses(
                                courses.map((course) =>
                                  course.id === selectedCourseId
                                    ? { ...course, educationType }
                                    : course
                                )
                              )
                            }
                            size="md"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Mode
                          </label>
                          <SlidingIndicator
                            options={["Offline", "Online", "Hybrid"] as const}
                            activeOption={currentCourse.mode}
                            onOptionChange={(mode) =>
                              setCourses(
                                courses.map((course) =>
                                  course.id === selectedCourseId
                                    ? { ...course, mode }
                                    : course
                                )
                              )
                            }
                            size="md"
                          />
                        </div>

                        <InputField
                          label="Course Duration"
                          name="courseDuration"
                          value={currentCourse.courseDuration}
                          onChange={handleCourseChange}
                          placeholder="e.g, 3 months"
                        />

                        <InputField
                          label="Price of Course"
                          name="priceOfCourse"
                          value={currentCourse.priceOfCourse}
                          onChange={handleCourseChange}
                          placeholder="Enter Course price"
                          type="number"
                        />

                        <InputField
                          label="Location"
                          name="location"
                          value={currentCourse.location}
                          onChange={handleCourseChange}
                          placeholder="Enter Place name"
                        />

                        <InputField
                          label="Class size"
                          name="classSize"
                          value={currentCourse.classSize}
                          onChange={handleCourseChange}
                          placeholder="Enter no of students per class"
                          type="number"
                        />
                      </div>
                    ) : isBasicCourseForm ? (
                      // Basic form fields for Kindergarten, School, Intermediate College
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField
                          label="Course Name"
                          name="courseName"
                          value={currentCourse.courseName}
                          onChange={handleCourseChange}
                          placeholder="Enter Course name"
                          required
                        />
                        <InputField
                          label="About Course"
                          name="aboutCourse"
                          value={currentCourse.aboutCourse}
                          onChange={handleCourseChange}
                          placeholder="Enter the course info"
                          required
                        />

                        <InputField
                          label="Course Duration"
                          name="courseDuration"
                          value={currentCourse.courseDuration}
                          onChange={handleCourseChange}
                          placeholder="e.g, 3 months"
                          required
                        />

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Mode
                          </label>
                          <SlidingIndicator
                            options={["Offline", "Online", "Hybrid"] as const}
                            activeOption={currentCourse.mode}
                            onOptionChange={(mode) =>
                              setCourses(
                                courses.map((course) =>
                                  course.id === selectedCourseId
                                    ? { ...course, mode }
                                    : course
                                )
                              )
                            }
                            size="md"
                          />
                        </div>

                        <InputField
                          label="Price of Course"
                          name="priceOfCourse"
                          value={currentCourse.priceOfCourse}
                          onChange={handleCourseChange}
                          placeholder="Enter Course price"
                          type="number"
                          required
                        />
                        <InputField
                          label="Location"
                          name="location"
                          value={currentCourse.location}
                          onChange={handleCourseChange}
                          placeholder="Enter Place name"
                          required
                        />
                      </div>
                    ) : (
                      // Fallback: Basic form for any other institution types
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField
                          label="Course Name"
                          name="courseName"
                          value={currentCourse.courseName}
                          onChange={handleCourseChange}
                          placeholder="Enter Course name"
                          required
                        />
                        <InputField
                          label="About Course"
                          name="aboutCourse"
                          value={currentCourse.aboutCourse}
                          onChange={handleCourseChange}
                          placeholder="Enter the course info"
                          required
                        />

                        <InputField
                          label="Course Duration"
                          name="courseDuration"
                          value={currentCourse.courseDuration}
                          onChange={handleCourseChange}
                          placeholder="e.g, 3 months"
                          required
                        />

                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            Mode
                          </label>
                          <SlidingIndicator
                            options={["Offline", "Online", "Hybrid"] as const}
                            activeOption={currentCourse.mode}
                            onOptionChange={(mode) =>
                              setCourses(
                                courses.map((course) =>
                                  course.id === selectedCourseId
                                    ? { ...course, mode }
                                    : course
                                )
                              )
                            }
                            size="md"
                          />
                        </div>

                        <InputField
                          label="Price of Course"
                          name="priceOfCourse"
                          value={currentCourse.priceOfCourse}
                          onChange={handleCourseChange}
                          placeholder="Enter Course price"
                          type="number"
                          required
                        />
                        <InputField
                          label="Location"
                          name="location"
                          value={currentCourse.location}
                          onChange={handleCourseChange}
                          placeholder="Enter Place name"
                          required
                        />
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {uploadFields.map((f) => (
                        <div key={f.type} className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            {f.label}
                          </label>
                          <label className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors">
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              {currentCourse[f.type]
                                ? (currentCourse[f.type] as File).name
                                : f.type === "image"
                                ? "Upload Course Image (jpg / jpeg)"
                                : "Upload Brochure Course (pdf)"}
                            </span>
                            <input
                              type="file"
                              accept={f.accept}
                              className="hidden"
                              onChange={(e) => handleFileChange(e, f.type)}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  <div className="flex justify-center gap-10">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrevious}
          className="w-[314px] h-[48px] border border-[#697282] text-[#697282] rounded-[12px] font-semibold text-[18px] leading-[22px] flex items-center justify-center shadow-inner"
        >
          Previous
        </button>

        {/* Save & Next Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-[314px] h-[48px] rounded-[12px] font-semibold transition-colors 
            ${isLoading ? "opacity-50 cursor-not-allowed bg-gray-600" : "bg-[#6B7280] hover:bg-[#6B7280]/90"} 
            text-white flex items-center justify-center`}
        >
          {isLoading ? "Saving..." : "Save & Next"}
        </button>
      </div>
                  </form>
                </div>
              )}

              {/* Branch Form */}
              {activeTab === "branch" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold">
                      Branch Details
                    </h3>
                    <p className="text-[#697282] text-sm">
                      here information about your institution&apos;s branches.
                    </p>
                  </div>

                  {/* Branch Tabs */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      {branches.map((branch) => (
                        <div key={branch.id} className="flex items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setSelectedBranchId(branch.id)}
                            className={`px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2 ${
                              selectedBranchId === branch.id
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span>
                              {branch.branchName || `Branch ${branch.id}`}
                            </span>
                            {branches.length > 1 && (
                              <MoreVertical
                                size={14}
                                className="text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBranch(branch.id);
                                }}
                              />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={addNewBranch}
                      className="bg-[#0222D7] hover:bg-[#0222D7]/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Branch
                    </Button>
                  </div>
                  <form onSubmit={handleBranchSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField
                        label="Branch Name"
                        name="branchName"
                        value={currentBranch.branchName}
                        onChange={handleBranchChange}
                        placeholder="Enter Course name"
                        required
                      />
                      <InputField
                        label="Contact info"
                        name="contactInfo"
                        value={currentBranch.contactInfo}
                        onChange={handleBranchChange}
                        placeholder="+91 00000 0000"
                        type="tel"
                        numericOnly
                        pattern="[0-9]*"
                        maxLength={10}
                        required
                      />
                      <InputField
                        label="Branch address"
                        name="branchAddress"
                        value={currentBranch.branchAddress}
                        onChange={handleBranchChange}
                        placeholder="Enter address"
                        required
                      />
                      <InputField
                        label="Location URL"
                        name="locationUrl"
                        value={currentBranch.locationUrl}
                        onChange={handleBranchChange}
                        placeholder="Paste the URL"
                        required
                      />
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full max-w-[400px] h-[48px] rounded-[12px] font-semibold transition-colors
        ${
          isLoading
            ? "opacity-50 cursor-not-allowed bg-gray-600"
            : "bg-[#6B7280] hover:bg-[#6B7280]/90"
        } text-white`}
                      >
                        {isLoading ? "Saving..." : "Add Branch"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </_CardContent>
          </_Card>
        </_DialogContent>
      </_Dialog>

      {/* Course or Branch Selection _Dialog */}
      {/* <CourseOrBranchSelection_Dialog
        open={showSelection_Dialog}
        onOpenChange={setShowSelection_Dialog}
        onSelection={handleSelection_DialogChoice}
      /> */}
    </>
  );
}

