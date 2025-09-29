
"use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";


import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Footer from "@/components/ui/footer";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  Users,
  BarChart3,
  ArrowRight,
  X,
  Menu,
  Check,
  Target,
  Award,
  BookOpen,
  Globe,
  Shield,
  Zap,
  Divide,
} from "lucide-react";
import Header from "@/components/ui/Header";
import SignUpDialog from "@/components/auth/SignUpDialog";
import LoginDialogBox from "@/components/auth/LoginDialogBox";
import { useAuth } from "../lib/auth-context";

import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import StaticDashboardCard from "@/components/LandingPage/DashboardCard";
import StaticLeadsManagementCard from "@/components/LandingPage/LeadManagementCard";
import AnalyticsDashboardCard from "@/components/LandingPage/DataInsightsCard";
import ListedProgramsCard from "@/components/LandingPage/BillingListingCard";
import SettingsDashboardCard from "@/components/LandingPage/SettingsCard";
import { CardStack } from "@/components/ui/card-stack";

import DummyDashboard from "@/components/LandingPage/DummyDashboard";
import FeaturesPage from "./features/page";
import ScrollingBoxContainer from "@/components/ui/ScrollingBoxContainers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Main App Component
const App = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth(); // <-- Added
  const router = useRouter();
  const pathname = usePathname();

  // // Handle automatic redirects based on user state
  // useEffect(() => {
  //   if (!isAuthenticated || !user) return;

  //   // Redirect rules for INSTITUTE_ADMIN
  //   if (user.role === "INSTITUTE_ADMIN") {
  //     if (user.isPaymentDone === true && user.isProfileCompleted === true) {
  //       router.replace("/dashboard");
  //       return;
  //     }
  //     if (user.isPaymentDone === false && user.isProfileCompleted === true) {
  //       router.replace("/payment");
  //       return;
  //     }
  //   }
  // }, [isAuthenticated, user, router]); 

  return (
    <div className="min-h-screen bg-[#F5F6F9]">
      <Header setIsSignUpOpen={setIsSignUpOpen} />
      <main className="pt-20">
        {pathname === "/features" ? (
          <FeaturesPage />
        ) : (
          <HomePage
            setIsSignUpOpen={setIsSignUpOpen}
            setIsLoginOpen={setIsLoginOpen}
          />
        )}
      </main>
      <Footer />

      {/* Authentication Dialogs */}
      <SignUpDialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen} />
      {/* <LoginDialogBox open={isLoginOpen} onOpenChange={setIsLoginOpen} /> */}
    </div>
  );
};

