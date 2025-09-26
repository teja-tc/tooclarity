const mongoose = require('mongoose');

const OAuthTokenSchema = new mongoose.Schema({
	provider: { 
		type: String, 
		enum: ['google', 'microsoft', 'apple'], 
		required: true 
	},
	providerUserId: { 
		type: String, 
		required: true, 
		index: true 
	},
	encryptedRefreshToken: { 
		type: String, 
		required: true 
	},
	expiresAt: { 
		type: Date,
		required: true,
		index: { expireAfterSeconds: 0 } // Auto-delete expired tokens
	},
	lastUsedAt: {
		type: Date,
		default: Date.now
	},
	scopes: [{
		type: String
	}],
	isActive: {
		type: Boolean,
		default: true
	},
	// For token rotation
	previousTokens: [{
		encryptedToken: String,
		expiresAt: Date,
		revokedAt: { type: Date, default: null }
	}]
}, { 
	timestamps: true 
});

// Indexes for performance
OAuthTokenSchema.index({ provider: 1, providerUserId: 1 }, { unique: true });
OAuthTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OAuthTokenSchema.index({ lastUsedAt: 1 });
OAuthTokenSchema.index({ isActive: 1 });

module.exports = mongoose.model('OAuthToken', OAuthTokenSchema); 