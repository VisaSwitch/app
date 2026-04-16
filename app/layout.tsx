import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VisaSwitch — Smart Visa Navigation for Australia, UK, Canada & Japan",
    template: "%s | VisaSwitch",
  },
  description:
    "VisaSwitch helps you find the right visa pathway, plan your application step by step, audit your risk before lodging, and recover from refusals. Covering Australia, UK, Canada, and Japan.",
  keywords: ["visa", "immigration", "visa pathways", "Australia visa", "UK visa", "Canada PR", "Japan visa", "visa checklist", "visa refusal"],
  openGraph: {
    title: "VisaSwitch — Smart Visa Navigation",
    description: "Find your visa pathway, plan your application, and maximise your chance of success.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black text-white antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
