"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { UserForm } from "@/components/forms/user-form";
import { JobForm } from "@/components/forms/job-form";
import { useUserCrud, useJobCrud } from "@/hooks/use-crud";
import {
  Brain,
  Users,
  Briefcase,
  Settings,
  Plus,
  BarChart3,
  Building,
  LogOut,
  TrendingUp,
  Activity,
  Search,
} from "lucide-react";
import Link from "next/link";
import type { User, JobListing } from "@/lib/data-store";
import { Header } from "../../components/header";

export default function AdminPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [showUserForm, setShowUserForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);

  const {
    users,
    loading: usersLoading,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUserCrud();

  const {
    jobs,
    loading: jobsLoading,
    searchJobs,
    createJob,
    updateJob,
    deleteJob,
  } = useJobCrud();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg text-gray-600">
            Loading admin dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.length,
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "active").length,
    totalApplications: jobs.reduce((acc, job) => acc + job.applicants, 0),
    employers: users.filter((u) => u.role === "employer").length,
  };

  // User table columns
  const userColumns: Column<User>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value) => (
        <Badge
          variant={
            value === "admin"
              ? "default"
              : value === "employer"
              ? "secondary"
              : "outline"
          }
        >
          {value.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "company",
      label: "Company",
      render: (value) => value || "-",
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
      key: "createdAt",
      label: "Created",
      sortable: true,
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (value) => value || "Never",
    },
  ];

  // Job table columns
  const jobColumns: Column<JobListing>[] = [
    {
      key: "title",
      label: "Job Title",
      sortable: true,
      render: (value, job) => (
        <div>
          <div className="font-medium">{job.title}</div>
          <div className="text-sm text-gray-500">{job.company}</div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      render: (value) => <Badge variant="outline">{value}</Badge>,
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
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Posted",
      sortable: true,
    },
  ];

  // Filter options
  const userFilterOptions: FilterOption[] = [
    {
      key: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "job_seeker", label: "Job Seeker" },
        { value: "employer", label: "Employer" },
        { value: "admin", label: "Admin" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "suspended", label: "Suspended" },
      ],
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

  const handleUserSubmit = async (userData: Partial<User>) => {
    if (editingUser) {
      await updateUser(editingUser.id, userData);
    } else {
      await createUser(userData as Omit<User, "id" | "createdAt">);
    }
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleJobSubmit = async (jobData: Partial<JobListing>) => {
    if (editingJob) {
      await updateJob(editingJob.id, jobData);
    } else {
      await createJob(
        jobData as Omit<
          JobListing,
          "id" | "createdAt" | "updatedAt" | "applicants"
        >
      );
    }
    setShowJobForm(false);
    setEditingJob(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleEditJob = (job: JobListing) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      await deleteUser(user.id);
    }
  };

  const handleDeleteJob = async (job: JobListing) => {
    if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
      await deleteJob(job.id);
    }
  };

  if (showUserForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <UserForm
          user={editingUser || undefined}
          onSubmit={handleUserSubmit}
          onCancel={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
          loading={usersLoading}
        />
      </div>
    );
  }

  if (showJobForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <JobForm
          job={editingJob || undefined}
          onSubmit={handleJobSubmit}
          onCancel={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          loading={jobsLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                TalentAI Admin
              </h1>
              <p className="text-sm text-gray-500">Platform Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/browse-jobs">
              <Button variant="outline" size="sm" className="bg-transparent">
                <Search className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}
          </h2>
          <p className="text-lg text-gray-600">
            Manage your platform and monitor system performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {stats.totalUsers}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {stats.activeUsers} active
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Active Jobs
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {stats.activeJobs}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats.totalJobs} total
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    Applications
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {stats.totalApplications}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +12% this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">
                    Employers
                  </p>
                  <p className="text-3xl font-bold text-orange-900">
                    {stats.employers}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    <Activity className="inline h-3 w-3 mr-1" />
                    All active
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-2xl">Platform Management</CardTitle>
            <CardDescription className="text-base">
              Manage users, jobs, and platform settings with advanced search and
              filtering
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="users" className="w-full">
              <div className="border-b bg-gray-50/50">
                <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0">
                  <TabsTrigger
                    value="users"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4 text-base font-medium"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Users ({stats.totalUsers})
                  </TabsTrigger>
                  <TabsTrigger
                    value="jobs"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4 text-base font-medium"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Jobs ({stats.totalJobs})
                  </TabsTrigger>
                  <TabsTrigger
                    value="browse-jobs"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4 text-base font-medium"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-4 text-base font-medium"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="users" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      User Management
                    </h3>
                    <p className="text-gray-600">
                      Manage all platform users with advanced search and
                      filtering
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowUserForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>

                <DataTable
                  data={users}
                  columns={userColumns}
                  searchPlaceholder="Search users by name, email, or company..."
                  filterOptions={userFilterOptions}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  loading={usersLoading}
                  pageSize={10}
                />
              </TabsContent>

              <TabsContent value="jobs" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Job Listings Management
                    </h3>
                    <p className="text-gray-600">
                      Oversee all job postings across the platform
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowJobForm(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Job
                  </Button>
                </div>

                <DataTable
                  data={jobs}
                  columns={jobColumns}
                  searchPlaceholder="Search jobs by title, company, or location..."
                  filterOptions={jobFilterOptions}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                  loading={jobsLoading}
                  pageSize={10}
                />
              </TabsContent>

              <TabsContent value="browse-jobs" className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Browse All Job Listings
                  </h3>
                  <p className="text-gray-600 mb-6">
                    View and explore all job listings on the platform
                  </p>
                  <Link href="/browse-jobs">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Platform Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Assessment Configuration
                        </CardTitle>
                        <CardDescription>
                          Configure assessment parameters and scoring
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Passing Score (%)
                          </label>
                          <input
                            type="number"
                            defaultValue="70"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Time Limit (minutes)
                          </label>
                          <input
                            type="number"
                            defaultValue="30"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Update Assessment Settings
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Email Configuration
                        </CardTitle>
                        <CardDescription>
                          Configure email notifications and templates
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            SMTP Server
                          </label>
                          <input
                            type="text"
                            defaultValue="smtp.talentai.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            From Email
                          </label>
                          <input
                            type="email"
                            defaultValue="noreply@talentai.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Update Email Settings
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Platform Analytics
                        </CardTitle>
                        <CardDescription>
                          View detailed platform usage statistics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Daily Active Users
                            </span>
                            <span className="font-semibold">1,247</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Job Applications Today
                            </span>
                            <span className="font-semibold">89</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Success Rate
                            </span>
                            <span className="font-semibold text-green-600">
                              73%
                            </span>
                          </div>
                        </div>
                        <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                          View Detailed Analytics
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          System Maintenance
                        </CardTitle>
                        <CardDescription>
                          Platform maintenance and backup options
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Export User Data
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Backup Database
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Clear Cache
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                        >
                          System Maintenance Mode
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
