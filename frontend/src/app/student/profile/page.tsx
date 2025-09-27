"use client";

import { useState, useEffect } from "react";
import { authAPI } from "@/lib/api";

interface StudentProfileData {
id: string;
name: string;
role: string;
isStudent: boolean;
// Google profile fields - all required
email: string | null;
emailVerified: boolean | null;
picture: string | null;
givenName: string | null;
familyName: string | null;
birthday: string | { year?: number; month?: number; day?: number } | null;
gender: string | null;
phone: string | null;
organization: string | null;
address: string | null;
}

export default function StudentProfilePage() {
const [profile, setProfile] = useState<StudentProfileData | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
void fetchProfile();
}, []);

async function fetchProfile() {
try {
setLoading(true);
const response = await authAPI.getProfile();
if ((response as any)?.success) {
setProfile((response as any).data);
} else {
setError((response as any)?.message || "Failed to fetch profile");
}
} catch (err: any) {
setError(err?.message || "An error occurred");
} finally {
setLoading(false);
}
}

async function handleSignOut() {
try {
if (typeof (authAPI as any).logout === "function") {
await (authAPI as any).logout();
} else if (typeof (authAPI as any).signOut === "function") {
await (authAPI as any).signOut();
}
window.location.href = "/";
} catch (err) {
console.error("Sign out error:", err);
}
}

function renderBirthday(b: StudentProfileData["birthday"]) {
if (!b) return "Not provided";
if (typeof b === "string") return b;
const y = (b as any)?.year;
const m = (b as any)?.month;
const d = (b as any)?.day;
const parts = [y, m, d].filter(Boolean).join("-");
return parts || "Not provided";
}

function renderField(value: string | null | undefined, fallback: string = "Not provided") {
return value || fallback;
}

if (loading) {
return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
<div className="bg-white p-8 rounded-lg shadow-md">
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
<p className="mt-4 text-gray-600">Loading profile...</p>
</div>
</div>
);
}

if (error) {
return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
<div className="bg-white p-8 rounded-lg shadow-md">
<div className="text-red-500 text-center">
<h2 className="text-xl font-semibold mb-2">Error</h2>
<p>{error}</p>
<button
onClick={() => window.location.reload()}
className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
Retry
</button>
</div>
</div>
</div>
);
}

return (
<div className="min-h-screen bg-gray-50 py-8">
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Header */}
<div className="bg-white rounded-lg shadow-md p-6 mb-6">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
{profile?.picture ? (
<img src={profile.picture} alt="avatar" className="w-16 h-16 object-cover" />
) : (
<span className="text-2xl font-bold text-blue-600">
{profile?.name?.charAt(0)?.toUpperCase() || "S"}
</span>
)}
</div>
<div>
<h1 className="text-2xl font-bold text-gray-900">{profile?.name || "Student"}</h1>
<p className="text-gray-600">{profile?.role}</p>
<p className="text-gray-600">
{renderField(profile?.email)} {profile?.emailVerified ? <span className="text-green-600">(verified)</span> : <span className="text-yellow-600">(unverified)</span>}
</p>
</div>
</div>
<button
onClick={handleSignOut}
className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
>
Sign Out
</button>
</div>
</div>

{/* Profile Details */}
<div className="bg-white rounded-lg shadow-md p-6 mb-6">
<h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700">Full Name</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{renderField(profile?.name)}</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Given Name</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{renderField(profile?.givenName)}</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Family Name</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{renderField(profile?.familyName)}</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Email</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{renderField(profile?.email)}</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Email Verified</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
{profile?.emailVerified === true ? "Yes" : profile?.emailVerified === false ? "No" : "Not provided"}
</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Birthday</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{renderBirthday(profile?.birthday ?? null)}</p>
</div>
</div>
<div className="space-y-4">
{/* Removed User ID, OAuth Provider, Provider User ID, Locale, Hosted Domain */}
<div>
<label className="block text-sm font-medium text-gray-700">Gender</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{renderField(profile?.gender)}</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Phone</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{renderField(profile?.phone)}</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Organization</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{renderField(profile?.organization)}</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Address</label>
<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded break-words">{renderField(profile?.address)}</p>
</div>
</div>
</div>
</div>

{/* OAuth Information */}
<div className="bg-white rounded-lg shadow-md p-6">
<h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Details</h2>
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
<div className="flex items-start space-x-3">
<div className="flex-shrink-0">
<svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
</svg>
</div>
<div>
<h3 className="text-sm font-medium text-blue-800">Authentication Information</h3>
<div className="mt-2 text-sm text-blue-700">
<p>You are authenticated via OAuth</p>
<p>Your session is securely managed with JWT tokens</p>
<p>OAuth tokens are encrypted and stored securely</p>
</div>
</div>
</div>
</div>

{/* Action Buttons */}
<div className="mt-6 flex space-x-4">
<button
onClick={() => void fetchProfile()}
className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
>
Refresh Profile
</button>
<button
onClick={() => { window.location.href = "/"; }}
className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
>
Go to Home
</button>
</div>
</div>
</div>
</div>
);
}