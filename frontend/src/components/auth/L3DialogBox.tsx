"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import InputField from "@/components/ui/InputField";
import { Clock } from "lucide-react";
import { institutionDetailsAPI, clearInstitutionData } from "@/lib/api";

interface L3DialogBoxProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormData {
  schoolType: string;
  curriculumType: string;
  openingTime: string;
  closingTime: string;
  operationalDays: string[];
  extendedCare: string;
  mealsProvided: string;
  outdoorPlayArea: string;
}

interface SchoolFormData {
  schoolType: string;
  schoolCategory: string;
  curriculumType: string;
  operationalDays: string[];
  otherActivities: string;
  hostelFacility: string;
  playground: string;
  busService: string;
}

interface CoachingFormData {
  placementDrives: string;
  mockInterviews: string;
  resumeBuilding: string;
  linkedinOptimization: string;
  exclusiveJobPortal: string;
  certification: string;
}

interface IntermediateFormData {
  collegeType: string;
  collegeCategory: string;
  curriculumType: string;
  operationalDays: string[];
  otherActivities: string;
  hostelFacility: string;
  playground: string;
  busService: string;
}

interface UndergraduateFormData {
  ownershipType: string;
  collegeCategory: string;
  affiliationType: string;
  placementDrives: string;
  mockInterviews: string;
  resumeBuilding: string;
  linkedinOptimization: string;
  exclusiveJobPortal: string;
  library: string;
  hostelFacility: string;
  entranceExam: string;
  managementQuota: string;
  playground: string;
  busService: string;
}

