"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { jobService, applicationService } from "@/lib/data-service";
import type { Jobs } from "@/lib/database.types";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Users,
  Globe,
  Briefcase,
  CheckCircle,
  Star,
  Heart,
  Share2,
  ExternalLink,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "../../../components/footer";
import { Header } from "../../../components/header";

interface JobWithApplicants extends Jobs {
  applicants?: number;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const jobId = params.id as string;
  const shouldShowApplyModal = searchParams.get("apply") === "true";

  const [job, setJob] = useState<JobWithApplicants | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  useEffect(() => {
    if (shouldShowApplyModal && user?.role === "job_seeker") {
      handleApply();
    }
  }, [shouldShowApplyModal, user]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const jobData = await jobService.getById(jobId);

      if (jobData) {
        const jobWithApplicants: JobWithApplicants = {
          ...jobData,
          applicants: Math.floor(Math.random() * 50) + 10,
        };
        setJob(jobWithApplicants);
      }
    } catch (error) {
      console.error("Error loading job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user || !job) return;

    setApplying(true);

    try {
      // Check if user has uploaded a resume
      if (user.role === "job_seeker" && !user.hasUploadedResume) {
        // Redirect to upload page
        router.push("/upload");
        return;
      }

      // Create application
      await applicationService.create({
        job_id: job.id,
        resume_id: "mock-resume-id", // In real app, get actual resume ID
        status: "pending",
        score: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
      });

      setHasApplied(true);

      // Show success and redirect after delay
      setTimeout(() => {
        router.push("/jobs?applied=true");
      }, 2000);
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setApplying(false);
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const formatSalary = (salary: string | null) => {
    if (!salary) return "Competitive salary";
    return salary;
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Posted 1 day ago";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
    return `Posted ${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Job not found
          </h3>
          <p className="text-gray-600 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/browse-jobs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" asChild className="bg-transparent">
                <Link href="/browse-jobs">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Jobs
                </Link>
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={toggleSave}
                  className="bg-transparent"
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      isSaved ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {isSaved ? "Saved" : "Save Job"}
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Job Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {job.company.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-lg text-gray-600 mb-4">
                    <span className="font-semibold text-blue-600">
                      {job.company}
                    </span>
                    <span>•</span>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location || "Location not specified"}
                    </div>
                    {job.remote && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary">
                          <Globe className="h-3 w-3 mr-1" />
                          Remote
                        </Badge>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatSalary(job.salary)}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.type || "Full-time"}
                    </div>
                    {job.experience && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {job.experience}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatPostedDate(job.posted_date)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {job.applicants || 0} applicants
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              {user?.role === "job_seeker" && (
                <div className="lg:w-64 flex-shrink-0">
                  {hasApplied ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800 font-semibold">
                        Application Submitted!
                      </p>
                      <p className="text-green-600 text-sm">
                        We'll be in touch soon.
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                    >
                      {applying ? "Applying..." : "Apply Now"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    About {job.company}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {job.company}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      A leading technology company focused on innovation and
                      growth.
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Industry</span>
                      <span className="font-medium">Technology</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Company Size</span>
                      <span className="font-medium">1,000+ employees</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Founded</span>
                      <span className="font-medium">2010</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Company Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Job Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Job Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Applications</span>
                    <span className="font-semibold">{job.applicants || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Views</span>
                    <span className="font-semibold">
                      {Math.floor((job.applicants || 0) * 3.5)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Posted</span>
                    <span className="font-semibold">
                      {formatPostedDate(job.posted_date).replace("Posted ", "")}
                    </span>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      85%
                    </div>
                    <div className="text-sm text-gray-600">Match Score</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on your profile
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Similar Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <h4 className="font-medium text-sm text-gray-900 mb-1">
                        Senior Developer
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        TechCorp • San Francisco
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium">
                          90% match
                        </span>
                        <span className="text-xs text-gray-500">
                          2 days ago
                        </span>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link href="/browse-jobs">View More Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
