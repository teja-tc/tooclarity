"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { authAPI } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function StudentSignupPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, refreshUser } = useAuth();

  const [countryCode, setCountryCode] = useState("+91");
  const countryOptions = ["+91", "+1", "+44", "+61", "+81", "+971"]; // minimal, can expand
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const shouldRedirect = useMemo(() => {
    if (!user) return false;
    if (user.role && String(user.role).toUpperCase().includes("STUDENT")) return true;
    return false;
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (shouldRedirect) router.replace("/student/profile");
  }, [loading, shouldRedirect, router]);

  useEffect(() => {
    if (step !== "otp" || !open) return;
    if (timer <= 0) return;
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  // Manage keyboard overlap (mobile) and focus behavior on OTP step
  useEffect(() => {
    if (step !== "otp") return;
    
    // Focus first empty otp box to open keyboard
    const firstEmpty = otp.findIndex((d) => !d);
    const idx = firstEmpty === -1 ? 0 : firstEmpty;
    const el = otpRefs.current[idx];
    
    if (el) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        el.focus();
        el.click(); // Additional click to ensure keyboard opens on mobile
      }, 100);
    }

    const vv = (typeof window !== 'undefined' && (window as any).visualViewport) as VisualViewport | undefined;
    function onResize() {
      if (!vv) return;
      const overlap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardOffset(overlap);
    }
    if (vv) {
      vv.addEventListener('resize', onResize);
      vv.addEventListener('scroll', onResize);
      onResize();
    }
    return () => {
      if (vv) {
        vv.removeEventListener('resize', onResize);
        vv.removeEventListener('scroll', onResize);
      }
      setKeyboardOffset(0);
    };
  }, [step, otp]);

  const validCountry = /^\+\d{1,3}$/.test(countryCode);
  const isValidPhone = /^\d{10}$/.test(phone);
  const isFormValid = validCountry && isValidPhone;
  const otpString = otp.join("");
  const isOtpComplete = otpString.length === 6;

  const sanitizePhone = (value: string) => value.replace(/[^0-9]/g, "").slice(0, 10);
  const formatTime = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  const handleSendOTP = async () => {
    if (!isFormValid) {
      setError(!validCountry ? "Select a valid country code" : "Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await authAPI.sendPhoneOTP({ phone: `${countryCode}${phone}` });
      if (res.success) {
        setStep("otp");
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError(res.message || "Failed to send OTP");
      }
    } catch (e: any) {
      console.error("sendPhoneOTP failed", e);
      setError("Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setError("");
      const res = await authAPI.resendPhoneOTP({ phone: `${countryCode}${phone}` });
      if (res.success) {
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        // Re-open keyboard
        requestAnimationFrame(() => otpRefs.current[0]?.focus());
      } else {
        setError(res.message || "Unable to resend OTP");
      }
    } catch (e: any) {
      console.error("resendPhoneOTP failed", e);
      setError("Unable to resend OTP");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value.replace(/[^0-9]/g, "");
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isOtpComplete) return;
    setVerifying(true);
    setError("");
    try {
      const res = await authAPI.verifyPhoneOTP({ phone: `${countryCode}${phone}`, otp: otpString });
      if (res.success) {
        // Close keyboard: blur active input
        if (typeof document !== 'undefined') {
          (document.activeElement as HTMLElement | null)?.blur?.();
          otpRefs.current.forEach((r) => r?.blur());
        }
        await refreshUser();
        setStep("success");
      } else {
        setError(res.message || "Invalid OTP. Please try again.");
        // Keep keyboard open for retry; focus first box
        requestAnimationFrame(() => otpRefs.current[0]?.focus());
      }
    } catch (e: any) {
      console.error("verifyPhoneOTP failed", e);
      setError("Invalid OTP. Please try again.");
      requestAnimationFrame(() => otpRefs.current[0]?.focus());
    } finally {
      setVerifying(false);
    }
  };

  const handleContinue = () => {
    router.replace("/student/profile");
  };

  const onPhoneChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPhone(sanitizePhone(e.target.value));
  };
  const onPhoneKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"]; 
    if (/^[0-9]$/.test(e.key) || allowed.includes(e.key)) return;
    e.preventDefault();
  };
  const onPhonePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    setPhone(sanitizePhone(text));
  };

  const isLabelFloating = phoneFocused || phone.length > 0;

  const handleGoogleStart = async () => {
    try {
      if (!API_BASE) throw new Error("NEXT_PUBLIC_API_URL missing");
      const endpoint = `${API_BASE}/v1/auth/google/start?role=student&mode=json`;
      console.log('Google start →', endpoint);
      const res = await fetch(endpoint, { method: 'GET', credentials: 'include' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `start_failed_${res.status}`);
      }
      const data = await res.json();
      if (!data?.url) throw new Error('no_authorize_url');
      window.location.href = data.url;
    } catch (e: any) {
      console.error("Google start failed", e);
      alert(`Google sign-in cannot start: ${e?.message || 'unknown_error'}`);
    }
  };

  const handleMicrosoftStart = () => {
    alert("Microsoft sign-in not configured yet. Please provide MS client details and start/callback endpoints.");
  };

  const handleAppleStart = () => {
    alert("Apple sign-in not configured yet. Please provide Apple credentials and start/callback endpoints.");
  };

  if (loading || shouldRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-stretch bg-white">
      {/* Top bar */}
      <div className="w-full flex items-center justify-start px-4 pt-4">
        <button onClick={() => router.back()} aria-label="Back" className="text-gray-700 text-lg">‹</button>
      </div>

      {/* Brand */}
      <div className="mt-2 flex flex-col items-center">
        <img src="/Too%20Clarity.png" alt="Too Clarity" className="h-10" />
      </div>

      {/* Step: phone entry */}
      {step === "phone" && (
        <div className="w-full max-w-md self-center px-4 mt-6">
          <h1 className="text-[20px] font-semibold text-[#111827]">Enter your phone number</h1>
          <p className="mt-2 text-[12px] text-[#6B7280]">We’ll send you a text with a verification code.</p>

          {/* Country code + number input to match mock */}
          <div className="mt-4">
            <div className={`relative rounded-[12px] h-[48px] bg-transparent border ${phoneFocused || isFormValid ? "border-[#2563EB]" : "border-[#DADADD]"} transition-colors`}> 
              {/* floating label */}
              <span
                onMouseDown={(e) => { e.preventDefault(); document.getElementById("phone-input")?.focus(); }}
                className={`absolute px-1 bg-white transition-all duration-150 ease-out
                ${isLabelFloating ? "-top-2 left-3 text-[11px] text-[#2563EB]" : "top-1/2 -translate-y-1/2 left-3 text-[14px] text-[#697282]"}`}
              >
                mobile number
              </span>
              <div className="flex items-center h-full px-3">
                {/* Country code styled as plain text but selectable */}
                <select
                  aria-label="Country code"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="appearance-none bg-transparent pr-1 text-[#111827] focus:outline-none"
                >
                  {countryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder=""
                  value={phone}
                  onChange={onPhoneChange}
                  onKeyDown={onPhoneKeyDown}
                  onPaste={onPhonePaste}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                  maxLength={10}
                  className="flex-1 h-full bg-transparent placeholder:text-[#697282] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <Button
            className={`w-full h-12 rounded-[12px] mt-4 ${isFormValid ? "bg-gradient-to-b from-[#2563EB] to-[#1E40AF] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]" : "bg-[#E5E7EB] text-[#111827] opacity-90"}`}
            disabled={!isFormValid || sending}
          >
            {sending ? "Sending..." : "Continue"}
          </Button>

          <p className="mt-6 text-center text-[14px] text-[#111827]">
            Don’t have an account? <Link href="/signup" className="text-[#2563EB]">Sign up</Link>
          </p>

          {/* OR divider */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-[12px] text-[#6B7280]">OR</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Fixed: Added proper spacing between social buttons */}
          <div className="mt-6 space-y-4">
            <a href={`${API_BASE}/v1/auth/google/start?role=student`} rel="noopener noreferrer">
              <SocialButton icon="/google.png" label="Continue with Google" onClick={handleGoogleStart} />
            </a>
            <SocialButton icon="/microsoft.png" label="Continue with Microsoft" onClick={handleMicrosoftStart} />
            <SocialButton icon="/apple.png" label="Continue with Apple" onClick={handleAppleStart} />
          </div>
        </div>
      )}

      {/* Step: OTP */}
      {step === "otp" && (
        <div className="w-full max-w-md self-center px-4 mt-6 pb-40">
          <h2 className="text-[20px] font-semibold">Verify account with OTP</h2>
          <p className="text-[12px] text-[#6B7280] mt-1">We have sent 6 digit code to {countryCode} {phone}</p>

          {/* Fixed: Improved OTP input focus and keyboard behavior */}
          <div className="flex gap-2 mt-6">
            {otp.map((d, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                ref={(el: HTMLInputElement | null) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={d}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onFocus={(e) => {
                  // Ensure keyboard opens on mobile
                  e.target.click();
                  e.target.focus();
                }}
                className={`w-12 h-12 text-center text-lg font-semibold rounded-[12px] border ${error ? "border-red-500" : "border-[#DADADD]"} bg-[#F5F6F9] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                autoComplete="one-time-code"
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-600 text-xs mt-2">Invalid OTP. Please try again.</p>
          )}

          <div className="text-[12px] text-[#6B7280] mt-4">
            {!canResend ? (
              <span>
                Didn’t get a code? : <span className="text-[#2563EB]">Resend OTP in {formatTime(timer)}</span>
              </span>
            ) : (
              <button onClick={handleResend} className="text-[#2563EB] hover:underline">Resend OTP</button>
            )}
          </div>

          {/* Bottom fixed verify button and policy text */}
          <div className="fixed left-0 right-0 bg-white pt-2 pb-4 px-4" style={{ bottom: Math.max(0, keyboardOffset) }}>
            <Button
              className={`w-full h-12 rounded-[12px] ${isOtpComplete ? "bg-gradient-to-b from-[#2563EB] to-[#1E40AF] text-white" : "bg-[#E5E7EB] text-[#9CA3AF]"}`}
              disabled={!isOtpComplete || verifying}
              onClick={handleVerify}
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </Button>
            <p className="mt-2 text-center text-[12px] text-[#6B7280] leading-5">
              By continuing, you agree to our
              <br />
              <a className="underline" href="#">T&C</a> and <a className="underline" href="#">Privacy</a> policy
            </p>
          </div>
        </div>
      )}

      {/* Step: Success */}
      {step === "success" && (
        <div className="w-full max-w-md self-center px-4 mt-10 flex flex-col items-center">
          <div className="w-40 h-40 rounded-full bg-green-100 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-green-200 flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
          </div>
          <p className="mt-6 text-green-700 font-semibold">OTP Verified Successfully</p>
          <Button className="w-full h-12 rounded-[12px] mt-8 bg-[#2563EB] hover:bg-[#1E40AF] text-white" onClick={handleContinue}>Continue</Button>
        </div>
      )}

      <div className="h-10" />
    </div>
  );
}

function SocialButton({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full mb-3 border border-[#E5E7EB] rounded-[12px] py-3 px-4 flex items-center justify-start gap-3 hover:bg-gray-50 transition">
      <img src={icon} alt="" className="w-5 h-5" />
      <span className="text-[14px] text-[#111827]">{label}</span>
    </button>
  );
} 
