"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/auth-context";
import { jobService } from "@/lib/data-service";
import type { Jobs } from "@/lib/database.types";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Globe,
  Heart,
  Share2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Header } from "../../components/header";

interface JobWithApplicants extends Jobs {
  applicants?: number;
}

export default function BrowseJobsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [jobs, setJobs] = useState<JobWithApplicants[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithApplicants[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // Updated default value
  const [experienceFilter, setExperienceFilter] = useState("all"); // Updated default value
  const [remoteFilter, setRemoteFilter] = useState("all"); // Updated default value
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const jobsPerPage = 12;

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    jobs,
    searchQuery,
    locationFilter,
    typeFilter,
    experienceFilter,
    remoteFilter,
    salaryRange,
  ]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await jobService.getAll();

      // Add mock applicant counts
      const jobsWithApplicants = jobsData.map((job) => ({
        ...job,
        applicants: Math.floor(Math.random() * 50) + 10,
      }));

      setJobs(jobsWithApplicants);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          (job.skills &&
            job.skills.some((skill) => skill.toLowerCase().includes(query)))
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(
        (job) =>
          job.location &&
          job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((job) => job.type === typeFilter);
    }

    // Experience filter
    if (experienceFilter !== "all") {
      filtered = filtered.filter((job) => job.experience === experienceFilter);
    }

    // Remote filter
    if (remoteFilter !== "all") {
      if (remoteFilter === "remote") {
        filtered = filtered.filter((job) => job.remote === true);
      } else if (remoteFilter === "onsite") {
        filtered = filtered.filter((job) => job.remote === false);
      }
    }

    // Salary filter (basic implementation)
    filtered = filtered.filter((job) => {
      if (!job.salary) return true;
      const salaryMatch = job.salary.match(/\$?([\d,]+)/);
      if (salaryMatch) {
        const salary = Number.parseInt(salaryMatch[1].replace(/,/g, ""));
        return salary >= salaryRange[0] && salary <= salaryRange[1];
      }
      return true;
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setTypeFilter("all"); // Updated default value
    setExperienceFilter("all"); // Updated default value
    setRemoteFilter("all"); // Updated default value
    setSalaryRange([0, 200000]);
  };

  const toggleSaveJob = (jobId: string) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const formatSalary = (salary: string | null) => {
    if (!salary) return "Competitive";
    return salary;
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 mt-16 pt-8">
        {/* Header */}
        <div className="  sticky top-0 z-40">
          <div className="container mx-auto px-4 pt-4 pb-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                {/* Search Bar */}
                <div className="flex gap-2 lg:w-auto  ">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search jobs, companies, skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-transparent"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Input
                      placeholder="Enter location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <Select
                      value={experienceFilter}
                      onValueChange={setExperienceFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All levels</SelectItem>
                        <SelectItem value="Entry">Entry Level</SelectItem>
                        <SelectItem value="Mid">Mid Level</SelectItem>
                        <SelectItem value="Senior">Senior Level</SelectItem>
                        <SelectItem value="Lead">Lead/Principal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Style
                    </label>
                    <Select
                      value={remoteFilter}
                      onValueChange={setRemoteFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All options" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All options</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range: ${salaryRange[0].toLocaleString()} - $
                    {salaryRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="bg-transparent"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Listings */}
        <div className="text-gray-600 mt-4 ml-36">
          {filteredJobs.length} job
          {filteredJobs.length !== 1 ? "s" : ""} found
          {searchQuery && ` for "${searchQuery}"`}
        </div>
        <div className="container mx-auto px-4 py-8">
          {currentJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="bg-transparent"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:shadow-lg transition-shadow duration-200 group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {job.company.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {job.title}
                            </CardTitle>
                            <CardDescription className="text-base font-medium text-gray-700">
                              {job.company}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveJob(job.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                savedJobs.has(job.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Share2 className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Job Details */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {job.location || "Location not specified"}
                          </span>
                          {job.remote && (
                            <Badge variant="secondary" className="ml-2">
                              <Globe className="h-3 w-3 mr-1" />
                              Remote
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{formatSalary(job.salary)}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{job.type || "Full-time"}</span>
                          {job.experience && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{job.experience}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{formatPostedDate(job.posted_date)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{job.applicants || 0} applicants</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="bg-transparent"
                          >
                            <Link href={`/jobs/${job.id}`}>
                              View Details
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                          {user?.role === "job_seeker" && (
                            <Button size="sm" asChild>
                              <Link href={`/jobs/${job.id}?apply=true`}>
                                Apply Now
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className={
                            currentPage !== page ? "bg-transparent" : ""
                          }
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2 text-gray-500">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(totalPages)}
                          className="bg-transparent"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-transparent"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
