"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
import { institutionAPI, clearInstitutionData } from "@/lib/api";

interface FormData {
  instituteType: string;
  instituteName: string;
  approvedBy: string;
  establishmentDate: string;
  contactInfo: string;
  additionalContactInfo: string;
  headquartersAddress: string;
  state: string;
  pincode: string;
  locationURL: string;
}

interface Errors {
  [key: string]: string;
}

interface L1DialogBoxProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function L1DialogBox({
  trigger,
  open,
  onOpenChange,
  onSuccess,
}: L1DialogBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    instituteType: "",
    instituteName: "",
    approvedBy: "",
    establishmentDate: "",
    contactInfo: "",
    additionalContactInfo: "",
    headquartersAddress: "",
    state: "",
    pincode: "",
    locationURL: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle controlled open state
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;

  // Clear institution data when dialog opens (for clean state)
  useEffect(() => {
    if (dialogOpen) {
      clearInstitutionData();
    }
  }, [dialogOpen]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset approvedBy & establishmentDate if instituteType = "Study Halls"
  useEffect(() => {
    if (formData.instituteType === "Study Halls") {
      setFormData((prev) => ({
        ...prev,
        approvedBy: "",
        establishmentDate: "",
      }));
    }
  }, [formData.instituteType]);

  const validateForm = (): Errors => {
    let newErrors: Errors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    // Skip validation for hidden fields
    if (formData.instituteType === "Study Halls") {
      delete newErrors.approvedBy;
      delete newErrors.establishmentDate;
    }

    // Phone validation
    if (formData.contactInfo && !/^\d{10}$/.test(formData.contactInfo)) {
      newErrors.contactInfo = "Phone number must be 10 digits";
    }

    if (
      formData.additionalContactInfo &&
      !/^\d{10}$/.test(formData.additionalContactInfo)
    ) {
      newErrors.additionalContactInfo = "Phone number must be 10 digits";
    }

    // Pincode validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        // Make API call to create institution
        const response = await institutionAPI.createInstitution(formData);
        const resData = response.data;

        if (resData.data) {
          if (typeof window !== "undefined") {
            localStorage.setItem("institutionType", resData.data.instituteType);
            localStorage.setItem("institutionId", resData.data.id);

            console.log("Institution Type stored:", resData.data.instituteType);
            console.log("Institution ID stored:", resData.data.id);
          }

          // Close dialog on successful submission
          setDialogOpen(false);
          // Reset form
          setFormData({
            instituteType: "",
            instituteName: "",
            approvedBy: "",
            establishmentDate: "",
            contactInfo: "",
            additionalContactInfo: "",
            headquartersAddress: "",
            state: "",
            pincode: "",
            locationURL: "",
          });
          setSubmitted(false);
          setErrors({});

          // Call success callback to trigger L2DialogBox
          onSuccess?.();
        } else {
          alert(`Error: ${response.message}`);
        }
      } catch (error) {
        console.error("Error creating institution:", error);
        alert("Failed to save institution details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Check completeness (for button color)
  const isFormComplete =
    Object.values(formData).every((field) => field.trim() !== "") &&
    Object.keys(validateForm()).length === 0;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="w-[95vw] sm:w-[90vw] md:w-[800px] lg:w-[900px] xl:max-w-4xl scrollbar-hide"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle className="font-montserrat font-bold text-xl sm:text-[28px] leading-tight text-center">
            Institution Details
          </DialogTitle>
          <DialogDescription className="font-montserrat font-normal text-sm sm:text-[16px] leading-relaxed text-center text-gray-600">
            Provide key information about your institution to get started
          </DialogDescription>
        </DialogHeader>

        <Card className="w-full sm:p-6 rounded-[24px] bg-white border-0 shadow-none">
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-[30px]">
              {/* Institute Type */}
              <div>
                <InputField
                  label="Institute Type"
                  name="instituteType"
                  value={formData.instituteType}
                  onChange={handleChange}
                  isSelect
                  options={[
                    "Kindergarten/childcare center",
                    "School's",
                    "Intermediate college(K12)",
                    "Under Graduation/Post Graduation",
                    "Coaching centers",
                    "Study Halls",
                    "Tution Center's",
                    "Study Abroad",
                  ]}
                />
                {submitted && errors.instituteType && (
                  <p className="text-red-500 text-sm">{errors.instituteType}</p>
                )}
              </div>

              {/* Institute Name */}
              <div>
                <InputField
                  label="Institute Name"
                  name="instituteName"
                  value={formData.instituteName}
                  onChange={handleChange}
                  placeholder="Enter your Institute name"
                />
                {submitted && errors.instituteName && (
                  <p className="text-red-500 text-sm">{errors.instituteName}</p>
                )}
              </div>

              {/* Conditionally render Approved By & Establishment Date */}
              {formData.instituteType !== "Study Halls" && (
                <>
                  <div>
                    <InputField
                      label="Approved By"
                      name="approvedBy"
                      value={formData.approvedBy}
                      onChange={handleChange}
                      placeholder="State Recognised"
                    />
                    {submitted && errors.approvedBy && (
                      <p className="text-red-500 text-sm">
                        {errors.approvedBy}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Establishment Date"
                      name="establishmentDate"
                      type="date"
                      value={formData.establishmentDate}
                      onChange={handleChange}
                    />
                    {submitted && errors.establishmentDate && (
                      <p className="text-red-500 text-sm">
                        {errors.establishmentDate}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Contact Info */}
              <div>
                <InputField
                  label="Contact Info"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  numericOnly
                  icon={
                    <img
                      src="/India-flag.png"
                      alt="India"
                      className="w-6 h-6 rounded-sm"
                    />
                  }
                />
                {submitted && errors.contactInfo && (
                  <p className="text-red-500 text-sm">{errors.contactInfo}</p>
                )}
              </div>

              {/* Additional Contact Info */}
              <div>
                <InputField
                  label="Additional Contact Info"
                  name="additionalContactInfo"
                  value={formData.additionalContactInfo}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  numericOnly
                  icon={
                    <img
                      src="/India-flag.png"
                      alt="India"
                      className="w-6 h-6 rounded-sm"
                    />
                  }
                />
                {submitted && errors.additionalContactInfo && (
                  <p className="text-red-500 text-sm">
                    {errors.additionalContactInfo}
                  </p>
                )}
              </div>

              {/* Headquarters Address */}
              <div>
                <InputField
                  label="Headquarters Address"
                  name="headquartersAddress"
                  value={formData.headquartersAddress}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
                {submitted && errors.headquartersAddress && (
                  <p className="text-red-500 text-sm">
                    {errors.headquartersAddress}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <InputField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
                {submitted && errors.state && (
                  <p className="text-red-500 text-sm">{errors.state}</p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <InputField
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  numericOnly
                />
                {submitted && errors.pincode && (
                  <p className="text-red-500 text-sm">{errors.pincode}</p>
                )}
              </div>

              {/* Location URL */}
              <div>
                <InputField
                  label="Location URL"
                  name="locationURL"
                  value={formData.locationURL}
                  onChange={handleChange}
                  placeholder="Paste the URL"
                />
                {submitted && errors.locationURL && (
                  <p className="text-red-500 text-sm">{errors.locationURL}</p>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full max-w-[500px] h-[48px] mt-5 mx-auto rounded-[12px] font-semibold transition-colors 
                  ${
                    isFormComplete && !isLoading
                      ? "bg-[#0222D7] text-white"
                      : "bg-[#697282] text-white"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Saving..." : "Save & Next"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
