import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PWARegister } from "@/components/pwa/pwa-register";
import { PWANav } from "@/components/pwa/pwa-nav";
import { ChatWidget } from "@/components/chat/chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "VisaSwitch — Smart Visa Navigation for Australia, UK, Canada & Japan",
    template: "%s | VisaSwitch",
  },
  description:
    "VisaSwitch helps you find the right visa pathway, plan your application step by step, audit your risk before lodging, and recover from refusals. Covering Australia, UK, Canada, and Japan.",
  keywords: ["visa", "immigration", "visa pathways", "Australia visa", "UK visa", "Canada PR", "Japan visa", "visa checklist", "visa refusal"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VisaSwitch",
  },
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <PWARegister />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
          <PWANav />
        </ThemeProvider>
      </body>
    </html>
  );
}
