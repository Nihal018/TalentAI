"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import {
  Brain,
  User,
  Settings,
  LogOut,
  Briefcase,
  Upload,
  BarChart3,
  Menu,
  X,
  ChevronDown,
  Bell,
  BookmarkIcon,
  FileText,
  Shield,
  Users,
  Building2,
  HelpCircle,
  Mail,
} from "lucide-react";

function getInitials(name?: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide scrollbar styles
  const scrollbarStyles = `
    /* Hide scrollbar for Chrome, Safari and Opera */
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    
    /* Hide scrollbar for IE, Edge and Firefox */
    .hide-scrollbar {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    
    /* Apply to body to prevent layout shift */
    body {
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    body::-webkit-scrollbar {
      display: none;
    }
  `;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-sm";
      case "employer":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-sm";
      case "job_seeker":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case "admin":
        return [
          { href: "/admin", label: "Admin Panel", icon: Shield },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/browse-jobs", label: "Jobs", icon: Briefcase },
        ];
      case "employer":
        return [
          {
            href: "/employer",
            label: "Dashboard",
            icon: BarChart3,
          },
          // { href: "/employer/jobs", label: "My Jobs", icon: Building2 },
          { href: "/browse-jobs", label: "Browse", icon: Briefcase },
        ];
      case "job_seeker":
        return [
          {
            href: "/browse-jobs",
            label: "Find Jobs",
            icon: Briefcase,
          },
          { href: "/upload", label: "Upload Resume", icon: Upload },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group shrink-0"
            >
              <div className="relative">
                <Brain className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
                <div className="absolute -inset-1 bg-blue-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TalentAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center ml-auto mr-4">
              {user ? (
                <div className="flex items-center space-x-1">
                  {getNavLinks().map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${"text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                    >
                      <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Link
                    href="/browse-jobs"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    href="/auth"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    For Employers
                  </Link>
                </div>
              )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-9 w-9 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Bell className="h-4 w-4 text-gray-600" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold">
                        3
                      </span>
                    </span>
                  </Button>

                  {/* Role Badge */}
                  <Badge
                    className={`${getRoleColor(
                      user.role
                    )} font-medium px-3 py-1 text-xs hidden md:flex`}
                  >
                    {user.role.replace("_", " ")}
                  </Badge>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 h-9 pl-2 pr-3 rounded-full hover:bg-gray-100 transition-all duration-200"
                      >
                        <Avatar className="h-7 w-7 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
                          <AvatarImage src="/placeholder.svg" alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-3 w-3 text-gray-500 hidden sm:block" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-72 p-1 shadow-xl border-0 bg-white/95 backdrop-blur-lg hide-scrollbar"
                      align="end"
                      sideOffset={8}
                    >
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-r  hover:bg-gray-100 transition-colors duration-200 rounded-lg m-1 mb-2 ">
                        <Link href="/profile">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                              <AvatarImage
                                src="/placeholder.svg"
                                alt={user.name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email}
                              </p>
                              <Badge
                                className={`${getRoleColor(
                                  user.role
                                )} font-medium px-2 py-0.5 text-xs mt-1`}
                              >
                                {user.role.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* Navigation Links */}
                      <div className="px-1">
                        <DropdownMenuItem
                          asChild
                          className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <Link href="/profile" className="flex items-center">
                            <User className="mr-3 h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">
                                My Profile
                              </span>
                              <p className="text-xs text-gray-500">
                                Manage your account
                              </p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <Link href="" className="flex items-center">
                            <BookmarkIcon className="mr-3 h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">
                                Saved Jobs
                              </span>
                              <p className="text-xs text-gray-500">
                                Your bookmarked positions
                              </p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <Link href="" className="flex items-center">
                            <Mail className="mr-3 h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">
                                Messages
                              </span>
                              <p className="text-xs text-gray-500">
                                Chat with employers
                              </p>
                            </div>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              2
                            </Badge>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />

                        <DropdownMenuItem
                          asChild
                          className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <Link href="" className="flex items-center">
                            <Settings className="mr-3 h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">
                                Settings
                              </span>
                              <p className="text-xs text-gray-500">
                                Preferences & privacy
                              </p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <Link href="" className="flex items-center">
                            <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">
                                Help & Support
                              </span>
                              <p className="text-xs text-gray-500">
                                Get help when you need it
                              </p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />

                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="p-3 cursor-pointer hover:bg-red-50 rounded-lg transition-colors duration-200 text-red-600 hover:text-red-700 pb-4"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          <div className="flex-1">
                            <span className="font-medium">Sign Out</span>
                          </div>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    className="font-medium hover:bg-gray-100 text-sm px-4"
                    asChild
                  >
                    <Link href="/auth">Sign In</Link>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-9 w-9"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
              <nav className="flex flex-col p-4 space-y-1">
                {user ? (
                  <>
                    {/* Mobile User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        className={`${getRoleColor(
                          user.role
                        )} font-medium px-2 py-1 text-xs`}
                      >
                        {user.role.replace("_", " ")}
                      </Badge>
                    </div>

                    {getNavLinks().map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center space-x-3 p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <link.icon className="h-4 w-4" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}

                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span className="font-medium">Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/browse-jobs"
                      className="flex items-center space-x-3 p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium">Browse Jobs</span>
                    </Link>
                    <Link
                      href="/auth"
                      className="flex items-center space-x-3 p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">For Employers</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
