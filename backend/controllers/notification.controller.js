const Notification = require('../models/Notification');

// Utility: build recipient filter from query and auth context
function buildScopeFilter(req) {
	const { scope, studentId, institutionId, branchId } = req.query;
	// For admins, we can infer institutionAdmin from req.user if available
	const filter = {};
	if (scope === 'student' && studentId) { filter.recipientType = 'STUDENT'; filter.student = studentId; }
	else if (scope === 'institution' && institutionId) { filter.recipientType = 'INSTITUTION'; filter.institution = institutionId; }
	else if (scope === 'branch' && branchId) { filter.recipientType = 'BRANCH'; filter.branch = branchId; }
	else if (scope === 'admin' && (req.user?.id || req.query.institutionAdminId)) { filter.recipientType = 'ADMIN'; filter.institutionAdmin = req.user?.id || req.query.institutionAdminId; }
	else { filter.recipientType = { $in: ['SYSTEM','ADMIN','INSTITUTION','BRANCH','STUDENT'] }; }
	return filter;
}

exports.list = async function(req, res) {
	try {
		const { page = 1, limit = 20, unread, category } = req.query;
		const filter = buildScopeFilter(req);
		if (typeof unread !== 'undefined') filter.read = unread === 'true' ? false : true;
		if (category) filter.category = category;
		const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(100, parseInt(limit));
		const query = Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Math.min(100, parseInt(limit)));
		const [items, total] = await Promise.all([
			query,
			Notification.countDocuments(filter)
		]);
		res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
	} catch (e) {
		res.status(500).json({ success: false, message: e.message });
	}
};

exports.create = async function(req, res) {
	try {
		const { title, description, category, recipientType, student, institution, branch, institutionAdmin, metadata } = req.body;
		/* Set expiresAt per policy
		const now = Date.now();
		const ttlByCategoryMs = {
			otp: 5 * 60 * 1000,
			system: 30 * 24 * 60 * 60 * 1000,
			billing: 180 * 24 * 60 * 60 * 1000,
			security: 90 * 24 * 60 * 60 * 1000,
			user: 30 * 24 * 60 * 60 * 1000,
			other: 60 * 24 * 60 * 60 * 1000
		};
		const ttl = ttlByCategoryMs[(category || 'other').toLowerCase()] || ttlByCategoryMs.other;
		const expiresAt = new Date(now + ttl);
		const doc = await Notification.create({ title, description, category, recipientType, student, institution, branch, institutionAdmin, metadata, expiresAt });*/
		// Global policy: 7-day retention handled by TTL on createdAt
		const doc = await Notification.create({ title, description, category, recipientType, student, institution, branch, institutionAdmin, metadata });
		res.json({ success: true, data: doc });
	} catch (e) {
		res.status(400).json({ success: false, message: e.message });
	}
};

exports.markRead = async function(req, res) {
	try {
		const { ids } = req.body;
		if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ success: false, message: 'ids required' });
		await Notification.updateMany({ _id: { $in: ids } }, { $set: { read: true } });
		res.json({ success: true });
	} catch (e) {
		res.status(400).json({ success: false, message: e.message });
	}
};

exports.markUnread = async function(req, res) {
	try {
		const { ids } = req.body;
		if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ success: false, message: 'ids required' });
		await Notification.updateMany({ _id: { $in: ids } }, { $set: { read: false } });
		res.json({ success: true });
	} catch (e) {
		res.status(400).json({ success: false, message: e.message });
	}
};

exports.remove = async function(req, res) {
	try {
		const { ids } = req.body;
		if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ success: false, message: 'ids required' });
		await Notification.deleteMany({ _id: { $in: ids } });
		res.json({ success: true });
	} catch (e) {
		res.status(400).json({ success: false, message: e.message });
	}
};

// Optional: retention compactor for categories (defensive cleanup)
exports.compact = async function(req, res) {
	try {
		const retentionDays = {
			otp: 0, // handled by TTL 5m
			system: 60,
			billing: 365,
			security: 180,
			user: 90,
			other: 90
		};
		const now = Date.now();
		const ops = Object.entries(retentionDays).map(async ([cat, days]) => {
			if (!days) return { cat, deleted: 0 };
			const cutoff = new Date(now - days * 24 * 60 * 60 * 1000);
			const r = await Notification.deleteMany({ category: cat, createdAt: { $lt: cutoff } });
			return { cat, deleted: r.deletedCount || 0 };
		});
		const results = await Promise.all(ops);
		res.json({ success: true, data: { results } });
	} catch (e) {
		res.status(500).json({ success: false, message: e.message });
	}
}; 