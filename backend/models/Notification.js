const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	category: { type: String, enum: ['system','billing','user','security','other','otp'], default: 'other' },
	read: { type: Boolean, default: false },

	recipientType: { type: String, enum: ['STUDENT','INSTITUTION','BRANCH','ADMIN'], required: true },
	student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
	institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
	branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
	institutionAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'InstituteAdmin' },

	metadata: { type: Object },
	// Optional hard TTL; set per category when created
	expiresAt: { type: Date, default: null }
}, { timestamps: true });

NotificationSchema.index({ recipientType: 1 });
NotificationSchema.index({ institutionAdmin: 1 });
NotificationSchema.index({ institution: 1 });
NotificationSchema.index({ branch: 1 });
NotificationSchema.index({ student: 1 });
NotificationSchema.index({ createdAt: -1 });
/* TTL index (Mongo will drop docs when expiresAt passes)
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); */

// Enforce global 7-day retention from creation time
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });


module.exports = mongoose.model('Notification', NotificationSchema); 