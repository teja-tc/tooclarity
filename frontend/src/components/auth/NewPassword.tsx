"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";

export default function NewPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    console.log("Password reset request:", formData.password);

    // Simulate API
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ password: "", confirmPassword: "" });
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
        Reset Your Password
      </h2>
      <p className="text-gray-500 text-center mb-6 text-sm">
        Enter your new password below to reset it.
      </p>

      {success ? (
        <div className="text-center text-green-600 font-medium">
          Your password has been successfully reset!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setErrors({ ...errors, password: "" });
            }}
            required
          />
          {errors.password && (
            <p className="text-red-600 text-sm -mt-2">{errors.password}</p>
          )}

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              setErrors({ ...errors, confirmPassword: "" });
            }}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm -mt-2">{errors.confirmPassword}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}
