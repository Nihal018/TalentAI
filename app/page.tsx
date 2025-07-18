"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import {
  Search,
  Upload,
  Brain,
  Target,
  Users,
  TrendingUp,
  Building,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

export default function HomePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse-jobs?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description:
        "Our advanced AI analyzes your resume and matches you with the most relevant job opportunities using cutting-edge machine learning algorithms.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Target,
      title: "Precision Scoring",
      description:
        "Get detailed compatibility scores for each job match based on your skills, experience, and career preferences with 95% accuracy.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Upload,
      title: "Easy Upload",
      description:
        "Simply upload your resume and let our AI do the heavy lifting to find your perfect match in seconds, not hours.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const stats = [
    {
      icon: Users,
      label: "Active Job Seekers",
      value: "50,000+",
      color: "text-blue-600",
    },
    {
      icon: Building,
      label: "Partner Companies",
      value: "5,500+",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Successful Matches",
      value: "25,000+",
      color: "text-purple-600",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: "4.9/5",
      color: "text-yellow-600",
    },
  ];

  const benefits = [
    "Save 80% of your job search time",
    "Get matched with hidden job opportunities",
    "Receive personalized career insights",
    "Access to exclusive company networks",
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>

          <div className="relative container mx-auto px-4 py-24">
            <div className="text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-8 animate-pulse">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Job Matching Platform
              </div>

              <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                Find Your Perfect Job with{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI-Powered
                </span>{" "}
                Matching
              </h1>

              <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-600 leading-relaxed">
                Upload your resume, get matched with relevant opportunities, and
                let our advanced AI help you land your dream job
                <span className="font-semibold text-blue-600">
                  {" "}
                  10x faster
                </span>{" "}
                than traditional methods.
              </p>

              {/* Search Bar
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
              <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-2xl border border-gray-200">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-4 text-lg border-0 focus:ring-0 bg-transparent"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Search Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form> */}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                {user ? (
                  <>
                    {/* <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <Link href="/browse-jobs">
                      Browse All Jobs
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button> */}
                    {user.role === "job_seeker" && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 bg-transparent"
                        asChild
                      >
                        <Link href="/upload">
                          <Upload className="mr-2 h-5 w-5" />
                          Upload Resume
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      asChild
                    >
                      <Link href="/auth">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 bg-transparent"
                      asChild
                    >
                      <Link href="/auth">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Benefits List */}
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-gray-600"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
                <Brain className="w-4 h-4 mr-2" />
                How It Works
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Three Simple Steps to Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dream Job
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform streamlines your job search process with
                intelligent matching and personalized recommendations that
                actually work.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="relative group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  ></div>
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`mx-auto w-20 h-20 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon
                        className={`h-10 w-10 ${feature.iconColor}`}
                      />
                    </div>
                    <div className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                      {index + 1}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                Trusted Worldwide
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Join Our Growing Community of{" "}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Success Stories
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Thousands of professionals have already found their perfect job
                match through our platform
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300">
                    <stat.icon className={`h-10 w-10 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-8">
              <Shield className="w-4 h-4 mr-2" />
              100% Free to Get Started
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who have already found their
              perfect job match. Upload your resume today and let our advanced
              AI technology work for you - completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {user ? (
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  asChild
                >
                  <Link href="/browse-jobs">
                    Start Job Search
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <Link href="/auth">
                      Sign Up Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-10 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-blue-600 bg-transparent rounded-xl transition-all duration-200"
                    asChild
                  >
                    <Link href="/browse-jobs">Browse Jobs</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
