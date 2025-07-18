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
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Star,
  Filter,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Header } from "../../components/header";

// Mock job data
const jobMatches = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    compatibility: 95,
    logo: "TC",
    description:
      "Join our innovative team building next-generation web applications using React, Node.js, and cloud technologies.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    posted: "2 days ago",
    applicants: 23,
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$90k - $130k",
    type: "Full-time",
    compatibility: 92,
    logo: "SX",
    description:
      "Build scalable web applications in a fast-paced startup environment. Work with modern tech stack and shape product direction.",
    skills: ["JavaScript", "Python", "React", "PostgreSQL", "Redis"],
    posted: "1 day ago",
    applicants: 15,
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "DesignStudio",
    location: "New York, NY",
    salary: "$100k - $140k",
    type: "Full-time",
    compatibility: 88,
    logo: "DS",
    description:
      "Create beautiful, responsive user interfaces for our design platform. Collaborate closely with designers and product teams.",
    skills: ["React", "CSS", "JavaScript", "Figma", "Tailwind"],
    posted: "3 days ago",
    applicants: 31,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    salary: "$110k - $150k",
    type: "Full-time",
    compatibility: 85,
    logo: "CT",
    description:
      "Manage cloud infrastructure and deployment pipelines. Work with Kubernetes, AWS, and modern DevOps tools.",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Python"],
    posted: "1 week ago",
    applicants: 18,
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateLabs",
    location: "Seattle, WA",
    salary: "$130k - $170k",
    type: "Full-time",
    compatibility: 82,
    logo: "IL",
    description:
      "Lead product strategy and roadmap for our AI-powered analytics platform. Work with engineering and design teams.",
    skills: ["Product Strategy", "Analytics", "Agile", "SQL", "Figma"],
    posted: "4 days ago",
    applicants: 27,
  },
];

export default function JobsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading]);

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

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    return "text-yellow-600 bg-yellow-100";
  };

  const getCompatibilityText = (score: number) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Good Match";
    return "Fair Match";
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Your Job Matches
                </h1>
                <p className="text-xl text-gray-600">
                  AI found {jobMatches.length} highly compatible positions for
                  you
                </p>
              </div>
              <Button
                variant="outline"
                className="flex items-center bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter Results
              </Button>
            </div>

            {/* Match Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    3
                  </div>
                  <div className="text-sm text-gray-600">Excellent Matches</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">2</div>
                  <div className="text-sm text-gray-600">Good Matches</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    $125k
                  </div>
                  <div className="text-sm text-gray-600">Avg. Salary</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    89%
                  </div>
                  <div className="text-sm text-gray-600">Avg. Match Score</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobMatches.map((job) => (
              <Card
                key={job.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {job.logo}
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {job.company}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={`${getCompatibilityColor(
                        job.compatibility
                      )} border-0 font-semibold`}
                    >
                      {job.compatibility}% Match
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {job.salary}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {job.posted}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job.applicants} applicants
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{job.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span
                        className={
                          getCompatibilityColor(job.compatibility).split(" ")[0]
                        }
                      >
                        {getCompatibilityText(job.compatibility)}
                      </span>
                    </div>
                    <Link href={`/assessment/${job.id}`}>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Take Assessment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Insights */}
          <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-6 w-6 text-blue-600 mr-2" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your Strongest Skills
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">React Development</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">JavaScript/TypeScript</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Node.js</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Market Insights
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Your skills are in high demand (↑15% this month)</li>
                    <li>• Average salary for your profile: $125k - $155k</li>
                    <li>• Remote opportunities: 68% of matches</li>
                    <li>• Top hiring companies: Tech startups & Fortune 500</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
