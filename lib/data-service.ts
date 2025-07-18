import { supabase, isSupabaseConfigured } from "./supabase";
import { mockJobs } from "./mock-data";
import type { Users, Jobs, Applications, Resumes } from "./database.types";

// Service interfaces
export interface JobService {
  getAll(): Promise<Jobs[]>;
  getById(id: string): Promise<Jobs | null>;
  create(job: Omit<Jobs, "id" | "posted_date">): Promise<Jobs>;
  update(
    id: string,
    updates: Partial<Omit<Jobs, "id" | "posted_date">>
  ): Promise<Jobs>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<Jobs[]>;
}

export interface UserService {
  getAll(): Promise<Users[]>;
  getById(id: string): Promise<Users | null>;
  getByEmail(email: string): Promise<Users | null>;
  create(user: Omit<Users, "id" | "created_at">): Promise<Users>;
  update(
    id: string,
    updates: Partial<Omit<Users, "id" | "created_at">>
  ): Promise<Users>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<Users[]>;
}

export interface ApplicationService {
  getAll(): Promise<Applications[]>;
  getById(id: string): Promise<Applications | null>;
  create(
    application: Omit<Applications, "id" | "created_at">
  ): Promise<Applications>;
  update(
    id: string,
    updates: Partial<Omit<Applications, "id" | "created_at">>
  ): Promise<Applications>;
  delete(id: string): Promise<boolean>;
}

export interface ResumeService {
  getAll(): Promise<Resumes[]>;
  getById(id: string): Promise<Resumes | null>;
  create(resume: Omit<Resumes, "id" | "created_at">): Promise<Resumes>;
  update(
    id: string,
    updates: Partial<Omit<Resumes, "id" | "created_at">>
  ): Promise<Resumes>;
  delete(id: string): Promise<boolean>;
}

// Job Service Implementation
class JobServiceImpl implements JobService {
  async getAll(): Promise<Jobs[]> {
    if (!isSupabaseConfigured() || !supabase) {
      console.log("Supabase not configured, using mock data");
      return mockJobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        company_logo: job.company_logo,
        description: job.description,
        location: job.location,
        salary: job.salary,
        type: job.type,
        remote: job.remote,
        experience: job.experience,
        skills: job.skills,
        requirements: job.requirements,
        benefits: job.benefits,
        status: job.status,
        posted_date: job.posted_date,
        employer_id: job.employer_id,
        embedding: [],
      }));
    }

    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "active")
        .order("posted_date", { ascending: false });

      if (error) {
        console.error("Database error:", error);
        return mockJobs.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          company_logo: job.company_logo,
          description: job.description,
          location: job.location,
          salary: job.salary,
          type: job.type,
          remote: job.remote,
          experience: job.experience,
          skills: job.skills,
          requirements: job.requirements,
          benefits: job.benefits,
          status: job.status,
          posted_date: job.posted_date,
          employer_id: job.employer_id,
          embedding: [],
        }));
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return mockJobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        company_logo: job.company_logo,
        description: job.description,
        location: job.location,
        salary: job.salary,
        type: job.type,
        remote: job.remote,
        experience: job.experience,
        skills: job.skills,
        requirements: job.requirements,
        benefits: job.benefits,
        status: job.status,
        posted_date: job.posted_date,
        employer_id: job.employer_id,
        embedding: [],
      }));
    }
  }

  async getById(id: string): Promise<Jobs | null> {
    if (!isSupabaseConfigured() || !supabase) {
      const mockJob = mockJobs.find((job) => job.id === id);
      if (!mockJob) return null;

      return {
        id: mockJob.id,
        title: mockJob.title,
        company: mockJob.company,
        company_logo: mockJob.company_logo,
        description: mockJob.description,
        location: mockJob.location,
        salary: mockJob.salary,
        type: mockJob.type,
        remote: mockJob.remote,
        experience: mockJob.experience,
        skills: mockJob.skills,
        requirements: mockJob.requirements,
        benefits: mockJob.benefits,
        status: mockJob.status,
        posted_date: mockJob.posted_date,
        employer_id: mockJob.employer_id,
        embedding: [],
      };
    }

    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Database error:", error);
        const mockJob = mockJobs.find((job) => job.id === id);
        if (!mockJob) return null;

        return {
          id: mockJob.id,
          title: mockJob.title,
          company: mockJob.company,
          company_logo: mockJob.company_logo,
          description: mockJob.description,
          location: mockJob.location,
          salary: mockJob.salary,
          type: mockJob.type,
          remote: mockJob.remote,
          experience: mockJob.experience,
          skills: mockJob.skills,
          requirements: mockJob.requirements,
          benefits: mockJob.benefits,
          status: mockJob.status,
          posted_date: mockJob.posted_date,
          employer_id: mockJob.employer_id,
          embedding: [],
        };
      }

      return data;
    } catch (error) {
      console.error("Error fetching job:", error);
      return null;
    }
  }

  async create(job: Omit<Jobs, "id" | "posted_date">): Promise<Jobs> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Database not configured");
    }

    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([
          {
            ...job,
            posted_date: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating job:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in createJob:", error);
      throw error;
    }
  }

  async update(
    id: string,
    updates: Partial<Omit<Jobs, "id" | "posted_date">>
  ): Promise<Jobs> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Database not configured");
    }

    try {
      const { data, error } = await supabase
        .from("jobs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating job:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in updateJob:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
      return false;
    }

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);

      if (error) {
        console.error("Error deleting job:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteJob:", error);
      return false;
    }
  }

  async search(query: string): Promise<Jobs[]> {
    const jobs = await this.getAll();
    if (!query) return jobs;

    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        (job.skills &&
          job.skills.some((skill) =>
            skill.toLowerCase().includes(query.toLowerCase())
          ))
    );
  }
}

