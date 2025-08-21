"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import VerifyDialog from "./VerifyDialog";

export default function SignUpDialog() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [formData, setFormData] = useState({
    admin: "",
    email: "",
    phone: "",
    designation: "",
    linkedin: "",
    password: "",
    repassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);

  // Password strength regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.admin.trim()) {
      newErrors.admin = "Admin Name is required.";
    }
    if (!formData.email.endsWith("@gmail.com")) {
      newErrors.email = "Email must be a valid Gmail address.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required.";
    }
    if (!formData.linkedin.trim()) {
      newErrors.linkedin = "LinkedIn profile is required.";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include uppercase, lowercase, number and special character.";
    }
    if (formData.password !== formData.repassword) {
      newErrors.repassword = "Passwords do not match.";
    }
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms & conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setOpenVerify(true);
    }
  };

  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="signup" size="lg">
              Sign Up
            </Button>
          </DialogTrigger>

          <DialogContent
            className="fixed top-16 left-1/2 transform -translate-x-1/2 w-[552px] max-h-[90vh] rounded-[24px] p-6 bg-white flex flex-col justify-between overflow-y-auto scrollbar-hide"
            style={{ opacity: 1 }}
          >
            <DialogHeader className="flex flex-col items-center gap-2">
              <DialogTitle className="w-[235px] font-montserrat font-bold text-[24px] leading-[29px] text-center">
                Welcome Aboard!
              </DialogTitle>
              <DialogDescription className="w-[235px] font-montserrat font-normal text-[14px] leading-[17px] text-center">
                Let's finalize your details.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 flex-1">
              {[
                { label: "Admin Name", id: "admin" },
                { label: "Mail ID", id: "email", type: "email" },
                { label: "Contact Number", id: "phone", type: "tel" },
                { label: "Designation", id: "designation" },
                { label: "LinkedIn", id: "linkedin" },
              ].map((f) => (
                <div className="grid gap-2" key={f.id}>
                  <Label
                    htmlFor={f.id}
                    className="block font-medium text-[18px] text-gray-900 font-montserrat"
                  >
                    {f.label}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  {f.id === "phone" ? (
                    <div className="relative w-[504px]">
                      <img
                        src="/India-flag.png"
                        alt="India Flag"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-4 object-cover rounded-sm"
                      />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 0000000000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-[504px] h-[48px] pl-12 pr-4 py-3 rounded-[12px] border border-[#DADADD] bg-[#F5F6F9]"
                      />
                    </div>
                  ) : (
                    <Input
                      id={f.id}
                      type={f.type || "text"}
                      placeholder={`Enter your ${f.label}`}
                      value={formData[f.id as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({ ...formData, [f.id]: e.target.value })
                      }
                      className="w-[504px] h-[48px] px-4 py-3 rounded-[12px] border border-[#DADADD] bg-[#F5F6F9]"
                    />
                  )}
                  {errors[f.id] && (
                    <p className="text-red-500 text-sm">{errors[f.id]}</p>
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password*</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter your Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Re-enter Password */}
                <div className="grid gap-2">
                  <Label htmlFor="repassword">Re-enter Password*</Label>
                  <div className="relative">
                    <Input
                      id="repassword"
                      type={showRePassword ? "text" : "password"}
                      value={formData.repassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          repassword: e.target.value,
                        })
                      }
                      placeholder="Re-enter your Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRePassword(!showRePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.repassword && (
                    <p className="text-red-500 text-sm">{errors.repassword}</p>
                  )}
                </div>
              </div>

              {/* Accept Terms */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  id="terms"
                  className="w-4 h-4"
                />
                <label htmlFor="terms" className="text-sm">
                  Accept terms & conditions*
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm">{errors.terms}</p>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 mt-4">
              <Button
                type="button"
                onClick={handleSubmit}
                className={`w-[500px] h-[48px] rounded-[12px] px-4 py-3 gap-2 font-semibold ${
                  acceptTerms
                    ? "bg-blue-600 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                Submit
              </Button>

                    <div className="text-center text-gray-500 mt-2">or</div>

      <button
        type="button"
        className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
      >
        <img src="/google.png" alt="Google" className="w-5 h-5" />
        Sign in with Google
      </button>
            </div>
          </DialogContent>
        </form>
      </Dialog>
{/* 
      <VerifyDialog
        open={openVerify}
        setOpen={setOpenVerify}
        phone={formData.phone}
      /> */}
    </>
  );
}
