import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import ToastProvider from "@/components/ui/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const Montserrat = Geist_Mono({
  variable: "--font-Montserrat",
  subsets: ["latin"],
});

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${Montserrat.variable} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <ToastProvider />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