// User Service Implementation
class UserServiceImpl implements UserService {
  async getAll(): Promise<Users[]> {
    if (!isSupabaseConfigured() || !supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getUsers:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Users | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getUserById:", error);
      return null;
    }
  }

  async getByEmail(email: string): Promise<Users | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Error fetching user by email:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      return null;
    }
  }

  async create(user: Omit<Users, "id" | "created_at">): Promise<Users> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Database not configured");
    }

    try {
      console.log("Creating user in database:", user);

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            ...user,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating user:", error);
        throw error;
      }

      console.log("User created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  }

  async update(
    id: string,
    updates: Partial<Omit<Users, "id" | "created_at">>
  ): Promise<Users> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Database not configured");
    }

    try {
      console.log("Updating user in database:", id, updates);

      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }

      console.log("User updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
      return false;
    }

    try {
      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) {
        console.error("Error deleting user:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteUser:", error);
      return false;
    }
  }

  async search(query: string): Promise<Users[]> {
    const users = await this.getAll();
    if (!query) return users;

    return users.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(query.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

// Application Service Implementation
class ApplicationServiceImpl implements ApplicationService {
  async getAll(): Promise<Applications[]> {
    if (!isSupabaseConfigured() || !supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getApplications:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Applications | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching application:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getApplicationById:", error);
      return null;
    }
  }

  async create(
    application: Omit<Applications, "id" | "created_at">
  ): Promise<Applications> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Database not configured");
    }

    try {
      console.log("Creating application in database:", application);

      const { data, error } = await supabase
        .from("applications")
        .insert([
          {
            ...application,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating application:", error);
        throw error;
      }

      console.log("Application created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in createApplication:", error);
      throw error;
    }
  }

  async update(
    id: string,
    updates: Partial<Omit<Applications, "id" | "created_at">>
  ): Promise<Applications> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Database not configured");
    }

    try {
      const { data, error } = await supabase
        .from("applications")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating application:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in updateApplication:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
      return false;
    }

    try {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting application:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteApplication:", error);
      return false;
    }
  }
}

// Resume Service Implementation
class ResumeServiceImpl implements ResumeService {
  async getAll(): Promise<Resumes[]> {
    if (!isSupabaseConfigured() || !supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching resumes:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getResumes:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Resumes | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching resume:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getResumeById:", error);
      return null;
    }
  }

  async create(resume: Omit<Resumes, "id" | "created_at">): Promise<Resumes> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Database not configured");
    }

    try {
      console.log("Creating resume in database:", resume);

      const { data, error } = await supabase
        .from("resumes")
        .insert([
          {
            ...resume,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating resume:", error);
        throw error;
      }

      console.log("Resume created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in createResume:", error);
      throw error;
    }
  }

  async update(
    id: string,
    updates: Partial<Omit<Resumes, "id" | "created_at">>
  ): Promise<Resumes> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Database not configured");
    }

    try {
      const { data, error } = await supabase
        .from("resumes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating resume:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in updateResume:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
      return false;
    }

    try {
      const { error } = await supabase.from("resumes").delete().eq("id", id);

      if (error) {
        console.error("Error deleting resume:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteResume:", error);
      return false;
    }
  }
}

// Export service instances
export const jobService = new JobServiceImpl();
export const userService = new UserServiceImpl();
export const applicationService = new ApplicationServiceImpl();
export const resumeService = new ResumeServiceImpl();

// Legacy export for backward compatibility
export const dataService = {
  getJobs: (filters?: any) => jobService.getAll(),
  getJobById: (id: string) => jobService.getById(id),
  searchJobs: (query: string) => jobService.search(query),
  createJob: (job: any) => jobService.create(job),
  updateJob: (id: string, updates: any) => jobService.update(id, updates),
  deleteJob: (id: string) => jobService.delete(id),

  getUsers: () => userService.getAll(),
  getUserById: (id: string) => userService.getById(id),
  createUser: (user: any) => userService.create(user),
  updateUser: (id: string, updates: any) => userService.update(id, updates),
  deleteUser: (id: string) => userService.delete(id),

  getApplications: () => applicationService.getAll(),
  createApplication: (app: any) => applicationService.create(app),

  getResumes: () => resumeService.getAll(),
  createResume: (resume: any) => resumeService.create(resume),
};
