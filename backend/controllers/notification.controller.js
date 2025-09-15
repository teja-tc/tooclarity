const Notification = require('../models/Notification');

// Utility: build recipient filter from query and auth context
function buildScopeFilter(req) {
	const { scope, customerId, institutionId, branchId } = req.query;
	// For admins, we can infer owner from req.user if available
	const filter = {};
	if (scope === 'customer' && customerId) { filter.recipientType = 'CUSTOMER'; filter.customer = customerId; }
	else if (scope === 'institution' && institutionId) { filter.recipientType = 'INSTITUTION'; filter.institution = institutionId; }
	else if (scope === 'branch' && branchId) { filter.recipientType = 'BRANCH'; filter.branch = branchId; }
	else if (scope === 'admin' && (req.user?.id || req.query.ownerId)) { filter.recipientType = 'ADMIN'; filter.owner = req.user?.id || req.query.ownerId; }
	else { filter.recipientType = { $in: ['SYSTEM','ADMIN','INSTITUTION','BRANCH','CUSTOMER'] }; }
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
		const { title, description, category, recipientType, customer, institution, branch, owner, metadata } = req.body;
		const doc = await Notification.create({ title, description, category, recipientType, customer, institution, branch, owner, metadata });
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