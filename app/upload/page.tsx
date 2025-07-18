"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Brain, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "../../components/header";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const isValidType =
      allowedTypes.includes(file.type) ||
      allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      alert("Please upload a PDF, DOC, or DOCX file");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setFile(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setFile(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDropZoneClick = () => {
    if (!file) {
      fileInputRef.current?.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && name && email) {
      // Simulate processing and redirect to loading page
      router.push("/processing");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-16">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upload Your Resume
            </h1>
            <p className="text-xl text-gray-600">
              Let our AI analyze your skills and find the perfect job matches
              for you
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-6 w-6 text-blue-600 mr-2" />
                AI-Powered Resume Analysis
              </CardTitle>
              <CardDescription>
                Our advanced AI will analyze your resume to understand your
                skills, experience, and career preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Resume Upload</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : file
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleDropZoneClick}
                  >
                    {file ? (
                      <div className="space-y-2">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                        <div className="text-lg font-semibold text-green-700">
                          {file.name}
                        </div>
                        <div className="text-sm text-green-600">
                          Ready for AI analysis
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                        >
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <div className="text-lg font-semibold text-gray-700 mb-2">
                            Drop your resume here, or click to browse
                          </div>
                          <div className="text-sm text-gray-500">
                            Supports PDF, DOC, DOCX files up to 10MB
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleButtonClick();
                          }}
                          className="bg-transparent mt-4"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* AI Features */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    What our AI will analyze:
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Skills and technical competencies</li>
                    <li>• Work experience and career progression</li>
                    <li>• Education and certifications</li>
                    <li>• Industry preferences and job requirements</li>
                    <li>• Salary expectations and location preferences</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  disabled={!file || !name || !email}
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Start AI Analysis
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              🔒 Your resume is processed securely and never shared without your
              consent
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
