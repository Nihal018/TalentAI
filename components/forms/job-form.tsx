// Reusable job form component with validation
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, DollarSign, Building, X, Plus, Loader2 } from "lucide-react"
import type { JobListing } from "@/lib/data-store"

interface JobFormProps {
  job?: JobListing
  onSubmit: (jobData: Partial<JobListing>) => Promise<void>
  onCancel: () => void
  loading?: boolean
  title?: string
  defaultCompany?: string
}

export function JobForm({ job, onSubmit, onCancel, loading = false, title, defaultCompany }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    company: job?.company || defaultCompany || "",
    location: job?.location || "",
    salary: job?.salary || "",
    type: job?.type || ("Full-time" as const),
    status: job?.status || ("active" as const),
    description: job?.description || "",
    requirements: job?.requirements || [],
    skills: job?.skills || [],
    postedBy: job?.postedBy || "",
  })

  const [newRequirement, setNewRequirement] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required"
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.salary.trim()) {
      newErrors.salary = "Salary range is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required"
    }

    if (formData.requirements.length === 0) {
      newErrors.requirements = "At least one requirement is needed"
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill is needed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (requirement: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((r) => r !== requirement),
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title || (job ? "Edit Job" : "Create New Job")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="pl-10"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  className="pl-10"
                  placeholder="Company name"
                  disabled={!!defaultCompany}
                />
              </div>
              {errors.company && <p className="text-sm text-red-600">{errors.company}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                  className="pl-10"
                  placeholder="e.g. $120,000 - $160,000"
                />
              </div>
              {errors.salary && <p className="text-sm text-red-600">{errors.salary}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label>Requirements *</Label>
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement} variant="outline" className="bg-transparent">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requirements.map((requirement, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {requirement}
                  <button
                    type="button"
                    onClick={() => removeRequirement(requirement)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {errors.requirements && <p className="text-sm text-red-600">{errors.requirements}</p>}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Required Skills *</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline" className="bg-transparent">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {job ? "Updating..." : "Creating..."}
                </>
              ) : job ? (
                "Update Job"
              ) : (
                "Create Job"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