export default function L3DialogBox({
  trigger,
  open,
  onOpenChange,
  onSuccess,
}: L3DialogBoxProps) {
  const router = useRouter();
  // const [institutionType, setInstitutionType] = useState<string | null>(null);const response = await courseAPI.createCourses(courses);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedType = localStorage.getItem("institutionType");
  //     setInstitutionType(storedType);
  //   }
  // }, []);

  const institutionType = localStorage.getItem("institutionType");
  // Check institution types - default to kindergarten if no type is set
  const isKindergarten =
    institutionType === "Kindergarten/childcare center" ||
    institutionType === null;
  const isSchool = institutionType === "School's";
  const isCoaching = institutionType === "Coaching centers";
  const isIntermediate = institutionType === "Intermediate college(K12)";
  const isUndergraduate =
    institutionType === "Under Graduation/Post Graduation";

  const [formData, setFormData] = useState<FormData>({
    schoolType: "",
    curriculumType: "",
    openingTime: "",
    closingTime: "",
    operationalDays: [],
    extendedCare: "",
    mealsProvided: "",
    outdoorPlayArea: "",
  });

  const [schoolFormData, setSchoolFormData] = useState<SchoolFormData>({
    schoolType: "",
    schoolCategory: "",
    curriculumType: "",
    operationalDays: [],
    otherActivities: "",
    hostelFacility: "",
    playground: "",
    busService: "",
  });

  const [coachingFormData, setCoachingFormData] = useState<CoachingFormData>({
    placementDrives: "",
    mockInterviews: "",
    resumeBuilding: "",
    linkedinOptimization: "",
    exclusiveJobPortal: "",
    certification: "",
  });

  const [collegeFormData, setCollegeFormData] = useState<IntermediateFormData>({
    collegeType: "",
    collegeCategory: "",
    curriculumType: "",
    operationalDays: [],
    otherActivities: "",
    hostelFacility: "",
    playground: "",
    busService: "",
  });

  const [undergraduateFormData, setUndergraduateFormData] =
    useState<UndergraduateFormData>({
      ownershipType: "",
      collegeCategory: "",
      affiliationType: "",
      placementDrives: "",
      mockInterviews: "",
      resumeBuilding: "",
      linkedinOptimization: "",
      exclusiveJobPortal: "",
      library: "",
      hostelFacility: "",
      entranceExam: "",
      managementQuota: "",
      playground: "",
      busService: "",
    });

  // Handle controlled open state
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOperationalDayChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      operationalDays: prev.operationalDays.includes(day)
        ? prev.operationalDays.filter((d) => d !== day)
        : [...prev.operationalDays, day],
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchoolChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSchoolFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchoolOperationalDayChange = (day: string) => {
    setSchoolFormData((prev) => ({
      ...prev,
      operationalDays: prev.operationalDays.includes(day)
        ? prev.operationalDays.filter((d) => d !== day)
        : [...prev.operationalDays, day],
    }));
  };

  const handleSchoolRadioChange = (name: string, value: string) => {
    setSchoolFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoachingRadioChange = (name: string, value: string) => {
    setCoachingFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollegeChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCollegeFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollegeOperationalDayChange = (day: string) => {
    setCollegeFormData((prev) => ({
      ...prev,
      operationalDays: prev.operationalDays.includes(day)
        ? prev.operationalDays.filter((d) => d !== day)
        : [...prev.operationalDays, day],
    }));
  };

  const handleCollegeRadioChange = (name: string, value: string) => {
    setCollegeFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUndergraduateChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUndergraduateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUndergraduateRadioChange = (name: string, value: string) => {
    setUndergraduateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert Yes/No values to boolean before sending to backend
      const formDataWithBooleans = {
        ...formData,
        extendedCare: formData.extendedCare === "Yes",
        mealsProvided: formData.mealsProvided === "Yes",
        outdoorPlayArea: formData.outdoorPlayArea === "Yes",
      };

      const response = await institutionDetailsAPI.createInstitutionDetails(
        formDataWithBooleans
      );

      if (response.success) {

        // Close dialog and call success callback
        setDialogOpen(false);
        onSuccess?.();

        // Reset form
        setFormData({
          schoolType: "",
          curriculumType: "",
          openingTime: "",
          closingTime: "",
          operationalDays: [],
          extendedCare: "",
          mealsProvided: "",
          outdoorPlayArea: "",
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        alert(
          response.message ||
            "Failed to save kindergarten details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving kindergarten details:", error);
      alert("Failed to save kindergarten details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchoolSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert Yes/No values to boolean before sending to backend
      const schoolFormDataWithBooleans = {
        ...schoolFormData,
        hostelFacility: schoolFormData.hostelFacility === "Yes",
        playground: schoolFormData.playground === "Yes",
        busService: schoolFormData.busService === "Yes",
      };

      const response = await institutionDetailsAPI.createInstitutionDetails(
        schoolFormDataWithBooleans
      );

      if (response.success) {
        // Close dialog and call success callback
        setDialogOpen(false);
        onSuccess?.();

        // Reset form
        setSchoolFormData({
          schoolType: "",
          schoolCategory: "",
          curriculumType: "",
          operationalDays: [],
          otherActivities: "",
          hostelFacility: "",
          playground: "",
          busService: "",
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        alert(
          response.message || "Failed to save school details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving school details:", error);
      alert("Failed to save school details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoachingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert Yes/No values to boolean before sending to backend
      const coachingFormDataWithBooleans = {
        ...coachingFormData,
        placementDrives: coachingFormData.placementDrives === "Yes",
        mockInterviews: coachingFormData.mockInterviews === "Yes",
        resumeBuilding: coachingFormData.resumeBuilding === "Yes",
        linkedinOptimization: coachingFormData.linkedinOptimization === "Yes",
        exclusiveJobPortal: coachingFormData.exclusiveJobPortal === "Yes",
        certification: coachingFormData.certification === "Yes",
      };

      const response = await institutionDetailsAPI.createInstitutionDetails(
        coachingFormDataWithBooleans
      );

      if (response.success) {
        // Close dialog and call success callback
        setDialogOpen(false);
        onSuccess?.();

        // Reset form
        setCoachingFormData({
          placementDrives: "",
          mockInterviews: "",
          resumeBuilding: "",
          linkedinOptimization: "",
          exclusiveJobPortal: "",
          certification: "",
        });

        clearInstitutionData();
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        alert(
          response.message ||
            "Failed to save coaching center details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving coaching center details:", error);
      alert("Failed to save coaching center details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollegeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert Yes/No values to boolean before sending to backend
      const collegeFormDataWithBooleans = {
        ...collegeFormData,
        hostelFacility: collegeFormData.hostelFacility === "Yes",
        playground: collegeFormData.playground === "Yes",
        busService: collegeFormData.busService === "Yes",
      };

      const response = await institutionDetailsAPI.createInstitutionDetails(
        collegeFormDataWithBooleans
      );

      if (response.success) {
        // Close dialog and call success callback
        setDialogOpen(false);
        onSuccess?.();

        // Reset form
        setCollegeFormData({
          collegeType: "",
          collegeCategory: "",
          curriculumType: "",
          operationalDays: [],
          otherActivities: "",
          hostelFacility: "",
          playground: "",
          busService: "",
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        alert(
          response.message ||
            "Failed to save college details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving college details:", error);
      alert("Failed to save college details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndergraduateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert Yes/No values to boolean before sending to backend
      const undergraduateFormDataWithBooleans = {
        ...undergraduateFormData,
        placementDrives: undergraduateFormData.placementDrives === "Yes",
        mockInterviews: undergraduateFormData.mockInterviews === "Yes",
        resumeBuilding: undergraduateFormData.resumeBuilding === "Yes",
        linkedinOptimization: undergraduateFormData.linkedinOptimization === "Yes",
        exclusiveJobPortal: undergraduateFormData.exclusiveJobPortal === "Yes",
        library: undergraduateFormData.library === "Yes",
        hostelFacility: undergraduateFormData.hostelFacility === "Yes",
        entranceExam: undergraduateFormData.entranceExam === "Yes",
        managementQuota: undergraduateFormData.managementQuota === "Yes",
        playground: undergraduateFormData.playground === "Yes",
        busService: undergraduateFormData.busService === "Yes",
      };

      const response = await institutionDetailsAPI.createInstitutionDetails(
        undergraduateFormDataWithBooleans
      );

      if (response.success) {
        // Close dialog and call success callback
        setDialogOpen(false);
        onSuccess?.();

        // Reset form
        setUndergraduateFormData({
          ownershipType: "",
          collegeCategory: "",
          affiliationType: "",
          placementDrives: "",
          mockInterviews: "",
          resumeBuilding: "",
          linkedinOptimization: "",
          exclusiveJobPortal: "",
          library: "",
          hostelFacility: "",
          entranceExam: "",
          managementQuota: "",
          playground: "",
          busService: "",
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        alert(
          response.message ||
            "Failed to save undergraduate college details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving undergraduate college details:", error);
      alert("Failed to save undergraduate college details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Always render since we default to kindergarten when no institution type is set

  const operationalDaysOptions = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="w-[95vw] sm:w-[90vw] md:w-[800px] lg:w-[900px] xl:max-w-4xl scrollbar-hide"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Card className="w-full sm:p-6 rounded-[24px] bg-white border-0 shadow-none">
          <CardContent className="space-y-6">
            {isKindergarten && (
              <>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold">
                    Inside Your Kindergarten.
                  </h3>
                  <p className="text-[#697282] text-sm">
                    Fill in this checklist with the important details parents
                    look for.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: School Type and Curriculum Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="School type"
                      name="schoolType"
                      value={formData.schoolType}
                      onChange={handleChange}
                      isSelect={true}
                      options={[
                        "Public",
                        "Private (For-profit)",
                        "Private (Non-profit)",
                        "International",
                        "Home - based",
                      ]}
                      placeholder="Select school type"
                    />

                    <InputField
                      label="Curriculum type"
                      name="curriculumType"
                      value={formData.curriculumType}
                      onChange={handleChange}
                      placeholder="Enter Curriculum type"
                    />
                  </div>

                  {/* Row 2: Operational Time's and Operational Day's */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Operational Time's */}
                    <div className="flex flex-col gap-2">
                      <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
                        Operational Time's
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <InputField
                          label=""
                          name="openingTime"
                          value={formData.openingTime}
                          onChange={handleChange}
                          placeholder="Opening time"
                          className="max-w-none"
                          icon={<Clock size={18} className="text-[#697282]" />}
                        />
                        <InputField
                          label=""
                          name="closingTime"
                          value={formData.closingTime}
                          onChange={handleChange}
                          placeholder="Closing time"
                          className="max-w-none"
                          icon={<Clock size={18} className="text-[#697282]" />}
                        />
                      </div>
                    </div>

                    {/* Operational Day's */}
                    <div className="flex flex-col gap-4">
                      <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
                        Operational Day's
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {operationalDaysOptions.map((day) => (
                          <Button
                            key={day}
                            type="button"
                            onClick={() => handleOperationalDayChange(day)}
                            className={`h-[48px] px-3 rounded-[8px] border text-sm 
                            ${
                              formData.operationalDays.includes(day)
                                ? "bg-[#0222D7] border-[#0222D7] text-white hover:!bg-[#0222D7]"
                                : "bg-[#F5F6F9] border-[#DADADD] text-[#697282] hover:!bg-[#F5F6F9] hover:!text-[#697282]"
                            }`}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Radio Button Questions in 2x2 Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Extended care */}
                    <InputField
                      label="Extended care ?"
                      name="extendedCare"
                      value={formData.extendedCare}
                      onChange={(e) =>
                        handleRadioChange("extendedCare", e.target.value)
                      }
                      isRadio={true}
                      options={["Yes", "No"]}
                    />

                    {/* Meals Provided */}
                    <InputField
                      label="Meals Provided?"
                      name="mealsProvided"
                      value={formData.mealsProvided}
                      onChange={(e) =>
                        handleRadioChange("mealsProvided", e.target.value)
                      }
                      isRadio={true}
                      options={["Yes", "No"]}
                    />
                  </div>

                  {/* Row 4: Outdoor Play area (single column) */}
                  <InputField
                    label="Outdoor Play area?"
                    name="outdoorPlayArea"
                    value={formData.outdoorPlayArea}
                    onChange={(e) =>
                      handleRadioChange("outdoorPlayArea", e.target.value)
                    }
                    isRadio={true}
                    options={["Yes", "No"]}
                  />

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full max-w-[500px] h-[48px] bg-[#0222D7] text-white rounded-[12px] font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {isLoading ? "Saving..." : "Save & Next"}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {isSchool && (
              <>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold">
                    Inside Your School.
                  </h3>
                  <p className="text-[#697282] text-sm">
                    Fill in this checklist with the important details students
                    and parents look for.
                  </p>
                </div>

                <form onSubmit={handleSchoolSubmit} className="space-y-6">
                  {/* Row 1: School Type and School Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="School type"
                      name="schoolType"
                      value={schoolFormData.schoolType}
                      onChange={handleSchoolChange}
                      isSelect={true}
                      options={[
                        "Co-ed",
                        "Boys Only",
                        "Girls Only"
                      ]}
                      placeholder="Select school type"
                    />

                    <InputField
                      label="School category"
                      name="schoolCategory"
                      value={schoolFormData.schoolCategory}
                      onChange={handleSchoolChange}
                      isSelect={true}
                      options={[
                        "Public",
                        "Private",
                        "Charter",
                        "International"
                      ]}
                      placeholder="Select school Category"
                    />
                  </div>

                  {/* Row 2: Curriculum Type and Operational Days */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Curriculum type"
                      name="curriculumType"
                      value={schoolFormData.curriculumType}
                      onChange={handleSchoolChange}
                      isSelect={true}
                      options={[
                        "State Board",
                        "CBSE",
                        "ICSE",
                        "IB",
                        "IGCSE"
                      ]}
                      placeholder="Select Curriculum type"
                    />

                    {/* Operational Day's */}
                    <div className="flex flex-col gap-2">
                      <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
                        Operational Day's
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {operationalDaysOptions.map((day) => (
                          <Button
                            key={day}
                            type="button"
                            onClick={() =>
                              handleSchoolOperationalDayChange(day)
                            }
                            className={`h-[48px] px-3 rounded-[8px] border text-sm 
                            ${
                              schoolFormData.operationalDays.includes(day)
                                ? "bg-[#0222D7] border-[#0222D7] text-white hover:!bg-[#0222D7]"
                                : "bg-[#F5F6F9] border-[#DADADD] text-[#697282] hover:!bg-[#F5F6F9] hover:!text-[#697282]"
                            }`}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Other Activities and Radio Button Questions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Other Activities */}
                    <InputField
                      label="Other activities"
                      name="otherActivities"
                      value={schoolFormData.otherActivities}
                      onChange={handleSchoolChange}
                      placeholder="Enter activities"
                      isTextarea={true}
                      rows={2}
                    />

                    {/* Hostel facility */}
                    <InputField
                      label="Hostel facility ?"
                      name="hostelFacility"
                      value={schoolFormData.hostelFacility}
                      onChange={(e) =>
                        handleSchoolRadioChange(
                          "hostelFacility",
                          e.target.value
                        )
                      }
                      isRadio={true}
                      options={["Yes", "No"]}
                    />
                  </div>

                  {/* Row 4: Playground and Bus Service */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Playground */}
                    <InputField
                      label="Playground ?"
                      name="playground"
                      value={schoolFormData.playground}
                      onChange={(e) =>
                        handleSchoolRadioChange("playground", e.target.value)
                      }
                      isRadio={true}
                      options={["Yes", "No"]}
                    />

                    {/* Bus Service */}
                    <InputField
                      label="Bus service ?"
                      name="busService"
                      value={schoolFormData.busService}
                      onChange={(e) =>
                        handleSchoolRadioChange("busService", e.target.value)
                      }
                      isRadio={true}
                      options={["Yes", "No"]}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full max-w-[500px] h-[48px] bg-[#0222D7] text-white rounded-[12px] font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {isLoading ? "Saving..." : "Save & Next"}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {isCoaching && (
              <>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold">
                    Inside Your institute.
                  </h3>
                  <p className="text-[#697282] text-sm">
                    Share the key facts that students and parents choose you.
                  </p>
                </div>

                <form onSubmit={handleCoachingSubmit} className="space-y-6">
                  {/* Placements Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-black">
                      Placements
                    </h4>

                    {/* Row 1: Placement drives and Mock interviews */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Placement drives */}
                      <InputField
                        label="Placement drives ?"
                        name="placementDrives"
                        value={coachingFormData.placementDrives}
                        onChange={(e) =>
                          handleCoachingRadioChange(
                            "placementDrives",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />

                      {/* Mock interviews */}
                      <InputField
                        label="Mock interviews ?"
                        name="mockInterviews"
                        value={coachingFormData.mockInterviews}
                        onChange={(e) =>
                          handleCoachingRadioChange(
                            "mockInterviews",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />
                    </div>

                    {/* Row 2: Resume building and LinkedIn optimization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Resume building */}
                      <InputField
                        label="Resume building ?"
                        name="resumeBuilding"
                        value={coachingFormData.resumeBuilding}
                        onChange={(e) =>
                          handleCoachingRadioChange(
                            "resumeBuilding",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />

                      {/* LinkedIn optimization */}
                      <InputField
                        label="Linked-in optimization ?"
                        name="linkedinOptimization"
                        value={coachingFormData.linkedinOptimization}
                        onChange={(e) =>
                          handleCoachingRadioChange(
                            "linkedinOptimization",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />
                    </div>

                    {/* Row 3: Access to exclusive job portal and Certification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Access to exclusive job portal */}
                      <InputField
                        label="Access to exclusive job portal ?"
                        name="exclusiveJobPortal"
                        value={coachingFormData.exclusiveJobPortal}
                        onChange={(e) =>
                          handleCoachingRadioChange(
                            "exclusiveJobPortal",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />

                      {/* Certification */}
                      <InputField
                        label="Certification ?"
                        name="certification"
                        value={coachingFormData.certification}
                        onChange={(e) =>
                          handleCoachingRadioChange(
                            "certification",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full max-w-[500px] h-[48px] bg-[#0222D7] text-white rounded-[12px] font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {isLoading ? "Saving..." : "Save & Next"}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {isIntermediate && (
              <>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold">
                    Inside Your College.
                  </h3>
                  <p className="text-[#697282] text-sm">
                    Share the key facts that make students and parents choose
                    you.
                  </p>
                </div>

                <form onSubmit={handleCollegeSubmit} className="space-y-6">
                  {/* Row 1: College Type and College Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="College type"
                      name="collegeType"
                      value={collegeFormData.collegeType}
                      onChange={handleCollegeChange}
                      isSelect={true}
                      options={[
                        "Junior College",
                        "Senior Secondary",
                        "Higher Secondary",
                        "Intermediate",
                        "Pre-University",
                      ]}
                      placeholder="Select college type"
                    />

                    <InputField
                      label="College category"
                      name="collegeCategory"
                      value={collegeFormData.collegeCategory}
                      onChange={handleCollegeChange}
                      isSelect={true}
                      options={[
                        "Government",
                        "Private",
                        "Semi-Government",
                        "Aided",
                        "Unaided",
                      ]}
                      placeholder="Select college category"
                    />
                  </div>

                  {/* Row 2: Curriculum Type and Operational Days */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Curriculum type"
                      name="curriculumType"
                      value={collegeFormData.curriculumType}
                      onChange={handleCollegeChange}
                      isSelect={true}
                      options={[
                        "State Board",
                        "CBSE",
                        "ICSE",
                        "IB",
                        "Cambridge",
                        "Other",
                      ]}
                      placeholder="Select Curriculum type"
                    />

                    {/* Operational Day's */}
                    <div className="flex flex-col gap-2">
                      <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
                        Operational Day's
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {operationalDaysOptions.map((day) => (
                          <Button
                            key={day}
                            type="button"
                            onClick={() =>
                              handleCollegeOperationalDayChange(day)
                            }
                            className={`h-[48px] px-3 rounded-[8px] border text-sm 
                            ${
                              collegeFormData.operationalDays.includes(day)
                                ? "bg-[#0222D7] border-[#0222D7] text-white hover:!bg-[#0222D7]"
                                : "bg-[#F5F6F9] border-[#DADADD] text-[#697282] hover:!bg-[#F5F6F9] hover:!text-[#697282]"
                            }`}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Other Activities */}
                  <InputField
                    label="Other activities"
                    name="otherActivities"
                    value={collegeFormData.otherActivities}
                    onChange={handleCollegeChange}
                    placeholder="Enter activities"
                    isTextarea={true}
                    rows={2}
                  />

                  {/* Row 4: Radio Button Questions in 2x2 Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hostel facility */}
                    <InputField
                      label="Hostel facility ?"
                      name="hostelFacility"
                      value={collegeFormData.hostelFacility}
                      onChange={(e) =>
                        handleCollegeRadioChange(
                          "hostelFacility",
                          e.target.value
                        )
                      }
                      isRadio={true}
                      options={["Yes", "No"]}
                    />

                    {/* Playground */}
                    <InputField
                      label="Playground ?"
                      name="playground"
                      value={collegeFormData.playground}
                      onChange={(e) =>
                        handleCollegeRadioChange("playground", e.target.value)
                      }
                      isRadio={true}
                      options={["Yes", "No"]}
                    />
                  </div>

                  {/* Row 5: Bus Service (single column) */}
                  <InputField
                    label="Bus service ?"
                    name="busService"
                    value={collegeFormData.busService}
                    onChange={(e) =>
                      handleCollegeRadioChange("busService", e.target.value)
                    }
                    isRadio={true}
                    options={["Yes", "No"]}
                  />

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full max-w-[500px] h-[48px] bg-[#0222D7] text-white rounded-[12px] font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {isLoading ? "Saving..." : "Save & Next"}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {isUndergraduate && (
              <>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold">
                    Inside Your College.
                  </h3>
                  <p className="text-[#697282] text-sm">
                    Share the key facts that students and parents choose you.
                  </p>
                </div>

                <form
                  onSubmit={handleUndergraduateSubmit}
                  className="space-y-6"
                >
                  {/* Row 1: Ownership type, College category, Affiliation type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Ownership type"
                      name="ownershipType"
                      value={undergraduateFormData.ownershipType}
                      onChange={handleUndergraduateChange}
                      isSelect={true}
                      options={[
                        "Government",
                        "Private",
                        "Semi-Government",
                        "Aided",
                        "Unaided",
                      ]}
                      placeholder="Select ownership type"
                    />

                    <InputField
                      label="College category"
                      name="collegeCategory"
                      value={undergraduateFormData.collegeCategory}
                      onChange={handleUndergraduateChange}
                      isSelect={true}
                      options={[
                        "Engineering",
                        "Medical",
                        "Arts & Science",
                        "Commerce",
                        "Management",
                        "Law",
                        "Other",
                      ]}
                      placeholder="Select Category"
                    />
                  </div>

                  {/* Row 2: Affiliation type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Affiliation type"
                      name="affiliationType"
                      value={undergraduateFormData.affiliationType}
                      onChange={handleUndergraduateChange}
                      isSelect={true}
                      options={[
                        "University",
                        "Autonomous",
                        "Affiliated",
                        "Deemed University",
                        "Other",
                      ]}
                      placeholder="Select Affiliation type"
                    />
                    {/* Empty div to take the other half */}
                    <div></div>
                  </div>

                  {/* Placements Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-black">
                      Placements
                    </h4>

                    {/* Row 3: Placement drives and Mock interviews */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Placement drives */}
                      <InputField
                        label="Placement drives ?"
                        name="placementDrives"
                        value={undergraduateFormData.placementDrives}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "placementDrives",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />

                      {/* Mock interviews */}
                      <InputField
                        label="Mock interviews ?"
                        name="mockInterviews"
                        value={undergraduateFormData.mockInterviews}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "mockInterviews",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />
                    </div>

                    {/* Row 4: Resume building and LinkedIn optimization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Resume building */}
                      <InputField
                        label="Resume building ?"
                        name="resumeBuilding"
                        value={undergraduateFormData.resumeBuilding}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "resumeBuilding",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />

                      {/* LinkedIn optimization */}
                      <InputField
                        label="Linked-in optimization ?"
                        name="linkedinOptimization"
                        value={undergraduateFormData.linkedinOptimization}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "linkedinOptimization",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />
                    </div>

                    {/* Row 5: Access to exclusive job portal */}
                    <InputField
                      label="Access to exclusive job portal ?"
                      name="exclusiveJobPortal"
                      value={undergraduateFormData.exclusiveJobPortal}
                      onChange={(e) =>
                        handleUndergraduateRadioChange(
                          "exclusiveJobPortal",
                          e.target.value
                        )
                      }
                      isRadio={true}
                      options={["Yes", "No"]}
                    />
                  </div>

                  {/* Other questions Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-black">
                      Other questions
                    </h4>

                    {/* Row 6: Library and Hostel facility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Library */}
                      <InputField
                        label="Library ?"
                        name="library"
                        value={undergraduateFormData.library}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "library",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />

                      {/* Hostel facility */}
                      <InputField
                        label="Hostel facility ?"
                        name="hostelFacility"
                        value={undergraduateFormData.hostelFacility}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "hostelFacility",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />
                    </div>

                    {/* Row 7: Entrance exam and Management Quota */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Entrance exam */}
                      <InputField
                        label="Entrance exam ?"
                        name="entranceExam"
                        value={undergraduateFormData.entranceExam}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "entranceExam",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />

                      {/* Management Quota */}
                      <InputField
                        label="Management Quota ?"
                        name="managementQuota"
                        value={undergraduateFormData.managementQuota}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "managementQuota",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />
                    </div>

                    {/* Row 8: Playground and Bus service */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Playground */}
                      <InputField
                        label="Playground ?"
                        name="playground"
                        value={undergraduateFormData.playground}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "playground",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />

                      {/* Bus service */}
                      <InputField
                        label="Bus service ?"
                        name="busService"
                        value={undergraduateFormData.busService}
                        onChange={(e) =>
                          handleUndergraduateRadioChange(
                            "busService",
                            e.target.value
                          )
                        }
                        isRadio={true}
                        options={["Yes", "No"]}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full max-w-[500px] h-[48px] bg-[#0222D7] text-white rounded-[12px] font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {isLoading ? "Saving..." : "Save & Next"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
