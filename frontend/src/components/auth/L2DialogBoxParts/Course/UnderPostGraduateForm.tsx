"use client";

import InputField from "@/components/ui/InputField";
import SlidingIndicator from "@/components/ui/SlidingIndicator";
import type { Course } from "../../L2DialogBox";

interface UnderPostGraduateFormProps {
  currentCourse: Course;
  handleCourseChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  courses: Course[];
  selectedCourseId: number;
}

export default function UnderPostGraduateForm({
  currentCourse,
  handleCourseChange,
  setCourses,
  courses,
  selectedCourseId,
}: UnderPostGraduateFormProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <InputField
        label="Graduation type"
        name="graduationType"
        value={currentCourse.graduationType}
        onChange={handleCourseChange}
        isSelect
        options={["Under Graduate", "Post Graduate", "Diploma", "Certificate"]}
        placeholder="Select graduation type"
      />

      <InputField
        label="Stream type"
        name="streamType"
        value={currentCourse.streamType}
        onChange={handleCourseChange}
        isSelect
        options={["Engineering", "Medical", "Commerce", "Arts", "Science", "Management", "Law"]}
        placeholder="Select Stream type"
      />

      <InputField
        label="Select branch"
        name="selectBranch"
        value={currentCourse.selectBranch}
        onChange={handleCourseChange}
        isSelect
        options={["Computer Science", "Mechanical", "Electrical", "Civil", "Electronics", "Chemical"]}
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
        <label className="font-medium text-[16px]">Education type</label>
        <SlidingIndicator
          options={["Full time", "part time", "Distance"] as const}
          activeOption={currentCourse.educationType}
          onOptionChange={(educationType) =>
            setCourses(
              courses.map((course) =>
                course.id === selectedCourseId ? { ...course, educationType } : course
              )
            )
          }
          size="md"
        />
      </div>

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
  );
}
