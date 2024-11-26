import { Suspense } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";

import ScrollToTop from "@/components/scroll-to-top";
import CurrentDeviceContextProvider from "@/contexts/device";
import AuthProvider from "@/contexts/auth";

import "./globals.css";
import ReactQueryWrapper from "@/services/react-query";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Referrer - your go to solution for referrals",
    template: "",
  },
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryWrapper>
          <AuthProvider>
            <CurrentDeviceContextProvider>
              <Suspense>
                <ScrollToTop />
              </Suspense>
              {children}
            </CurrentDeviceContextProvider>
          </AuthProvider>
        </ReactQueryWrapper>
      </body>
    </html>
  );
}
