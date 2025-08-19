"use client";

import Link from "next/link";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const features = [
  {
    title: "Get Discovered",
    desc: "Showcase your institution to qualified audiences searching for courses just like yours.",
    logo: "/get%20discovered.png",
  },
  {
    title: "Drive Growth",
    desc: "Engage directly with applicants and manage leads via an analytics dashboard.",
    logo: "/Drive%20Growth.png",
  },
  {
    title: "Optimize Budget",
    desc: "Reduce wasted marketing spend by focusing on high-quality applicants.",
    logo: "/Optimise%20Budget.png",
  },
];

const steps = [
  {
    title: "Create Profile",
    desc: "Get started in minutes with our guided setup and unique showcase of prospective students.",
    logo: "/Create%20Profile.png",
  },
  {
    title: "Showcase Programs",
    desc: "Easily list courses with rich details, including requirements and benefits.",
    logo: "/Show%20programs.png",
  },
  {
    title: "Track Results",
    desc: "Monitor performance and metrics for all your campaigns in one place.",
    logo: "/Track%20results.png",
  },
];

const faqs = [
  {
    q: "How long does registration take?",
    a: "Our registration is designed to be quick. You can complete the initial set within 5–7 minutes.",
  },
  {
    q: "Can the Admin role be changed later?",
    a: "Yes, you can change the Admin role in the settings at any time.",
  },
  {
    q: "Is this platform free?",
    a: "We offer both free and premium plans depending on your needs.",
  },
  {
    q: "What information do I need?",
    a: "You’ll need basic company details, an email address, and a secure password to get started.",
  },
  {
    q: "Can I add multiple team users?",
    a: "Yes, you can invite and manage multiple team members from your dashboard.",
  },
];


export default function LandingPage() {
  return (
    <main className="font-montserrat text-gray-800 animate-fadeIn bg-[#FBF9F5]">
      {/* Navbar */}
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 flex justify-between items-center bg-[#FBF9F5] z-50 w-[1440px] h-[80px] px-5">
        <div className="transition-transform duration-300">
          <img src="/Too%20Clarity.png" alt="Too Clarity Logo" className="h-7 w-auto" />
        </div>
        <div className="flex gap-6 mr-0">
          <Button variant="login" size="lg">Log In</Button>
          <Button variant="signup" size="lg">Sign Up</Button>


          
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-40 pb-16 px-4 animate-fadeIn">
        <h1 className="font-sora font-semibold text-[48px]">
          Unlock Your <span className="text-blue-700">Institution&apos;s</span> <br />
          <span className="text-blue-700 text-[45px]">Global Reach</span>
        </h1>
        <p className="font-montserrat font-medium text-[16px] leading-[24px] tracking-[1px] text-[#697282] w-[659px] mx-auto opacity-90 mt-6">
          Connect directly with students actively seeking quality education with a verified and transparent marketplace.
        </p>
        <div className="flex justify-center mt-6">
          <button className="relative w-[160px] h-[48px] rounded-[12px] bg-blue-700 text-white font-montserrat font-medium text-[18px] flex items-center justify-center overflow-hidden">
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-50 animate-shimmer"></span>
          </button>
        </div>
        <p className="text-gray-500 mt-3 text-sm">0% listing fee for the first 2 months.</p>
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-150%); }
            100% { transform: translateX(150%); }
          }
          .animate-shimmer { animation: shimmer 3s infinite; }
        `}</style>
      </section>

      {/* Why Partner */}
      <section className="text-center py-10 px-4">
        <h1 className="font-sora font-semibold text-[48px] mb-6">
          Why should you partner with <br />
          <span className="text-blue-700">Too Clarity?</span>
        </h1>
        <div className="flex justify-between max-w-[1162px] mx-auto py-10 px-4">
          {features.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center w-[350px] h-[194px] gap-4 p-3">
              <img src={item.logo} alt={item.title} className="w-[70px] h-[70px] object-contain" />
              <h3 className="font-semibold text-[20px]">{item.title}</h3>
              <p className="text-[#697282] text-[14px] leading-[24px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How Simple */}
      <section className="text-center py-16 px-4 bg-[#FBF9F5]">
        <h1 className="font-sora font-semibold text-[48px] mb-12">
          How simple is it to <span className="text-blue-700">connect</span>
        </h1>
        <div className="flex justify-between max-w-[1162px] mx-auto py-10 px-4">
          {steps.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center w-[350px] h-[194px] gap-4 p-3">
              <img src={item.logo} alt={item.title} className="w-[70px] h-[70px] object-contain" />
              <h3 className="font-semibold text-[20px]">{item.title}</h3>
              <p className="text-[#697282] text-[14px] leading-[24px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="font-sora font-semibold text-center text-[48px] mb-8">
          Frequently Asked <span className="text-blue-700">Questions</span>
        </h1>
        <Accordion type="single" collapsible className="w-full flex flex-col items-center space-y-4 font-montserrat">
          {faqs.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx + 1}`}
              className="relative w-[630px] rounded-[30px] bg-[#F5F4F4] border shadow-[inset_0px_6px_6px_0px_#68686808,inset_0px_3px_3px_0px_#68686803,inset_0px_9px_9px_0px_#00000008]"
            >
              <div className="absolute inset-0 rounded-[30px] p-[1px] bg-[linear-gradient(180deg,rgba(245,244,244,0.05)_0%,rgba(231,230,230,0.0550481)_10.1%,rgba(213,212,212,0.0612981)_22.6%,rgba(198,197,197,0.0668269)_33.65%,rgba(185,185,185,0.0711538)_42.31%,rgba(169,169,169,0.0769231)_53.85%,rgba(148,148,148,0.084375)_68.75%,rgba(124,124,124,0.0929487)_86.38%,rgba(104,104,104,0.1)_100%)]">
                <div className="w-full h-full rounded-[30px] bg-[#F5F4F4]" />
              </div>
              <AccordionTrigger className="relative z-10 flex w-full items-center justify-between px-3 py-4 font-medium rounded-[30px] transition-colors hover:no-underline data-[state=closed]:hover:bg-blue-700 data-[state=closed]:hover:text-white">
                <span className="flex-1 text-left">{item.q}</span>
              </AccordionTrigger>
              <AccordionContent className="relative z-10 w-full px-3 pb-4 pt-2 text-gray-600">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
