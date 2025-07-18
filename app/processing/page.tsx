"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Brain, FileText, Search, Users, CheckCircle, Zap } from "lucide-react";
import { Header } from "../../components/header";

export default function ProcessingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: FileText,
      title: "Parsing Resume",
      description: "Extracting text and analyzing document structure",
      duration: 2000,
    },
    {
      icon: Brain,
      title: "AI Skills Analysis",
      description:
        "Identifying technical skills, soft skills, and competencies",
      duration: 3000,
    },
    {
      icon: Search,
      title: "Job Market Scanning",
      description: "Searching through 50,000+ active job postings",
      duration: 2500,
    },
    {
      icon: Zap,
      title: "Compatibility Matching",
      description: "Calculating match scores using advanced algorithms",
      duration: 2000,
    },
    {
      icon: Users,
      title: "Employer Preferences",
      description: "Analyzing employer requirements and preferences",
      duration: 1500,
    },
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const runStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        // All steps completed, redirect to jobs page
        setTimeout(() => {
          router.push("/jobs");
        }, 1000);
        return;
      }

      setCurrentStep(stepIndex);
      setProgress(0);

      // Animate progress for current step
      const stepDuration = steps[stepIndex].duration;
      const progressInterval = 50;
      const progressIncrement = 100 / (stepDuration / progressInterval);

      progressTimer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + progressIncrement;
          if (newProgress >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return newProgress;
        });
      }, progressInterval);

      // Move to next step after duration
      stepTimer = setTimeout(() => {
        runStep(stepIndex + 1);
      }, stepDuration);
    };

    runStep(0);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [router]);

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center mt-16 pt-6">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <Brain className="h-16 w-16 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI is Analyzing Your Resume
            </h1>
            <p className="text-xl text-gray-600">
              Our advanced algorithms are finding the perfect job matches for
              you
            </p>
          </div>

          {/* Processing Steps */}
          <div className="space-y-6 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center p-6 rounded-lg border transition-all duration-500 ${
                    isActive
                      ? "bg-blue-50 border-blue-200 shadow-lg scale-105"
                      : isCompleted
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon
                        className={`h-6 w-6 ${isActive ? "animate-pulse" : ""}`}
                      />
                    )}
                  </div>

                  <div className="flex-grow text-left">
                    <h3
                      className={`font-semibold text-lg ${
                        isActive
                          ? "text-blue-900"
                          : isCompleted
                          ? "text-green-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isActive
                          ? "text-blue-700"
                          : isCompleted
                          ? "text-green-700"
                          : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Progress bar for active step */}
                    {isActive && (
                      <div className="mt-3">
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-100 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Processing Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {currentStep < 2 ? "..." : "47,832"}
              </div>
              <div className="text-sm text-gray-600">Jobs Scanned</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {currentStep < 3 ? "..." : "156"}
              </div>
              <div className="text-sm text-gray-600">Potential Matches</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {currentStep < 4 ? "..." : "23"}
              </div>
              <div className="text-sm text-gray-600">High Compatibility</div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 mb-12">
            <h3 className="font-semibold text-gray-900 mb-2">Did you know?</h3>
            <p className="text-sm text-gray-700">
              Our AI processes over 200 data points from your resume and
              compares them against millions of job requirements to find your
              perfect match. This usually takes 2-3 minutes but saves you hours
              of manual job searching!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
