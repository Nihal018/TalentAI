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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Brain,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Edit,
  ArrowLeft,
  Save,
  Plus,
  X,
  Award,
  Globe,
  Github,
  Linkedin,
  ExternalLink,
  Camera,
  Trash2,
  Calendar,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Header } from "../../components/header";

interface SkillWithRating {
  name: string;
  rating: number;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  skills: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export default function ProfilePage() {
  const { user, isLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [showExperienceDialog, setShowExperienceDialog] = useState(false);
  const [showEducationDialog, setShowEducationDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    github: "",
    linkedin: "",
    title: "",
    hourlyRate: "",
    availability: "Available",
  });

  // Skills with ratings - controlled state
  const [skillsWithRatings, setSkillsWithRatings] = useState<SkillWithRating[]>(
    []
  );

  // Mock data for experiences, education, and projects
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description:
        "Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted technical interviews.",
      skills: ["React", "Node.js", "AWS", "Docker"],
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "2020-03",
      endDate: "2021-12",
      current: false,
      description:
        "Built and maintained web applications using modern JavaScript frameworks. Collaborated with design team to implement responsive UI components. Optimized application performance resulting in 40% faster load times.",
      skills: ["JavaScript", "Vue.js", "Python", "PostgreSQL"],
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2016-09",
      endDate: "2020-05",
      gpa: "3.8",
      description:
        "Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems, Machine Learning",
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
      technologies: ["React", "Node.js", "PostgreSQL"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "AI Task Manager",
      description:
        "Intelligent task management app with AI-powered prioritization and scheduling. Built with Next.js and integrated with OpenAI API.",
      technologies: ["Next.js", "OpenAI", "TypeScript"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
  ]);

  const [experienceForm, setExperienceForm] = useState<Omit<Experience, "id">>({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    skills: [],
  });

  const [educationForm, setEducationForm] = useState<Omit<Education, "id">>({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    gpa: "",
    description: "",
  });

  const [projectForm, setProjectForm] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    technologies: [],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.profileData?.phone || "",
        location: user.profileData?.location || "",
        bio: user.profileData?.bio || "",
        website: user.profileData?.website || "",
        github: user.profileData?.github || "",
        linkedin: user.profileData?.linkedin || "",
        title: "",
        hourlyRate: "",
        availability: "Available",
      });

      // Initialize skills with ratings - ensure controlled state
      const userSkills = user.profileData?.skills || [];
      const initialSkills = userSkills.map((skill) => ({
        name: skill,
        rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5 for demo
      }));
      setSkillsWithRatings(initialSkills);
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

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      profileData: {
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        skills: skillsWithRatings.map((skill) => skill.name),
        website: formData.website,
        github: formData.github,
        linkedin: formData.linkedin,
      },
    });
    setIsEditing(false);
  };

  const addSkill = (skill: string) => {
    if (skill && !skillsWithRatings.some((s) => s.name === skill)) {
      setSkillsWithRatings([...skillsWithRatings, { name: skill, rating: 3 }]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsWithRatings(
      skillsWithRatings.filter((skill) => skill.name !== skillToRemove)
    );
  };

  const updateSkillRating = (skillName: string, rating: number) => {
    setSkillsWithRatings(
      skillsWithRatings.map((skill) =>
        skill.name === skillName ? { ...skill, rating } : skill
      )
    );
  };

  const getRedirectPath = () => {
    switch (user.role) {
      case "admin":
        return "/admin";
      case "employer":
        return "/employer";
      case "job_seeker":
        return "/";
      default:
        return "/";
    }
  };

  const profileCompletion = () => {
    const fields = [
      formData.name,
      formData.phone,
      formData.location,
      formData.bio,
      skillsWithRatings.length > 0,
      formData.website,
      formData.github,
      formData.linkedin,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const renderStarRating = (
    rating: number,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange && onRatingChange(star)}
            className={`${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400 transition-colors ${
              onRatingChange ? "cursor-pointer" : "cursor-default"
            }`}
            disabled={!onRatingChange}
          >
            <Star className="h-4 w-4 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  // Experience CRUD operations
  const handleExperienceSubmit = () => {
    if (editingExperience) {
      setExperiences(
        experiences.map((exp) =>
          exp.id === editingExperience.id
            ? { ...experienceForm, id: editingExperience.id }
            : exp
        )
      );
    } else {
      setExperiences([
        ...experiences,
        { ...experienceForm, id: Date.now().toString() },
      ]);
    }
    setShowExperienceDialog(false);
    setEditingExperience(null);
    setExperienceForm({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      skills: [],
    });
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setExperienceForm(experience);
    setShowExperienceDialog(true);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  // Education CRUD operations
  const handleEducationSubmit = () => {
    if (editingEducation) {
      setEducations(
        educations.map((edu) =>
          edu.id === editingEducation.id
            ? { ...educationForm, id: editingEducation.id }
            : edu
        )
      );
    } else {
      setEducations([
        ...educations,
        { ...educationForm, id: Date.now().toString() },
      ]);
    }
    setShowEducationDialog(false);
    setEditingEducation(null);
    setEducationForm({
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    });
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setEducationForm(education);
    setShowEducationDialog(true);
  };

  const handleDeleteEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  // Project CRUD operations
  const handleProjectSubmit = () => {
    if (editingProject) {
      setProjects(
        projects.map((proj) =>
          proj.id === editingProject.id
            ? { ...projectForm, id: editingProject.id }
            : proj
        )
      );
    } else {
      setProjects([...projects, { ...projectForm, id: Date.now().toString() }]);
    }
    setShowProjectDialog(false);
    setEditingProject(null);
    setProjectForm({
      title: "",
      description: "",
      technologies: [],
      liveUrl: "",
      githubUrl: "",
      imageUrl: "",
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm(project);
    setShowProjectDialog(true);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((proj) => proj.id !== id));
  };

  const addTechnology = (tech: string, form: any, setForm: any) => {
    if (tech && !form.technologies.includes(tech)) {
      setForm({ ...form, technologies: [...form.technologies, tech] });
    }
  };

  const removeTechnology = (techToRemove: string, form: any, setForm: any) => {
    setForm({
      ...form,
      technologies: form.technologies.filter(
        (tech: string) => tech !== techToRemove
      ),
    });
  };

  const addExperienceSkill = (skill: string) => {
    if (skill && !experienceForm.skills.includes(skill)) {
      setExperienceForm({
        ...experienceForm,
        skills: [...experienceForm.skills, skill],
      });
    }
  };

  const removeExperienceSkill = (skillToRemove: string) => {
    setExperienceForm({
      ...experienceForm,
      skills: experienceForm.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  return (
    <>
      <Header />
      <div className=" bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Profile Photo */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                        {user.name.charAt(0)}
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border">
                          <Camera className="h-4 w-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {user.name}
                    </h2>
                    <p className="text-gray-600">
                      {formData.title || "Professional"}
                    </p>
                    <div className="flex items-center justify-center mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-600">
                        {formData.availability}
                      </span>
                    </div>
                  </div>

                  {/* Profile Completion */}
                  <div className="flex items-center space-x-4 mb-4">
                    <Button
                      variant="outline"
                      size={"lg"}
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Profile Completion
                      </span>
                      <span className="text-sm text-gray-600">
                        {profileCompletion()}%
                      </span>
                    </div>
                    <Progress value={profileCompletion()} className="h-2" />
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2">
                    {[
                      { id: "overview", label: "Overview", icon: User },
                      {
                        id: "experience",
                        label: "Experience",
                        icon: Briefcase,
                      },
                      { id: "skills", label: "Skills", icon: Award },
                      {
                        id: "education",
                        label: "Education",
                        icon: GraduationCap,
                      },
                      { id: "portfolio", label: "Portfolio", icon: Globe },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                          activeSection === item.id
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  {/* Contact Info */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Contact
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {user.email}
                      </div>
                      {formData.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {formData.phone}
                        </div>
                      )}
                      {formData.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {formData.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-3">Links</h3>
                    <div className="space-y-2">
                      {formData.linkedin ? (
                        <a
                          href={formData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </div>
                      )}
                      {formData.github ? (
                        <a
                          href={formData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </div>
                      )}
                      {formData.website ? (
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Portfolio
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <Globe className="h-4 w-4 mr-2" />
                          Portfolio
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Section */}
              {activeSection === "overview" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                      <CardDescription>
                        Tell us about yourself and your professional background
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="title">Professional Title</Label>
                              <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="e.g. Senior Software Engineer"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    location: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={formData.bio}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  bio: e.target.value,
                                })
                              }
                              rows={4}
                              placeholder="Tell us about your experience, goals, and what makes you unique..."
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="website">Website</Label>
                              <Input
                                id="website"
                                value={formData.website}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    website: e.target.value,
                                  })
                                }
                                placeholder="https://yourwebsite.com"
                              />
                            </div>
                            <div>
                              <Label htmlFor="github">GitHub</Label>
                              <Input
                                id="github"
                                value={formData.github}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    github: e.target.value,
                                  })
                                }
                                placeholder="https://github.com/username"
                              />
                            </div>
                            <div>
                              <Label htmlFor="linkedin">LinkedIn</Label>
                              <Input
                                id="linkedin"
                                value={formData.linkedin}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    linkedin: e.target.value,
                                  })
                                }
                                placeholder="https://linkedin.com/in/username"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-700 leading-relaxed">
                            {formData.bio ||
                              "Add a bio to tell potential employers about your experience, skills, and career goals."}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {skillsWithRatings.length}
                        </div>
                        <div className="text-gray-600">Skills</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          12
                        </div>
                        <div className="text-gray-600">Applications</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === "skills" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                    <CardDescription>
                      Showcase your technical and professional skills with
                      ratings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Skills */}
                      <div>
                        <Label className="text-base font-semibold">
                          Technical Skills
                        </Label>
                        <div className="space-y-3 mt-3 mb-4">
                          {skillsWithRatings.map((skill) => (
                            <div
                              key={skill.name}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <Badge
                                  variant="secondary"
                                  className="px-3 py-1"
                                >
                                  {skill.name}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 mr-2">
                                {renderStarRating(
                                  skill.rating,
                                  isEditing
                                    ? (rating) =>
                                        updateSkillRating(skill.name, rating)
                                    : undefined
                                )}
                                <span className="text-sm text-gray-600 ml-2">
                                  {skill.rating}/5
                                </span>
                                {isEditing && (
                                  <button
                                    onClick={() => removeSkill(skill.name)}
                                    className="text-red-400 hover:text-red-500 hover:opacity-80 background-"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a skill..."
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  addSkill(e.currentTarget.value);
                                  e.currentTarget.value = "";
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = e.currentTarget
                                  .previousElementSibling as HTMLInputElement;
                                addSkill(input.value);
                                input.value = "";
                              }}
                              className="bg-transparent"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience Section - keeping existing implementation */}
              {activeSection === "experience" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Work Experience</CardTitle>
                        <CardDescription>
                          Your professional journey and achievements
                        </CardDescription>
                      </div>
                      <Dialog
                        open={showExperienceDialog}
                        onOpenChange={setShowExperienceDialog}
                      >
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Experience
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingExperience
                                ? "Edit Experience"
                                : "Add Experience"}
                            </DialogTitle>
                            <DialogDescription>
                              Add your work experience details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="exp-title">Job Title</Label>
                                <Input
                                  id="exp-title"
                                  value={experienceForm.title}
                                  onChange={(e) =>
                                    setExperienceForm({
                                      ...experienceForm,
                                      title: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="exp-company">Company</Label>
                                <Input
                                  id="exp-company"
                                  value={experienceForm.company}
                                  onChange={(e) =>
                                    setExperienceForm({
                                      ...experienceForm,
                                      company: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="exp-location">Location</Label>
                              <Input
                                id="exp-location"
                                value={experienceForm.location}
                                onChange={(e) =>
                                  setExperienceForm({
                                    ...experienceForm,
                                    location: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="exp-start">Start Date</Label>
                                <Input
                                  id="exp-start"
                                  type="month"
                                  value={experienceForm.startDate}
                                  onChange={(e) =>
                                    setExperienceForm({
                                      ...experienceForm,
                                      startDate: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="exp-end">End Date</Label>
                                <Input
                                  id="exp-end"
                                  type="month"
                                  value={experienceForm.endDate}
                                  onChange={(e) =>
                                    setExperienceForm({
                                      ...experienceForm,
                                      endDate: e.target.value,
                                    })
                                  }
                                  disabled={experienceForm.current}
                                />
                                <div className="flex items-center mt-2">
                                  <input
                                    type="checkbox"
                                    id="current"
                                    checked={experienceForm.current}
                                    onChange={(e) =>
                                      setExperienceForm({
                                        ...experienceForm,
                                        current: e.target.checked,
                                      })
                                    }
                                    className="mr-2"
                                  />
                                  <Label htmlFor="current" className="text-sm">
                                    I currently work here
                                  </Label>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="exp-description">
                                Description
                              </Label>
                              <Textarea
                                id="exp-description"
                                value={experienceForm.description}
                                onChange={(e) =>
                                  setExperienceForm({
                                    ...experienceForm,
                                    description: e.target.value,
                                  })
                                }
                                rows={4}
                              />
                            </div>
                            <div>
                              <Label>Skills Used</Label>
                              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                {experienceForm.skills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {skill}
                                    <button
                                      onClick={() =>
                                        removeExperienceSkill(skill)
                                      }
                                      className="ml-1 hover:text-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add a skill..."
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      addExperienceSkill(e.currentTarget.value);
                                      e.currentTarget.value = "";
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={(e) => {
                                    const input = e.currentTarget
                                      .previousElementSibling as HTMLInputElement;
                                    addExperienceSkill(input.value);
                                    input.value = "";
                                  }}
                                  className="bg-transparent"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setShowExperienceDialog(false)}
                              className="bg-transparent"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleExperienceSubmit}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {editingExperience ? "Update" : "Add"} Experience
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {experiences.map((experience, index) => (
                        <div
                          key={experience.id}
                          className="border-l-4 border-blue-600 pl-6 relative"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg">
                                  {experience.title}
                                </h3>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleEditExperience(experience)
                                    }
                                    className="bg-transparent"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteExperience(experience.id)
                                    }
                                    className="bg-transparent text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-blue-600 font-medium">
                                {experience.company}
                              </p>
                              <p className="text-gray-600 text-sm flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {experience.location}
                              </p>
                              <p className="text-gray-600 text-sm flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                {experience.startDate} -{" "}
                                {experience.current
                                  ? "Present"
                                  : experience.endDate}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-3 leading-relaxed">
                            {experience.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {experience.skills.map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education Section - keeping existing implementation */}
              {activeSection === "education" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Education & Certifications</CardTitle>
                        <CardDescription>
                          Your academic background and professional
                          certifications
                        </CardDescription>
                      </div>
                      <Dialog
                        open={showEducationDialog}
                        onOpenChange={setShowEducationDialog}
                      >
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Education
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingEducation
                                ? "Edit Education"
                                : "Add Education"}
                            </DialogTitle>
                            <DialogDescription>
                              Add your educational background
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edu-degree">Degree</Label>
                              <Input
                                id="edu-degree"
                                value={educationForm.degree}
                                onChange={(e) =>
                                  setEducationForm({
                                    ...educationForm,
                                    degree: e.target.value,
                                  })
                                }
                                placeholder="e.g. Bachelor of Science in Computer Science"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edu-institution">
                                  Institution
                                </Label>
                                <Input
                                  id="edu-institution"
                                  value={educationForm.institution}
                                  onChange={(e) =>
                                    setEducationForm({
                                      ...educationForm,
                                      institution: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="edu-location">Location</Label>
                                <Input
                                  id="edu-location"
                                  value={educationForm.location}
                                  onChange={(e) =>
                                    setEducationForm({
                                      ...educationForm,
                                      location: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="edu-start">Start Date</Label>
                                <Input
                                  id="edu-start"
                                  type="month"
                                  value={educationForm.startDate}
                                  onChange={(e) =>
                                    setEducationForm({
                                      ...educationForm,
                                      startDate: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="edu-end">End Date</Label>
                                <Input
                                  id="edu-end"
                                  type="month"
                                  value={educationForm.endDate}
                                  onChange={(e) =>
                                    setEducationForm({
                                      ...educationForm,
                                      endDate: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="edu-gpa">GPA (Optional)</Label>
                                <Input
                                  id="edu-gpa"
                                  value={educationForm.gpa}
                                  onChange={(e) =>
                                    setEducationForm({
                                      ...educationForm,
                                      gpa: e.target.value,
                                    })
                                  }
                                  placeholder="3.8"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edu-description">
                                Description
                              </Label>
                              <Textarea
                                id="edu-description"
                                value={educationForm.description}
                                onChange={(e) =>
                                  setEducationForm({
                                    ...educationForm,
                                    description: e.target.value,
                                  })
                                }
                                rows={3}
                                placeholder="Relevant coursework, achievements, etc."
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setShowEducationDialog(false)}
                              className="bg-transparent"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleEducationSubmit}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {editingEducation ? "Update" : "Add"} Education
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {educations.map((education) => (
                        <div
                          key={education.id}
                          className="border-l-4 border-green-600 pl-6"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg">
                                  {education.degree}
                                </h3>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleEditEducation(education)
                                    }
                                    className="bg-transparent"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteEducation(education.id)
                                    }
                                    className="bg-transparent text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-green-600 font-medium">
                                {education.institution}
                              </p>
                              <p className="text-gray-600 text-sm flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {education.location}
                              </p>
                              <p className="text-gray-600 text-sm flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                {education.startDate} - {education.endDate}
                                {education.gpa && (
                                  <span className="ml-4">
                                    GPA: {education.gpa}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-3 leading-relaxed">
                            {education.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Portfolio Section - keeping existing implementation */}
              {activeSection === "portfolio" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Portfolio & Projects</CardTitle>
                        <CardDescription>
                          Showcase your best work and personal projects
                        </CardDescription>
                      </div>
                      <Dialog
                        open={showProjectDialog}
                        onOpenChange={setShowProjectDialog}
                      >
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Project
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingProject ? "Edit Project" : "Add Project"}
                            </DialogTitle>
                            <DialogDescription>
                              Add your project details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="proj-title">Project Title</Label>
                              <Input
                                id="proj-title"
                                value={projectForm.title}
                                onChange={(e) =>
                                  setProjectForm({
                                    ...projectForm,
                                    title: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="proj-description">
                                Description
                              </Label>
                              <Textarea
                                id="proj-description"
                                value={projectForm.description}
                                onChange={(e) =>
                                  setProjectForm({
                                    ...projectForm,
                                    description: e.target.value,
                                  })
                                }
                                rows={4}
                              />
                            </div>
                            <div>
                              <Label>Technologies Used</Label>
                              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                {projectForm.technologies.map((tech) => (
                                  <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {tech}
                                    <button
                                      onClick={() =>
                                        removeTechnology(
                                          tech,
                                          projectForm,
                                          setProjectForm
                                        )
                                      }
                                      className="ml-1 hover:text-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add a technology..."
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      addTechnology(
                                        e.currentTarget.value,
                                        projectForm,
                                        setProjectForm
                                      );
                                      e.currentTarget.value = "";
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={(e) => {
                                    const input = e.currentTarget
                                      .previousElementSibling as HTMLInputElement;
                                    addTechnology(
                                      input.value,
                                      projectForm,
                                      setProjectForm
                                    );
                                    input.value = "";
                                  }}
                                  className="bg-transparent"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="proj-live">Live URL</Label>
                                <Input
                                  id="proj-live"
                                  value={projectForm.liveUrl}
                                  onChange={(e) =>
                                    setProjectForm({
                                      ...projectForm,
                                      liveUrl: e.target.value,
                                    })
                                  }
                                  placeholder="https://project.com"
                                />
                              </div>
                              <div>
                                <Label htmlFor="proj-github">GitHub URL</Label>
                                <Input
                                  id="proj-github"
                                  value={projectForm.githubUrl}
                                  onChange={(e) =>
                                    setProjectForm({
                                      ...projectForm,
                                      githubUrl: e.target.value,
                                    })
                                  }
                                  placeholder="https://github.com/user/repo"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setShowProjectDialog(false)}
                              className="bg-transparent"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleProjectSubmit}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {editingProject ? "Update" : "Add"} Project
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="aspect-video bg-gray-100 flex items-center justify-center">
                            <img
                              src={project.imageUrl || "/placeholder.svg"}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling!.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                            <div className="hidden text-gray-400">
                              <Globe className="h-12 w-12" />
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg">
                                {project.title}
                              </h3>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditProject(project)}
                                  className="bg-transparent"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteProject(project.id)
                                  }
                                  className="bg-transparent text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.technologies.slice(0, 3).map((tech) => (
                                <Badge
                                  key={tech}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {project.liveUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="bg-transparent"
                                >
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Live
                                  </a>
                                </Button>
                              )}
                              {project.githubUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="bg-transparent"
                                >
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Github className="h-4 w-4 mr-1" />
                                    Code
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
