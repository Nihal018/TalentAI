"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DataTable,
  type Column,
  type FilterOption,
} from "@/components/ui/data-table";
import { JobForm } from "@/components/forms/job-form";
import { useJobCrud } from "@/hooks/use-crud";
import { dataStore } from "@/lib/data-store";
import {
  Plus,
  Users,
  Briefcase,
  MapPin,
  Star,
  TrendingUp,
  Activity,
  Building2,
  Search,
} from "lucide-react";
import Link from "next/link";
import type { JobListing, Application } from "@/lib/data-store";
import { Header } from "../../components/header";

export default function EmployerPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  const {
    jobs,
    loading: jobsLoading,
    searchJobs,
    createJob,
    updateJob,
    deleteJob,
  } = useJobCrud(user?.company);

  // ✅ FIX #1: Keep this effect to fetch data on initial load and navigation.
  // We'll wrap searchJobs in useCallback to stabilize its identity.
  const memoizedSearchJobs = useCallback(() => {
    if (user?.company) {
      searchJobs({ filters: { company: user.company } });
    }
  }, [user?.company, searchJobs]);

  useEffect(() => {
    memoizedSearchJobs();
  }, [memoizedSearchJobs]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "employer")) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  // ✅ FIX #2: Correctly calculate applications using the `jobs` state variable.
  // This effect now properly uses its dependency instead of going back to the dataStore.
  useEffect(() => {
    if (user?.company && jobs.length > 0) {
      const companyApplications = jobs.flatMap((job) =>
        dataStore.applications.getByJobId(job.id)
      );
      setApplications(companyApplications);
    } else {
      setApplications([]); // Clear applications if there are no jobs
    }
  }, [user?.company, jobs]); // Depends only on jobs and user

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg text-gray-600">
            Loading employer dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "employer") {
    return null;
  }

  // Calculate statistics
  const stats = {
    activeJobs: jobs.filter((j) => j.status === "active").length,
    totalApplications: applications.length,
    passedCandidates: applications.filter((a) => a.status === "passed").length,
    avgScore:
      applications.length > 0
        ? Math.round(
            applications.reduce((acc, a) => acc + a.score, 0) /
              applications.length
          )
        : 0,
  };

  // Job table columns and other constants remain the same...
  const jobColumns: Column<JobListing>[] = [
    {
      key: "title",
      label: "Job Title",
      sortable: true,
      render: (value, job) => (
        <div>
          <div className="font-semibold text-gray-900">{job.title}</div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            {job.location}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value) => (
        <Badge variant="outline" className="font-medium">
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "applicants",
      label: "Applicants",
      sortable: true,
      render: (value) => (
        <div className="text-center">
          <span className="font-semibold text-lg">{value}</span>
          <div className="text-xs text-gray-500">applications</div>
        </div>
      ),
    },
    {
      key: "salary",
      label: "Salary",
      render: (value) => (
        <div className="font-medium text-green-600">{value}</div>
      ),
    },
    {
      key: "createdAt",
      label: "Posted",
      sortable: true,
      render: (value) => <div className="text-sm text-gray-600">{value}</div>,
    },
  ];
  const applicationColumns: Column<Application>[] = [
    {
      key: "candidateName",
      label: "Candidate",
      sortable: true,
      render: (value, application) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {application.candidateName.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{application.candidateName}</div>
            <div className="text-sm text-gray-500">
              {application.candidateEmail}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "jobId",
      label: "Position",
      render: (value) => {
        const job = jobs.find((j) => j.id === value);
        return job ? job.title : "Unknown Position";
      },
    },
    {
      key: "score",
      label: "Score",
      sortable: true,
      render: (value) => (
        <div className="text-center">
          <div
            className={`font-bold text-lg ${
              value >= 80
                ? "text-green-600"
                : value >= 70
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {value}%
          </div>
          <div className="text-xs text-gray-500">assessment</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => (
        <Badge variant={value === "passed" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "appliedAt",
      label: "Applied",
      sortable: true,
      render: (value) => <div className="text-sm text-gray-600">{value}</div>,
    },
  ];
  const allJobs = dataStore.jobs
    .getAll()
    .filter((job) => job.company !== user.company);
  const marketplaceColumns: Column<JobListing>[] = [
    {
      key: "title",
      label: "Job Title",
      sortable: true,
      render: (value, job) => (
        <div>
          <div className="font-semibold text-gray-900">{job.title}</div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <Building2 className="h-3 w-3 mr-1" />
            {job.company}
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {value}
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "salary",
      label: "Salary",
      render: (value) => (
        <div className="font-medium text-green-600">{value}</div>
      ),
    },
    {
      key: "applicants",
      label: "Applicants",
      sortable: true,
      render: (value) => <div className="text-center font-medium">{value}</div>,
    },
  ];
  const jobFilterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
        { value: "closed", label: "Closed" },
      ],
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "Full-time", label: "Full-time" },
        { value: "Part-time", label: "Part-time" },
        { value: "Contract", label: "Contract" },
        { value: "Remote", label: "Remote" },
      ],
    },
  ];
  const applicationFilterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "passed", label: "Passed" },
        { value: "failed", label: "Failed" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  // ✅ FIX #3: Re-fetch data after creating or updating a job.
  const handleJobSubmit = async (jobData: Partial<JobListing>) => {
    const jobWithCompany = {
      ...jobData,
      company: user.company!,
      postedBy: user.email,
    };

    if (editingJob) {
      await updateJob(editingJob.id, jobWithCompany);
    } else {
      await createJob(
        jobWithCompany as Omit<
          JobListing,
          "id" | "createdAt" | "updatedAt" | "applicants"
        >
      );
    }

    // After the action is complete, re-fetch the jobs list
    memoizedSearchJobs();

    setShowJobForm(false);
    setEditingJob(null);
  };

  const handleEditJob = (job: JobListing) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  // ✅ FIX #4: Re-fetch data after deleting a job.
  const handleDeleteJob = async (job: JobListing) => {
    if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
      await deleteJob(job.id);
      // After the action is complete, re-fetch the jobs list
      memoizedSearchJobs();
    }
  };

  const handleViewCandidate = (application: Application) => {
    alert(
      `Viewing candidate: ${application.candidateName}\nScore: ${application.score}%\nResume: ${application.resumeUrl}`
    );
  };

  if (showJobForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50  mt-16 pt-8">
        <JobForm
          job={editingJob || undefined}
          onSubmit={handleJobSubmit}
          onCancel={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          loading={jobsLoading}
          defaultCompany={user.company}
        />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className=" bg-gradient-to-br from-blue-50 via-white to-purple-5 mt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}
            </h2>
            <p className="text-lg text-gray-600">
              Manage your job postings and review qualified candidates
            </p>
          </div>

          {/* Stats Grid and the rest of the JSX remains the same */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      Active Jobs
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {stats.activeJobs}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      <Activity className="inline h-3 w-3 mr-1" />
                      {jobs.length} total
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">
                      Applications
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      {stats.totalApplications}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      +5 this week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">
                      Qualified
                    </p>
                    <p className="text-3xl font-bold text-purple-900">
                      {stats.passedCandidates}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Passed assessment
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">
                      Avg Score
                    </p>
                    <p className="text-3xl font-bold text-orange-900">
                      {stats.avgScore}%
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Assessment average
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="text-2xl">Recruitment Management</CardTitle>
              <CardDescription className="text-base">
                Manage your job postings, review candidates, and explore the job
                marketplace
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="jobs" className="w-full">
                <div className="border-b bg-gray-50/50">
                  <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0">
                    <TabsTrigger
                      value="jobs"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4 text-base font-medium"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      My Jobs ({jobs.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="candidates"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4 text-base font-medium"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Candidates ({stats.passedCandidates})
                    </TabsTrigger>
                    <TabsTrigger
                      value="marketplace"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4 text-base font-medium"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Marketplace
                    </TabsTrigger>
                    <TabsTrigger
                      value="post-job"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4 text-base font-medium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Post Job
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="jobs" className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Your Job Listings
                      </h3>
                      <p className="text-gray-600">
                        Manage and monitor your active job postings
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowJobForm(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  </div>

                  <DataTable
                    data={jobs}
                    columns={jobColumns}
                    searchPlaceholder="Search your jobs by title or location..."
                    filterOptions={jobFilterOptions}
                    onEdit={handleEditJob}
                    onDelete={handleDeleteJob}
                    loading={jobsLoading}
                    pageSize={8}
                  />
                </TabsContent>

                <TabsContent value="candidates" className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Qualified Candidates
                      </h3>
                      <p className="text-gray-600">
                        Review candidates who passed your assessments
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {applications.length} total applications •{" "}
                      {stats.passedCandidates} qualified
                    </div>
                  </div>

                  <DataTable
                    data={applications.filter((app) => app.status === "passed")}
                    columns={applicationColumns}
                    searchPlaceholder="Search candidates by name or email..."
                    filterOptions={applicationFilterOptions}
                    onView={handleViewCandidate}
                    loading={false}
                    pageSize={8}
                  />
                </TabsContent>

                <TabsContent value="marketplace" className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Job Marketplace
                      </h3>
                      <p className="text-gray-600">
                        Explore what other companies are posting
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {allJobs.length} jobs from other companies
                      </div>
                      <Link href="/browse-jobs">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Search className="h-4 w-4 mr-2" />
                          Browse All Jobs
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <DataTable
                    data={allJobs}
                    columns={marketplaceColumns}
                    searchPlaceholder="Search marketplace jobs..."
                    filterOptions={jobFilterOptions}
                    loading={false}
                    pageSize={8}
                  />
                </TabsContent>

                <TabsContent value="post-job" className="p-6">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Post a New Job
                      </h3>
                      <p className="text-gray-600">
                        Create a compelling job listing to attract top talent
                      </p>
                    </div>

                    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                      <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus className="h-8 w-8 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Ready to find your next hire?
                        </h4>
                        <p className="text-gray-600 mb-6">
                          Create a detailed job posting with requirements and
                          let our AI match you with qualified candidates
                        </p>
                        <Button
                          onClick={() => setShowJobForm(true)}
                          size="lg"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Create Job Posting
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
