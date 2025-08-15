"use client";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    linkedin: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Form submitted:", formData);
  };

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: "#1D1C1AB2",
          backdropFilter: "blur(3.4px)",
        }}
      ></div>

      {/* Top navigation bar */}
      <div className="w-full h-[80px] flex justify-between items-center px-20 bg-[#FBF9F5] z-10 relative">
        <img src="/Too%20Clarity.png" alt="Too Clarity Logo" className="h-7 w-auto" />
        <a
          href="tel:+919391160205"
          className="text-sm text-blue-700 flex items-center gap-1"
        >
          Need help? Call +91 9391160205
        </a>
      </div>

      {/* Form container */}
      <div
        className="absolute z-20 flex flex-col gap-8 rounded-[24px]"
        style={{
          width: "552px",
          height: "884px",
          top: "70px",
          left: "444px",
          padding: "24px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="flex flex-col items-center mb-1">
          <h2 className="w-[235px] h-[29px] text-[24px] font-bold text-[#060B13] leading-[100%] tracking-[0%] font-montserrat text-center">
            Welcome Aboard!
          </h2>
          <p className="text-[14px] font-normal text-[#697282] leading-[100%] tracking-[0%] font-montserrat text-center mt-1">
            Let's finalize your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          {/* Name */}
          <div className="flex flex-col gap-[12px]">
            <label className="block font-medium text-[18px] leading-[100%] text-gray-900 font-montserrat">
              Admin Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full h-[48px] px-4 py-3 rounded-[12px] border border-[#DADADD] bg-[#F5F6F9] focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[12px]">
            <label className="block font-medium text-[18px] leading-[100%] text-gray-900 font-montserrat">
              Mail id *
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your mail id"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full h-[48px] px-4 py-3 rounded-[12px] border border-[#DADADD] bg-[#F5F6F9] focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-[12px]">
            <label className="block font-medium text-[18px] leading-[100%] text-gray-900 font-montserrat">
              Contact Number *
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 00000 00000"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-[48px] px-4 py-3 rounded-[12px] border border-[#DADADD] bg-[#F5F6F9] focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Designation */}
          <div className="flex flex-col gap-[12px]">
            <label className="block font-medium text-[18px] leading-[100%] text-gray-900 font-montserrat">
              Designation *
            </label>
            <input
              type="text"
              name="designation"
              placeholder="e.g. Admissions Director, Marketing Head"
              required
              value={formData.designation}
              onChange={handleChange}
              className="w-full h-[48px] px-4 py-3 rounded-[12px] border border-[#DADADD] bg-[#F5F6F9] focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* LinkedIn */}
          <div className="flex flex-col gap-[12px]">
            <label className="block font-medium text-[18px] leading-[100%] text-gray-900 font-montserrat">
              LinkedIn *
            </label>
            <input
              type="url"
              name="linkedin"
              placeholder="Paste your LinkedIn URL"
              required
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full h-[48px] px-4 py-3 rounded-[12px] border border-[#DADADD] bg-[#F5F6F9] focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-[12px]">
              <label className="block text-[18px] font-medium text-black font-montserrat leading-[100%] tracking-[0%]">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full h-[48px] px-4 py-3 border border-[#DADADD] rounded-[12px] bg-[#F5F6F9] focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex flex-col gap-[12px]">
              <label className="block text-[18px] font-medium text-black font-montserrat leading-[100%] tracking-[0%]">
                Re-enter Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-[48px] px-4 py-3 border border-[#DADADD] rounded-[12px] bg-[#F5F6F9] focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-4"
          >
            Submit
          </button>

          <div className="text-center text-gray-500 mt-2">or</div>

          <button
            type="button"
            className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
