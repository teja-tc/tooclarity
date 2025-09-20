const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	category: { type: String, enum: ['system','billing','user','security','other'], default: 'other' },
	read: { type: Boolean, default: false },

	recipientType: { type: String, enum: ['CUSTOMER','INSTITUTION','BRANCH','ADMIN'], required: true },
	customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
	institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
	branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'InstituteAdmin' },

	metadata: { type: Object },
}, { timestamps: true });

NotificationSchema.index({ recipientType: 1 });
NotificationSchema.index({ owner: 1 });
NotificationSchema.index({ institution: 1 });
NotificationSchema.index({ branch: 1 });
NotificationSchema.index({ customer: 1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema); 