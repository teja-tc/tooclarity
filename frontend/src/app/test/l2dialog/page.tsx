"use client";

import { useEffect, useState } from "react";
import L2DialogBox from "@/components/auth/L2DialogBox";
import CoachingCourseForm from "@/components/auth/L2DialogBoxParts/Course/CoachingCourseForm";
import UnderPostGraduateForm from "@/components/auth/L2DialogBoxParts/Course/UnderPostGraduateForm";
import type { Course } from "@/components/auth/L2DialogBox";

export default function L2DialogTestPage() {
  const [institutionType, setInstitutionType] = useState<string>("Coaching centers");
  const [flowType, setFlowType] = useState<string>("course"); // "course" | "branch"
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"inline-l2" | "raw-forms">("raw-forms");

  const [courses, setCourses] = useState<Course[]>([{
    id: 1,
    courseName: "",
    aboutCourse: "",
    courseDuration: "",
    startDate: "",
    endDate: "",
    mode: "Offline",
    priceOfCourse: "",
    location: "",
    image: null as File | null,
    imageUrl: "",
    imagePreviewUrl: "",
    brochureUrl: "",
    brochure: null as File | null,
    brochurePreviewUrl: "",
    graduationType: "",
    streamType: "",
    selectBranch: "",
    aboutBranch: "",
    educationType: "Full time",
    classSize: "",
    categoriesType: "",
    domainType: "",
    subDomainType: "",
    courseHighlights: "",
    seatingOption: "",
    openingTime: "",
    closingTime: "",
    operationalDays: [],
    totalSeats: "",
    availableSeats: "",
    pricePerSeat: "",
    hasWifi: "",
    hasChargingPoints: "",
    hasAC: "",
    hasPersonalLocker: "",
    eligibilityCriteria: "",
    tuitionType: "",
    instructorProfile: "",
    subject: "",
    createdBranch: "",
  }]);
  const selectedCourseId = 1;
  const currentCourse = courses[0];
  const courseErrors: Record<string,string> = {};

  const handleCourseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCourses(prev => prev.map(c => c.id === selectedCourseId ? { ...c, [name]: value } as Course : c));
  };

  // Keep localStorage in sync for L2DialogBox which reads these keys
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("institutionType", institutionType);
    localStorage.setItem("selected", flowType);
    setReady(true);
  }, [institutionType, flowType]);

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6 bg-gray-50">
      <h1 className="text-2xl font-semibold">L2DialogBox UI Test</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Institution Type</label>
          <select
            className="h-[44px] rounded-[10px] px-3 border border-gray-300 bg-white"
            value={institutionType}
            onChange={(e) => setInstitutionType(e.target.value)}
          >
            <option>Coaching centers</option>
            <option>Under Graduation/Post Graduation</option>
            <option>Kindergarten/childcare center</option>
            <option>School's</option>
            <option>Intermediate college(K12)</option>
            <option>Study Halls</option>
            <option>Tution Center's</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Flow Type</label>
          <select
            className="h-[44px] rounded-[10px] px-3 border border-gray-300 bg-white"
            value={flowType}
            onChange={(e) => setFlowType(e.target.value)}
          >
            <option value="course">Course</option>
            <option value="branch">Branch</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Render Mode</label>
          <select
            className="h-[44px] rounded-[10px] px-3 border border-gray-300 bg-white"
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
          >
            <option value="raw-forms">Raw forms (recommended)</option>
            <option value="inline-l2">Inline L2 container</option>
          </select>
        </div>
      </div>

      {/* Raw forms harness */}
      {ready && mode === "raw-forms" && (
        <div className="mt-6 bg-white rounded-xl border p-4">
          {institutionType === "Coaching centers" && (
            <CoachingCourseForm
              currentCourse={currentCourse}
              handleCourseChange={handleCourseChange}
              setCourses={setCourses}
              courses={courses}
              selectedCourseId={selectedCourseId}
              courseErrors={courseErrors}
              labelVariant='course'
            />
          )}
          {institutionType === "Under Graduation/Post Graduation" && (
            <UnderPostGraduateForm
              currentCourse={currentCourse}
              handleCourseChange={handleCourseChange}
              setCourses={setCourses}
              courses={courses}
              selectedCourseId={selectedCourseId}
              courseErrors={courseErrors}
              labelVariant='course'
            />
          )}
        </div>
      )}

      {/* Inline L2 container */}
      {ready && mode === "inline-l2" && (
        <L2DialogBox
          key={`${institutionType}-${flowType}`}
          trigger={null}
          open={undefined}
          onOpenChange={undefined}
          onSuccess={() => console.log("L2 success")}
          onPrevious={() => console.log("Back pressed")}
          renderMode="inline"
          mode="default"
          institutionId={"test"}
          initialSection={flowType as "course" | "branch"}
          overrideInstitutionType={institutionType}
          overrideSelected={flowType as "course" | "branch"}
          editMode
          existingCourseData={{
           courseName: "Test Course",
           aboutCourse: "Test description",
           courseDuration: "3 months",
           startDate: "",
           endDate: "",
           mode: "Offline",
           priceOfCourse: "10000",
           location: "https://example.com",
           imageUrl: "",
           brochureUrl: "",
           graduationType: "",
           streamType: "",
           selectBranch: "",
           aboutBranch: "",
           educationType: "Full time",
           classSize: "20",
           categoriesType: "",
           domainType: "",
           subDomainType: "",
           courseHighlights: "",
           seatingOption: "",
           openingTime: "",
           closingTime: "",
           operationalDays: [],
           totalSeats: "",
           availableSeats: "",
           pricePerSeat: "",
           hasWifi: "",
           hasChargingPoints: "",
           hasAC: "",
           hasPersonalLocker: "",
           tuitionType: "",
           instructorProfile: "",
           subject: "",
           createdBranch: "",
          }}
        />
      )}
    </div>
  );
}


