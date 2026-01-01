import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verified.Doctor - The Blue Checkmark for Medical Professionals",
  description: "Premium digital identity and reputation management for doctors. Claim your verified profile today.",
  keywords: ["doctor verification", "medical professional", "digital identity", "healthcare"],
  icons: {
    icon: "/verified-doctor-logo.svg",
    shortcut: "/verified-doctor-logo.svg",
    apple: "/verified-doctor-logo.svg",
  },
  openGraph: {
    title: "Verified.Doctor",
    description: "The Blue Checkmark for Medical Professionals",
    url: "https://verified.doctor",
    siteName: "Verified.Doctor",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Verified.Doctor",
    description: "The Blue Checkmark for Medical Professionals",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
