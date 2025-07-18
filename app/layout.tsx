import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import ClientLayout from "./clientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TalentAI - AI-Powered Job Search Platform",
  description:
    "Find your dream job with AI-powered matching and skill assessments",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          <main className="min-h-screen">{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
}
