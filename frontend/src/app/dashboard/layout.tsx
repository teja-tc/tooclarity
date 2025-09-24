"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { useAuth } from "@/lib/auth-context";
import { authAPI } from "@/lib/api";
import { motion } from "framer-motion";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = useAuth();
	const [profileName, setProfileName] = useState<string | undefined>(undefined);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const profile = await authAPI.getProfile();
				if (mounted && (profile as any)?.data?.name) {
					setProfileName((profile as any).data.name);
				}
			} catch (err) { console.error('Dashboard layout: profile fetch failed', err); }
		})();
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div className="min-h-screen w-full">
			<div className="flex flex-col lg:flex-row gap-2 lg:gap-6">
				<Sidebar />
				<motion.main 
					className="flex-1 max-w-[1900px] mr-0 lg:mr-5 px-2 sm:px-4 lg:px-6 ml-0 h-[100dvh] overflow-y-auto scrollbar-hide pb-20 lg:pb-0"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<Topbar 
						userName={profileName || user?.name || user?.admin} 
						onSearch={(query) => console.log('Search:', query)}
						onNotificationClick={() => console.log('Notifications clicked')}
						onProfileClick={() => console.log('Profile clicked')}
					/>
					{children}
				</motion.main>
			</div>
		</div>
	);
} 