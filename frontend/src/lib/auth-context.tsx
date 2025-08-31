"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  admin: string;
  phone?: string;
  designation?: string;
  linkedin?: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is logged in on app start
  useEffect(() => {
    const initAuth = async () => {
      // Try to get user profile - if backend has valid cookie, it will succeed
      await refreshUser();
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      console.log("Login response:", response); // Debug log

      if (response.success) {
        // Check if user data is in response.data.user or directly in response.data
        const userData = response.data?.user || response.data;

        if (userData && userData.id) {
          setUser(userData);
          return true;
        } else {
          // If no user data but login was successful, try to fetch user profile
          await refreshUser();
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();

      if (response.success && response.data) {
        setUser({
          id: "",
          email: response.data.email,
          admin: "",
          phone: response.data.contactNumber,
          designation: response.data.designation || "",
          linkedin: response.data.linkedin || "",
          verified: true,
          name: response.data.name,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
