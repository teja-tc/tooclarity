"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/InputField";

interface ForgotPasswordDialogBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordDialogBox({
  open,
  onOpenChange,
}: ForgotPasswordDialogBoxProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailSent && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [emailSent, timer]);

  const validateEmail = (email: string) => {
    const trimmed = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(trimmed);
  };

  const handleForgotPassword = () => {
    setError("");

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    console.log("Forgot password request for:", email);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
      setTimer(20);
      setCanResend(false);
    }, 1500);
  };

  const handleResend = () => {
    console.log("Resend password reset link to:", email);
    setTimer(20);
    setCanResend(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Reset Password</DialogTitle>
          <DialogDescription>
            Enter your registered email to receive a password reset link.
          </DialogDescription>
        </DialogHeader>

        {!emailSent ? (
          <div className="grid gap-4 mt-4">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // clear error on typing
              }}
              required
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

            <Button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Sending..." : "Submit"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-3 mt-4">
            <p className="text-green-600 font-medium">
              Reset link has been sent to your email!
            </p>
            {!canResend ? (
              <p className="text-sm text-gray-600">
                You can resend the link in <span className="font-semibold">{timer}s</span>
              </p>
            ) : (
              <Button
                onClick={handleResend}
                variant="outline"
                className="h-10 text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Resend Link
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
