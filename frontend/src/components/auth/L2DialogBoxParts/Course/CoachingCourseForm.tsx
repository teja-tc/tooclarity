
"use client";

import InputField from "@/components/ui/InputField";
import SlidingIndicator from "@/components/ui/SlidingIndicator";
import { Course } from "../../L2DialogBox";



interface CoachingCourseFormProps {
  currentCourse: Course;
  handleCourseChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  courses: Course[];
  selectedCourseId: number;
  
}

export default function CoachingCourseForm({
  currentCourse,
  handleCourseChange,
  setCourses,
  courses,
  selectedCourseId,
}: CoachingCourseFormProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <InputField
        label="Categories type"
        name="categoriesType"
        value={currentCourse.categoriesType}
        onChange={handleCourseChange}
        isSelect
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
        isSelect
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
        <label className="font-medium text-[16px]">Mode</label>
        <SlidingIndicator
          options={["Offline", "Online", "Hybrid"] as const}
          activeOption={currentCourse.mode}
          onOptionChange={(mode) =>
            setCourses(
              courses.map((course) =>
                course.id === selectedCourseId ? { ...course, mode } : course
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
  );
}

