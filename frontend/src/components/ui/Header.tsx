"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Menu } from "lucide-react";
import { cn } from "@/lib/utils"; // A utility for conditional class names

interface HeaderProps {
  setIsSignUpOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSignUpOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
  className={cn(
    "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out opacity-100"
  )}
  style={{ backgroundColor: "transparent" }}
>
  <div className="w-[1440px] mx-auto px-[80px]">
    <div className="flex justify-between items-center h-[70px]">
      
      {/* Logo Section */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="flex items-center space-x-2">
          <img
            src="/OO_black_whiteBG (1).png"
            alt="Too Clarity Logo"
            width={35}
            height={35}
          />
          <span className="text-2xl font-bold text-gray-900">
            TOO CLARITY
          </span>
        </div>
      </div>

      {/* Desktop Button */}
      <div className="hidden md:flex items-center space-x-4">
        <button
          className="w-[200px] h-[48px] hover:cursor-pointer bg-[#0222D7] text-white font-medium text-[16px] rounded-[12px] flex items-center justify-center transition-colors hover:bg-blue-800"
          onClick={() => setIsSignUpOpen(true)}
        >
          Sign up for free
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-900"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMenuOpen && (
    <div className="md:hidden bg-white/90 backdrop-blur-sm border-t">
      <div className="px-4 py-4 space-y-2">
        <button
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          onClick={() => {
            setIsSignUpOpen(true);
            setIsMenuOpen(false);
          }}
        >
          Sign up for free
        </button>
      </div>
    </div>
  )}
</header>

  );
};

export default Header;