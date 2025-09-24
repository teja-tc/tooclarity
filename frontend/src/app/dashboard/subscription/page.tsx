"use client";

import React, { useEffect, useState } from "react";
import SubscriptionGauge from "@/components/dashboard/SubscriptionGauge";
import { withAuth } from "@/lib/auth-context";
import { getInstitutionCourses } from "@/lib/api";
import { useInstitution } from "@/lib/hooks/dashboard-hooks";

function SubscriptionPage() {
	const [daysLeft, setDaysLeft] = useState(0);
	const [institutionId, setInstitutionId] = useState<string | null>(null);
	const [institutionCreatedAt, setInstitutionCreatedAt] = useState<string | null>(null);
	const { data: institution } = useInstitution();

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				if (!institution?._id) return;
				if (!mounted) return;
				setInstitutionId(institution._id);
				if ((institution as any)?.createdAt) setInstitutionCreatedAt((institution as any).createdAt);
				if ((institution as any)?.createdAt) {
					const created = new Date((institution as any).createdAt);
					const now = new Date();
					const diffMs = now.getTime() - created.getTime();
					const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
					setDaysLeft(Math.max(0, 30 - diffDays));
				} else if (institution?._id) {
					const courses = await getInstitutionCourses(institution._id);
					if (Array.isArray(courses)) setDaysLeft(Math.max(0, 30 - (courses.length % 30)));
				}
			} catch (err) { console.error('Subscription: initial fetch failed', err); }
		})();
		return () => { mounted = false; };
	}, [institution]);

	useEffect(() => {
		if (!institutionId) return;
		const interval = setInterval(async () => {
			try {
				if (institutionCreatedAt) {
					const created = new Date(institutionCreatedAt);
					const now = new Date();
					const diffMs = now.getTime() - created.getTime();
					const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
					setDaysLeft(Math.max(0, 30 - diffDays));
				} else {
					const courses = await getInstitutionCourses(institutionId);
					if (Array.isArray(courses)) setDaysLeft(Math.max(0, 30 - (courses.length % 30)));
				}
			} catch (err) { console.error('Subscription: interval update failed', err); }
		}, 10000);
		return () => clearInterval(interval);
	}, [institutionId, institutionCreatedAt]);

	return (
		<div className="grid grid-cols-1 gap-6 mb-6 p-2 mt-5 rounded-2xl">
			<SubscriptionGauge daysLeft={Math.floor(daysLeft)} onUpgrade={() => {}} />
		</div>
	);
}

export default withAuth(SubscriptionPage);
