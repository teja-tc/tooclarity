"use client";

import { withAuth } from "@/lib/auth-context";

function SettingsPage() {
	return (
		<div className="grid grid-cols-1 gap-6 mb-6 p-2 mt-5 rounded-2xl">
			<div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-700">
				Settings will appear here.
			</div>
		</div>
	);
}

export default withAuth(SettingsPage);
