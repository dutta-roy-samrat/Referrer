import { Suspense } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";

import { ToastContainer } from "react-toastify";

import ScrollToTop from "@/components/scroll-to-top";
import CurrentDeviceContextProvider from "@/contexts/device";
import ReactQueryWrapper from "@/services/react-query";
import ApolloGraphqlWrapper from "@/services/apollo-graphql";

import styles from "./main.module.css";
import "./globals.css";

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
    <html lang="en" className={styles.html}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${styles.body}`}
      >
        <ToastContainer />
        <ApolloGraphqlWrapper>
          <ReactQueryWrapper>
            <CurrentDeviceContextProvider>
              <Suspense>
                <ScrollToTop />
              </Suspense>
              <div className={styles.content}>{children}</div>
            </CurrentDeviceContextProvider>
          </ReactQueryWrapper>
        </ApolloGraphqlWrapper>
      </body>
    </html>
  );
}
