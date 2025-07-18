"use client"

// Custom hook for CRUD operations with optimistic updates
import { useState, useCallback, useMemo } from "react"
import { dataStore } from "@/lib/data-store"
import { SearchEngine, type SearchOptions, type SearchResult } from "@/lib/search-utils"
import type { User, JobListing } from "@/lib/data-store"

export function useUserCrud() {
  const [users, setUsers] = useState<User[]>(() => dataStore.users.getAll())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchEngine = useMemo(() => {
    return new SearchEngine(users, [], [])
  }, [users])

  const searchUsers = useCallback(
    (options: SearchOptions): SearchResult<User> => {
      searchEngine.updateData(users, [], [])
      return searchEngine.searchUsers(options)
    },
    [users, searchEngine],
  )

  const createUser = useCallback(async (userData: Omit<User, "id" | "createdAt">) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newUser = dataStore.users.create(userData)
      setUsers((prev) => [...prev, newUser])
      return newUser
    } catch (err) {
      setError("Failed to create user")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const updatedUser = dataStore.users.update(id, updates)
      if (!updatedUser) throw new Error("User not found")

      setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)))
      return updatedUser
    } catch (err) {
      setError("Failed to update user")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const success = dataStore.users.delete(id)
      if (!success) throw new Error("User not found")

      setUsers((prev) => prev.filter((user) => user.id !== id))
      return true
    } catch (err) {
      setError("Failed to delete user")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshUsers = useCallback(() => {
    setUsers(dataStore.users.getAll())
  }, [])

  return {
    users,
    loading,
    error,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
  }
}

export function useJobCrud(companyFilter?: string) {
  const [jobs, setJobs] = useState<JobListing[]>(() => {
    const allJobs = dataStore.jobs.getAll()
    return companyFilter ? allJobs.filter((job) => job.company === companyFilter) : allJobs
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchEngine = useMemo(() => {
    return new SearchEngine([], jobs, [])
  }, [jobs])

  const searchJobs = useCallback(
    (options: SearchOptions): SearchResult<JobListing> => {
      searchEngine.updateData([], jobs, [])
      return searchEngine.searchJobs(options)
    },
    [jobs, searchEngine],
  )

  const createJob = useCallback(async (jobData: Omit<JobListing, "id" | "createdAt" | "updatedAt" | "applicants">) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newJob = dataStore.jobs.create(jobData)
      setJobs((prev) => [...prev, newJob])
      return newJob
    } catch (err) {
      setError("Failed to create job")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateJob = useCallback(async (id: string, updates: Partial<JobListing>) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const updatedJob = dataStore.jobs.update(id, updates)
      if (!updatedJob) throw new Error("Job not found")

      setJobs((prev) => prev.map((job) => (job.id === id ? updatedJob : job)))
      return updatedJob
    } catch (err) {
      setError("Failed to update job")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteJob = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const success = dataStore.jobs.delete(id)
      if (!success) throw new Error("Job not found")

      setJobs((prev) => prev.filter((job) => job.id !== id))
      return true
    } catch (err) {
      setError("Failed to delete job")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshJobs = useCallback(() => {
    const allJobs = dataStore.jobs.getAll()
    const newJobs = companyFilter ? allJobs.filter((job) => job.company === companyFilter) : allJobs
    setJobs(newJobs)
  }, [companyFilter])

  return {
    jobs,
    loading,
    error,
    searchJobs,
    createJob,
    updateJob,
    deleteJob,
    refreshJobs,
  }
}
