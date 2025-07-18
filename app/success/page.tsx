"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Brain,
  Mail,
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "../../components/footer";
import { Header } from "../../components/header";

export default function SuccessPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your assessment has been successfully submitted to TechCorp Inc. Our
            AI has identified you as an excellent match for the Senior Software
            Engineer position.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-1">
                Assessment Complete
              </h3>
              <p className="text-sm text-green-700">Score: 85% - Excellent!</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-1">Profile Sent</h3>
              <p className="text-sm text-blue-700">Delivered to HR team</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-1">Next Steps</h3>
              <p className="text-sm text-purple-700">Response in 24-48hrs</p>
            </CardContent>
          </Card>
        </div>

        {/* What Happens Next */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              What Happens Next?
            </CardTitle>
            <CardDescription className="text-lg">
              Here's the timeline for your application process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Assessment Submitted
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your responses and resume have been sent to TechCorp Inc.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Completed just now
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">HR Review</h3>
                  <p className="text-gray-600 text-sm">
                    The hiring team will review your profile and assessment
                    results.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Expected: Within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Initial Contact
                  </h3>
                  <p className="text-gray-600 text-sm">
                    If selected, you'll receive an email or phone call for the
                    next interview round.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Expected: 24-48 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Interview Process
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Technical and cultural fit interviews with the engineering
                    team.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Timeline: 1-2 weeks
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Important Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Contact Details
                </h4>
                <p className="text-gray-600">
                  📧 You'll hear from: hr@techcorp.com
                </p>
                <p className="text-gray-600">
                  📱 Or via phone: +1 (555) 123-4567
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Reference Number
                </h4>
                <p className="text-gray-600">
                  Application ID:{" "}
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    TC-2024-SE-001
                  </span>
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Keep this for your records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/jobs">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent"
            >
              View More Jobs
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              Return to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">
            <strong>Thank you for using TalentAI!</strong>
          </p>
          <p className="text-sm text-gray-500">
            We'll notify you immediately when there's an update on your
            application. Good luck with your interview process! 🚀
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
