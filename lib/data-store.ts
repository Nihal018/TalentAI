// In-memory data store with CRUD operations
export interface User {
  id: string
  email: string
  name: string
  role: "job_seeker" | "employer" | "admin"
  company?: string
  profileData?: {
    skills: string[]
    experience: string
    education: string
    location: string
    resumeUrl?: string
  }
  createdAt: string
}

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Remote"
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  status: "active" | "paused" | "closed"
  postedBy: string
  applicants: number
  createdAt: string
  updatedAt: string
}

export interface Application {
  id: string
  jobId: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  resumeUrl: string
  score: number
  status: "pending" | "passed" | "failed"
  appliedAt: string
  assessmentId?: string
}

export interface Assessment {
  id: string
  jobId: string
  title: string
  description: string
  timeLimit: number // in minutes
  passingScore: number
  questions: Question[]
  createdAt: string
}

export interface Question {
  id: string
  type: "multiple_choice" | "coding" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
}

// In-memory storage
const users: User[] = [
  {
    id: "1",
    email: "admin@talentai.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "employer@techcorp.com",
    name: "John Smith",
    role: "employer",
    company: "TechCorp",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "jane@example.com",
    name: "Jane Doe",
    role: "job_seeker",
    profileData: {
      skills: ["JavaScript", "React", "Node.js"],
      experience: "3 years",
      education: "Bachelor's in Computer Science",
      location: "San Francisco, CA",
    },
    createdAt: new Date().toISOString(),
  },
]

const jobs: JobListing[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description: "We are looking for a senior frontend developer to join our team...",
    requirements: ["5+ years React experience", "TypeScript", "GraphQL"],
    benefits: ["Health insurance", "401k", "Remote work"],
    status: "active",
    postedBy: "employer@techcorp.com",
    applicants: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "DataFlow Inc",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100,000 - $130,000",
    description: "Join our backend team to build scalable systems...",
    requirements: ["Node.js", "PostgreSQL", "AWS"],
    benefits: ["Health insurance", "Stock options"],
    status: "active",
    postedBy: "hr@dataflow.com",
    applicants: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const applications: Application[] = [
  {
    id: "1",
    jobId: "1",
    candidateId: "3",
    candidateName: "Jane Doe",
    candidateEmail: "jane@example.com",
    resumeUrl: "/resumes/jane-doe.pdf",
    score: 85,
    status: "passed",
    appliedAt: new Date().toISOString(),
    assessmentId: "1",
  },
]

const assessments: Assessment[] = [
  {
    id: "1",
    jobId: "1",
    title: "Frontend Developer Assessment",
    description: "Test your React and JavaScript knowledge",
    timeLimit: 30,
    passingScore: 70,
    questions: [
      {
        id: "1",
        type: "multiple_choice",
        question: "What is the virtual DOM in React?",
        options: [
          "A copy of the real DOM kept in memory",
          "A new type of DOM element",
          "A React component",
          "A JavaScript library",
        ],
        correctAnswer: 0,
        points: 10,
      },
      {
        id: "2",
        type: "multiple_choice",
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
        points: 10,
      },
    ],
    createdAt: new Date().toISOString(),
  },
]

// CRUD operations
export const dataStore = {
  users: {
    getAll: () => users,
    getById: (id: string) => users.find((u) => u.id === id),
    getByEmail: (email: string) => users.find((u) => u.email === email),
    create: (userData: Omit<User, "id" | "createdAt">) => {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      users.push(newUser)
      return newUser
    },
    update: (id: string, updates: Partial<User>) => {
      const index = users.findIndex((u) => u.id === id)
      if (index === -1) return null
      users[index] = { ...users[index], ...updates }
      return users[index]
    },
    delete: (id: string) => {
      const index = users.findIndex((u) => u.id === id)
      if (index === -1) return false
      users.splice(index, 1)
      return true
    },
  },
  jobs: {
    getAll: () => jobs,
    getById: (id: string) => jobs.find((j) => j.id === id),
    create: (jobData: Omit<JobListing, "id" | "createdAt" | "updatedAt" | "applicants">) => {
      const newJob: JobListing = {
        ...jobData,
        id: Date.now().toString(),
        applicants: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      jobs.push(newJob)
      return newJob
    },
    update: (id: string, updates: Partial<JobListing>) => {
      const index = jobs.findIndex((j) => j.id === id)
      if (index === -1) return null
      jobs[index] = { ...jobs[index], ...updates, updatedAt: new Date().toISOString() }
      return jobs[index]
    },
    delete: (id: string) => {
      const index = jobs.findIndex((j) => j.id === id)
      if (index === -1) return false
      jobs.splice(index, 1)
      return true
    },
  },
  applications: {
    getAll: () => applications,
    getById: (id: string) => applications.find((a) => a.id === id),
    getByJobId: (jobId: string) => applications.filter((a) => a.jobId === jobId),
    getByCandidateId: (candidateId: string) => applications.filter((a) => a.candidateId === candidateId),
    create: (appData: Omit<Application, "id" | "appliedAt">) => {
      const newApplication: Application = {
        ...appData,
        id: Date.now().toString(),
        appliedAt: new Date().toISOString(),
      }
      applications.push(newApplication)

      // Update job applicant count
      const jobIndex = jobs.findIndex((j) => j.id === appData.jobId)
      if (jobIndex !== -1) {
        jobs[jobIndex].applicants += 1
      }

      return newApplication
    },
    update: (id: string, updates: Partial<Application>) => {
      const index = applications.findIndex((a) => a.id === id)
      if (index === -1) return null
      applications[index] = { ...applications[index], ...updates }
      return applications[index]
    },
    delete: (id: string) => {
      const index = applications.findIndex((a) => a.id === id)
      if (index === -1) return false
      applications.splice(index, 1)
      return true
    },
  },
  assessments: {
    getAll: () => assessments,
    getById: (id: string) => assessments.find((a) => a.id === id),
    getByJobId: (jobId: string) => assessments.find((a) => a.jobId === jobId),
    create: (assessmentData: Omit<Assessment, "id" | "createdAt">) => {
      const newAssessment: Assessment = {
        ...assessmentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      assessments.push(newAssessment)
      return newAssessment
    },
    update: (id: string, updates: Partial<Assessment>) => {
      const index = assessments.findIndex((a) => a.id === id)
      if (index === -1) return null
      assessments[index] = { ...assessments[index], ...updates }
      return assessments[index]
    },
    delete: (id: string) => {
      const index = assessments.findIndex((a) => a.id === id)
      if (index === -1) return false
      assessments.splice(index, 1)
      return true
    },
  },
}
