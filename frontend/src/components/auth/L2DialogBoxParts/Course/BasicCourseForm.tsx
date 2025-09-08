"use client";

import InputField from "@/components/ui/InputField";
import SlidingIndicator from "@/components/ui/SlidingIndicator";
import type { Course } from "../../L2DialogBox";


interface BasicCourseFormProps {
  currentCourse: Course;
  handleCourseChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  courses: Course[];
  selectedCourseId: number;
}

export default function BasicCourseForm({
  currentCourse,
  handleCourseChange,
  setCourses,
  courses,
  selectedCourseId,
}: BasicCourseFormProps) {
  return (
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
  );
}