// FAQ Component
const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the cost to list my institution on Too Clarity?",
      answer:
        "Too Clarity provides a verified marketplace where educational institutions can showcase their programs and connect directly with students who are actively searching for quality education opportunities.",
    },
    {
      question: "How does Too Clarity ensure the quality of student leads?",
      answer:
        "We focus exclusively on quality leads and verified institutions. Our platform is designed to reduce costs while increasing reach, ensuring both students and institutions get the best possible matches.",
    },
    {
      question: "Can I edit my institute or program details after my listing is live?",
      answer:
        "We offer the first two months completely free! After that, our pricing is competitive and designed to provide excellent ROI for educational institutions of all sizes.",
    },
    {
      question: "What information should I have ready before I start the listing process?",
      answer:
        "Absolutely! Our comprehensive dashboard provides detailed analytics including program views, student inquiries, conversion rates, and much more to help you optimize your listings.",
    },
    {
      question: "What kind of analytics and performance data will I be able to see?",
      answer:
        "Once your profile is set up and verified, you can start receiving qualified inquiries within 24-48 hours. Our platform connects you with students who are actively searching.",
    },
    {
      question: "My program listing is about to expire. How do I renew it?",
      answer:
        "Once your profile is set up and verified, you can start receiving qualified inquiries within 24-48 hours. Our platform connects you with students who are actively searching.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      Have Questions? We Have <br /> Answers.
    </h2>
    <p className="text-xl text-gray-600">
      We've compiled answers to the most common questions
      <br /> we get from institutions.
    </p>
  </div>

  {/* FAQ Accordion */}
  <section className="max-w-4xl mx-auto py-16 px-4">
    <Accordion type="single" collapsible className="w-full flex flex-col font-montserrat">
      {faqs.map((item, idx) => (
        <AccordionItem
          key={idx}
          value={`item-${idx + 1}`}
          className="w-full border-b border-gray-700 last:border-b-0" // darker border // bottom border line separation
        >
          <AccordionTrigger className="flex w-full items-center justify-between px-6 py-4 font-medium transition-colors hover:bg-gray-100 hover:no-underline text-left text-sm sm:text-base">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="w-full px-6 pb-4 pt-2 text-gray-600 text-sm sm:text-base">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
</div>

  );
};

// Home Page Component
const HomePage = ({ setIsSignUpOpen, setIsLoginOpen }: { setIsSignUpOpen: (open: boolean) => void; setIsLoginOpen: (open: boolean) => void }) => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Redirect rules for INSTITUTE_ADMIN
    if (user.role === "INSTITUTE_ADMIN") {
      if (user.isPaymentDone === true && user.isProfileCompleted === true) {
        router.replace("/dashboard");
        return;
      }
      if(user.isPaymentDone === false && user.isProfileCompleted == false){
        router.replace("/signup");
        return;
      }
      if (user.isPaymentDone === false && user.isProfileCompleted === true) {
        router.replace("/payment");
        return;
      }
    }

    if(user.role === "STUDENT"){
      if(user.isProfileCompleted === false){
        router.replace("/student/onboarding");
        return;
      }
      router.replace("/dashboard");
      return;
    }

  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  const handleGetStarted = () => {
    setSignUpDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F9]">
      {/* Promo Banner */}
      <div className="bg-blue-50 py-3 px-4 flex items-center justify-center relative">
  <p className="text-gray-700">
    First two months listing free{" "}
    <button
      className="text-blue-600 hover:underline font-semibold"
      onClick={() => setIsSignUpOpen(true)}
    >
      Get started →
    </button>
  </p>

  {/* Close button */}
  <button
    className="absolute right-4 text-gray-500 hover:text-gray-700 font-bold"
    onClick={() => console.log("Close clicked")}
  >
    ×
  </button>
</div>


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 via-blue-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
  className="font-sora font-semibold text-[40px] leading-[100%] tracking-[0] text-center text-[#060B13] mb-6  p-4 rounded-lg"
>
  Unlock Your Institution's
  <br />
  <span className="text-[#060B13]-400">Global Reach</span>
</h1>

          <p className="font-montserrat font-medium text-[20px] leading-[100%] tracking-[0] text-center text-gray-600 mb-8 max-w-3xl mx-auto">
  Connect directly with students actively seeking quality education with a verified marketplace.
</p>

         <div className="flex flex-col sm:flex-row justify-center gap-[24px] w-[424px] h-[48px] opacity-100 mx-auto">
  {/* Sign Up Button */}
  <button
    className="w-[200px] h-[48px] hover:cursor-pointer bg-[#0222D7] text-white font-medium text-[16px] rounded-[12px] flex items-center justify-center transition-colors hover:bg-blue-80"
    onClick={() => setIsSignUpOpen(true)}
  >
   <div className="font-montserrat font-semibold text-[18px] leading-[100%] tracking-[0]">
  Sign up for free
</div>

  </button>

  {/* Contact Sales Button */}
  <button
    className="w-[200px] h-[48px] hover:cursor-pointer bg-white text-gray-700 font-medium text-[16px] rounded-[12px] border border-[#808897] flex items-center justify-center transition-colors hover:bg-gray-5"
    onClick={() => setIsLoginOpen(true)}
  >
    Contact sales
  </button>
</div>
</div>
      </section>

      {/* Card Stacks */}
      <div className="flex justify-center items-start min-h-screen p-4 bg-gray-50">
        <div className="h-[95vh] w-[90%] rounded-2xl shadow-lg">
          <CardStack
            items={[
              {
                id: 1,
                name: "",
                designation: "",
                content: (
                  <div className="h-full w-full flex items-stretch">
                    <DummyDashboard />
                  </div>
                ),
              },
              {
                id: 2,
                name: "",
                designation: "",
                content: <div className="h-full w-full"></div>,
              },
              {
                id: 3,
                name: "",
                designation: "",
                content: <div className="h-full w-full"></div>,
              },
            ]}
            containerHeight="100%"
            containerWidth="100%"
            offset={10}
            scaleFactor={0.04}
            autoFlip={false}
          />
        </div>
      </div>
      
      {/* Getting Started Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="min-h-screen bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h1 className="text-5xl font-bold text-black mb-6 tracking-tight">
                Getting Started is Easy
              </h1>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                Create your profile in minutes to reach thousands
                <br />
                of actively searching students. Here's how.
              </p>
            </div>
            <div className="relative max-w-6xl mx-auto">
              {/* Step 1 - Create Your Listing (Top Left) */}
              <div className="absolute left-0 top-0 w-80">
                <div className="bg-gradient-to-br from-pink-200 via-pink-250 to-pink-300 rounded-3xl p-8 h-72 relative">
                  <div className="flex items-center justify-center mb-12">
                    <div className="w-4 h-4 bg-pink-600 rounded-full"></div>
                    <div className="w-16 h-0.5 bg-pink-400 mx-2"></div>
                    <div className="w-4 h-4 bg-pink-400 rounded-full border-2 border-white"></div>
                    <div className="w-16 h-0.5 bg-pink-300 mx-2"></div>
                    <div className="w-4 h-4 bg-pink-300 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-black mb-4 leading-tight">
                      Create Your
                      <br />
                      Listing
                    </h2>
                    <p className="text-lg text-gray-700 font-medium">
                      Showcase your programs with
                      <br />
                      details.
                    </p>
                  </div>
                </div>
              </div>
              {/* Step 2 - Reach Qualified Students (Center) */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-16 w-80">
                <div className="bg-gradient-to-br from-purple-200 via-purple-250 to-purple-300 rounded-3xl p-8 h-72 relative">
                  <div className="flex items-center justify-center mb-12">
                    <div className="w-4 h-4 bg-purple-300 rounded-full border-2 border-white"></div>
                    <div className="w-16 h-0.5 bg-purple-500 mx-2"></div>
                    <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                    <div className="w-16 h-0.5 bg-purple-400 mx-2"></div>
                    <div className="w-4 h-4 bg-purple-300 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-black mb-4 leading-tight">
                      Reach Qualified
                      <br />
                      Students
                    </h2>
                    <p className="text-sm text-gray-700 font-medium">
                      Receive inquiries, view analytics,
                      <br />
                      and track your performance.
                    </p>
                  </div>
                </div>
              </div>
              {/* Step 3 - Manage Your Dashboard (Top Right) */}
              <div className="absolute right-0 top-8 w-80">
                <div className="bg-gradient-to-br from-blue-200 via-blue-250 to-blue-300 rounded-3xl p-8 h-72 relative">
                  <div className="flex items-center justify-center mb-12">
                    <div className="w-4 h-4 bg-blue-300 rounded-full border-2 border-white"></div>
                    <div className="w-16 h-0.5 bg-blue-500 mx-2"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-16 h-0.5 bg-blue-600 mx-2"></div>
                    <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-black mb-4 leading-tight">
                      Manage Your
                      <br />
                      Dashboard
                    </h2>
                    <p className="text-sm text-gray-700 font-medium">
                      Your profile gets shown Your
                      <br />
                      profile gets shown searching for you.
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-96"></div>
            </div>
          </div>
          <style jsx>{`
            .via-pink-250 {
              --tw-gradient-via: rgb(251 207 232);
            }
            .via-purple-250 {
              --tw-gradient-via: rgb(233 213 255);
            }
            .via-blue-250 {
              --tw-gradient-via: rgb(191 219 254);
            }
          `}</style>
        </div>
      </section>
      {/* Features Section with Scrolling Boxes */}
<section className="py-20 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      {/* Left Content */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          The clear path to better admissions.
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Packed with tools to grow your reach without increasing your costs,
          all focused on quality leads.
        </p>
        <button
  onClick={() => router.push("/features")}
  className="inline-flex items-center justify-center gap-2 w-[216px] h-[40px] px-4 py-2 border border-gray-300 rounded-[24px] text-gray-700 font-medium text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
>
  Show all features <ArrowRight className="h-4 w-4" />
</button>

      </div>

      {/* Scrolling Columns */}
      <div className="grid grid-cols-2 gap-6 overflow-hidden">
        <ScrollingBoxContainer direction="up" boxes={leftBoxes} />
        <ScrollingBoxContainer direction="down" boxes={rightBoxes} />
      </div>
    </div>
  </div>
</section>


      {/* FAQ Section */}
      <section className="bg-gray-50">
        <FAQ />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
  <div
    className="mx-auto bg-white shadow-lg rounded-[12px] flex flex-col items-center text-center"
    style={{
      maxWidth: "1122px",
      minHeight: "296px",
      padding: "24px 24px 50px 24px",
      gap: "42px",
      opacity: 1,
    }}
  >
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
      Your future students are searching.
      <br />
      Will they find you?
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl">
      Don't miss out on connecting with the next generation of talent.
      Create your listing on Too Clarity today
    </p>

    <button
      className="w-[176px] h-[48px] bg-[#0222D7] hover:cursor-pointer text-white font-semibold text-[16px] rounded-[12px] flex items-center justify-center transition-colors hover:bg-blue-800"
      onClick={() => setIsSignUpOpen(true)}
    >
      Sign up for free
    </button>
  </div>
</section>

    </div>
  );
};



export default App;