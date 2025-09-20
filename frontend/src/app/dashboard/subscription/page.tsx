"use client";

import React, { useEffect, useState } from "react";
import SubscriptionGauge from "@/components/dashboard/SubscriptionGauge";
import { withAuth } from "@/lib/auth-context";
import { getMyInstitution, getInstitutionCourses } from "@/lib/api";

function SubscriptionPage() {
	const [daysLeft, setDaysLeft] = useState(0);
	const [institutionId, setInstitutionId] = useState<string | null>(null);
	const [institutionCreatedAt, setInstitutionCreatedAt] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const inst = await getMyInstitution();
				if (!mounted || !inst?._id) return;
				setInstitutionId(inst._id);
				if (inst?.createdAt) setInstitutionCreatedAt(inst.createdAt);
				if (inst?.createdAt) {
					const created = new Date(inst.createdAt);
					const now = new Date();
					const diffMs = now.getTime() - created.getTime();
					const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
					setDaysLeft(Math.max(0, 30 - diffDays));
				} else if (inst?._id) {
					const courses = await getInstitutionCourses(inst._id);
					if (Array.isArray(courses)) setDaysLeft(Math.max(0, 30 - (courses.length % 30)));
				}
			} catch {}
		})();
		return () => { mounted = false; };
	}, []);

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
			} catch {}
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
