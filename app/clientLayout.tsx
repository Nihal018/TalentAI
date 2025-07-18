"use client";

import type React from "react";

import { AuthProvider } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Footer } from "../components/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <main>{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
