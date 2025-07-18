"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, type UserRole } from "@/contexts/auth-context";
import { Brain, Mail, Lock, User, Building } from "lucide-react";
import { Header } from "../../components/header";

export default function AuthPage() {
  const { login, register, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signin");
  const [error, setError] = useState("");

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker" as UserRole,
    company: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signInData.email || !signInData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const success = await login(signInData.email, signInData.password);
      if (success) {
        router.push("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred during sign in");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signUpData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const success = await register(
        signUpData.name,
        signUpData.email,
        signUpData.password,
        signUpData.role,
        signUpData.company
      );
      if (success) {
        // Redirect job seekers to upload page, others to their dashboard
        if (signUpData.role === "job_seeker") {
          router.push("/upload");
        } else if (signUpData.role === "employer") {
          router.push("/employer");
        } else {
          router.push("/admin");
        }
      } else {
        setError("Failed to create account. Email may already be in use.");
      }
    } catch (error) {
      setError("An error occurred during sign up");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Header />
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Brain className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">TalentAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to TalentAI
          </h1>
          <p className="text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4 mt-6">
                <div className="space-y-2 text-center">
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={(e) =>
                          setSignInData({
                            ...signInData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) =>
                          setSignInData({
                            ...signInData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Demo Credentials:
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      <strong>Job Seeker:</strong> john@example.com / seeker123
                    </p>
                    <p>
                      <strong>Employer:</strong> hr@techcorp.com / employer123
                    </p>
                    <p>
                      <strong>Admin:</strong> admin@talentai.com / admin123
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="space-y-2 text-center">
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Sign up to start your journey with TalentAI
                  </CardDescription>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signUpData.name}
                        onChange={(e) =>
                          setSignUpData({ ...signUpData, name: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) =>
                          setSignUpData({
                            ...signUpData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">I am a</Label>
                    <Select
                      value={signUpData.role}
                      onValueChange={(value: UserRole) =>
                        setSignUpData({ ...signUpData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job_seeker">Job Seeker</SelectItem>
                        <SelectItem value="employer">Employer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {signUpData.role === "employer" && (
                    <div className="space-y-2">
                      <Label htmlFor="signup-company">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="signup-company"
                          type="text"
                          placeholder="Enter your company name"
                          value={signUpData.company}
                          onChange={(e) =>
                            setSignUpData({
                              ...signUpData,
                              company: e.target.value,
                            })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) =>
                          setSignUpData({
                            ...signUpData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={signUpData.confirmPassword}
                        onChange={(e) =>
                          setSignUpData({
                            ...signUpData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
