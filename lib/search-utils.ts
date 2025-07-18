// Advanced search and filter utilities
import Fuse from "fuse.js"
import type { User, JobListing, Application } from "./data-store"

export interface SearchOptions {
  query?: string
  filters?: Record<string, any>
  sortBy?: string
  sortOrder?: "asc" | "desc"
  limit?: number
  offset?: number
}

export interface SearchResult<T> {
  items: T[]
  total: number
  hasMore: boolean
}

// User search configuration
const userSearchOptions = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "email", weight: 0.3 },
    { name: "company", weight: 0.2 },
    { name: "role", weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
}

// Job search configuration
const jobSearchOptions = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "company", weight: 0.3 },
    { name: "location", weight: 0.2 },
    { name: "skills", weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
}

// Application search configuration
const applicationSearchOptions = {
  keys: [
    { name: "candidateName", weight: 0.4 },
    { name: "candidateEmail", weight: 0.3 },
    { name: "status", weight: 0.3 },
  ],
  threshold: 0.3,
  includeScore: true,
}

export class SearchEngine {
  private userFuse: Fuse<User>
  private jobFuse: Fuse<JobListing>
  private applicationFuse: Fuse<Application>

  constructor(users: User[], jobs: JobListing[], applications: Application[]) {
    this.userFuse = new Fuse(users, userSearchOptions)
    this.jobFuse = new Fuse(jobs, jobSearchOptions)
    this.applicationFuse = new Fuse(applications, applicationSearchOptions)
  }

  updateData(users: User[], jobs: JobListing[], applications: Application[]) {
    this.userFuse.setCollection(users)
    this.jobFuse.setCollection(jobs)
    this.applicationFuse.setCollection(applications)
  }

  searchUsers(options: SearchOptions): SearchResult<User> {
    let results = options.query
      ? this.userFuse.search(options.query).map((result) => result.item)
      : (this.userFuse.getIndex().docs as User[])

    // Apply filters
    if (options.filters) {
      results = this.applyFilters(results, options.filters)
    }

    // Apply sorting
    if (options.sortBy) {
      results = this.applySorting(results, options.sortBy, options.sortOrder || "asc")
    }

    // Apply pagination
    const total = results.length
    const offset = options.offset || 0
    const limit = options.limit || total
    const paginatedResults = results.slice(offset, offset + limit)

    return {
      items: paginatedResults,
      total,
      hasMore: offset + limit < total,
    }
  }

  searchJobs(options: SearchOptions): SearchResult<JobListing> {
    let results = options.query
      ? this.jobFuse.search(options.query).map((result) => result.item)
      : (this.jobFuse.getIndex().docs as JobListing[])

    if (options.filters) {
      results = this.applyFilters(results, options.filters)
    }

    if (options.sortBy) {
      results = this.applySorting(results, options.sortBy, options.sortOrder || "asc")
    }

    const total = results.length
    const offset = options.offset || 0
    const limit = options.limit || total
    const paginatedResults = results.slice(offset, offset + limit)

    return {
      items: paginatedResults,
      total,
      hasMore: offset + limit < total,
    }
  }

  searchApplications(options: SearchOptions): SearchResult<Application> {
    let results = options.query
      ? this.applicationFuse.search(options.query).map((result) => result.item)
      : (this.applicationFuse.getIndex().docs as Application[])

    if (options.filters) {
      results = this.applyFilters(results, options.filters)
    }

    if (options.sortBy) {
      results = this.applySorting(results, options.sortBy, options.sortOrder || "asc")
    }

    const total = results.length
    const offset = options.offset || 0
    const limit = options.limit || total
    const paginatedResults = results.slice(offset, offset + limit)

    return {
      items: paginatedResults,
      total,
      hasMore: offset + limit < total,
    }
  }

  private applyFilters<T extends Record<string, any>>(items: T[], filters: Record<string, any>): T[] {
    return items.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === "" || value === null || value === undefined) return true

        const itemValue = this.getNestedValue(item, key)

        if (Array.isArray(value)) {
          return value.includes(itemValue)
        }

        if (typeof value === "string" && typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(value.toLowerCase())
        }

        return itemValue === value
      })
    })
  }

  private applySorting<T extends Record<string, any>>(items: T[], sortBy: string, sortOrder: "asc" | "desc"): T[] {
    return [...items].sort((a, b) => {
      const aValue = this.getNestedValue(a, sortBy)
      const bValue = this.getNestedValue(b, sortBy)

      let comparison = 0

      if (aValue < bValue) comparison = -1
      else if (aValue > bValue) comparison = 1

      return sortOrder === "desc" ? -comparison : comparison
    })
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj)
  }
}
