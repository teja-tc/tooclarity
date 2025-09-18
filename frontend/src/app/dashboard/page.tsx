"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth, withAuth } from "../../lib/auth-context";
import { Button } from "@/components/ui/button";

function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading, isAuthenticated } = useAuth();

  const isAllowed = React.useMemo(() => {
    if (!user) return false;
    return (
      user.role === "INSTITUTE_ADMIN" &&
      user.isPaymentDone === true &&
      user.isProfileCompleted === true
    );
  }, [user]);

  React.useEffect(() => {
    if (loading) return;

    // Not logged in → send to home
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    // Logged in but not eligible → send to payment
    if (!isAllowed) {
      router.replace("/payment");
    }
  }, [loading, isAuthenticated, isAllowed, router]);

  // Show loader while verifying or redirecting
  if (loading || !isAuthenticated || !isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Welcome, {user?.admin}!
              </h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone}</p>
                <p><strong>Designation:</strong> {user?.designation}</p>
                <p><strong>LinkedIn:</strong> 
                  <a 
                    href={user?.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View Profile
                  </a>
                </p>
                <p><strong>Status:</strong> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    user?.verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.verified ? 'Verified' : 'Pending Verification'}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Manage Courses
                </Button>
                <Button className="w-full" variant="outline">
                  View Applications
                </Button>
                <Button className="w-full" variant="outline">
                  Analytics Dashboard
                </Button>
                <Button className="w-full" variant="outline">
                  Account Settings
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <p className="text-gray-600">
              No recent activity to display. Start by adding your first course!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the component wrapped with authentication
export default withAuth(DashboardPage);