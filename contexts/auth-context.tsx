"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { userService } from "@/lib/data-service";
import type { Users } from "@/lib/database.types";

export type UserRole = "job_seeker" | "employer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  profileData?: {
    phone?: string;
    location?: string;
    bio?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    website?: string;
    github?: string;
    linkedin?: string;
  };
  hasUploadedResume?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    company?: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "job_seeker",
    profileData: {
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      bio: "Experienced software engineer with 5+ years in full-stack development",
      skills: ["React", "Node.js", "TypeScript", "Python"],
      website: "https://johndoe.dev",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
    },
    hasUploadedResume: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "hr@techcorp.com",
    role: "employer",
    company: "TechCorp Inc.",
    profileData: {
      phone: "+1 (555) 987-6543",
      location: "New York, NY",
      bio: "HR Manager at TechCorp, passionate about finding great talent",
    },
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@talentai.com",
    role: "admin",
    profileData: {
      bio: "System administrator for TalentAI platform",
    },
  },
];

// Password mapping for demo
const mockPasswords: Record<string, string> = {
  "john@example.com": "seeker123",
  "hr@techcorp.com": "employer123",
  "admin@talentai.com": "admin123",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("talentai_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("talentai_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Check mock users first
      const mockUser = mockUsers.find((u) => u.email === email);
      if (mockUser && mockPasswords[email] === password) {
        setUser(mockUser);
        localStorage.setItem("talentai_user", JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }

      // Try database lookup
      const dbUser = await userService.getByEmail(email);
      if (dbUser) {
        // In a real app, you'd verify the password hash
        // For demo purposes, we'll accept any password for DB users
        const user: User = {
          id: dbUser.id,
          name: dbUser.name || "",
          email: dbUser.email || "",
          role: dbUser.role,
          company: dbUser.role === "employer" ? "Company Name" : undefined,
          profileData:
            typeof dbUser.profile_data === "object" &&
            dbUser.profile_data !== null
              ? (dbUser.profile_data as User["profileData"])
              : undefined,
          hasUploadedResume: dbUser.role === "job_seeker" ? false : undefined,
        };

        setUser(user);
        localStorage.setItem("talentai_user", JSON.stringify(user));
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    company?: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Check if user already exists in mock data
      const existingMockUser = mockUsers.find((u) => u.email === email);
      if (existingMockUser) {
        setIsLoading(false);
        return false;
      }

      // Check if user already exists in database
      const existingDbUser = await userService.getByEmail(email);
      if (existingDbUser) {
        setIsLoading(false);
        return false;
      }

      // Create new user in database
      const newDbUser: Omit<Users, "id" | "created_at"> = {
        name,
        email,
        role,
        profile_data: company ? { company } : null,
      };

      const createdUser = await userService.create(newDbUser);

      const user: User = {
        id: createdUser.id,
        name: createdUser.name || "",
        email: createdUser.email || "",
        role: createdUser.role,
        company: company,
        profileData:
          typeof createdUser.profile_data === "object" &&
          createdUser.profile_data !== null
            ? (createdUser.profile_data as User["profileData"])
            : undefined,
        hasUploadedResume: role === "job_seeker" ? false : undefined,
      };

      setUser(user);
      localStorage.setItem("talentai_user", JSON.stringify(user));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("talentai_user");
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      // Update in database if user exists there
      const dbUser = await userService.getById(user.id);
      if (dbUser) {
        const dbUpdates: Partial<Omit<Users, "id" | "created_at">> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.profileData !== undefined)
          dbUpdates.profile_data = updates.profileData;

        await userService.update(user.id, dbUpdates);
      }

      // Update local state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("talentai_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
