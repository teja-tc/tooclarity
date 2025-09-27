const JwtUtil = require('../utils/jwt.util');
const CookieUtil = require('../utils/cookie.util');
const RedisUtil = require('../utils/redis.util');
const otpService = require('../services/otp.service');
const AppError = require('../utils/appError');
const logger = require('../config/logger');

// Helpers
async function issueSession(res, userLike, message = 'ok') {
	const userId = String(userLike._id || userLike.id || userLike.phone);
	const username = userLike.studentName || userLike.name || 'student';
	const role = 'STUDENT';
	const accessToken = JwtUtil.generateToken(userId, username, 'access', role);
	const refreshToken = JwtUtil.generateToken(userId, username, 'refresh', role);
	const decodedRefresh = JwtUtil.decodeToken(refreshToken);
	const ttlSeconds = decodedRefresh.exp - Math.floor(Date.now() / 1000);
	await RedisUtil.saveRefreshToken(userId, refreshToken, ttlSeconds);
	CookieUtil.setCookie(res, 'access_token', accessToken);
	CookieUtil.setCookie(res, 'username', username, { maxAge: 7 * 24 * 60 * 60 * 1000 });
	return res.status(200).json({ status: 'success', message });
}

// POST /v1/auth/otp/phone/send
exports.sendPhoneOtp = async (req, res, next) => {
	try {
		const { phone } = req.body || {};
		if (!phone) return res.status(400).json({ status: 'fail', message: 'phone_required' });
		const result = await otpService.sendPhoneOtp(phone);
		return res.status(200).json({ status: 'success', message: 'otp_sent', ...(result?.dev ? { devOtp: result.devOtp } : {}) });
	} catch (err) { next(err); }
};

// POST /v1/auth/otp/phone/resend
exports.resendPhoneOtp = async (req, res, next) => {
	try {
		const { phone } = req.body || {};
		if (!phone) return res.status(400).json({ status: 'fail', message: 'phone_required' });
		const result = await otpService.resendPhoneOtp(phone);
		return res.status(200).json({ status: 'success', message: 'otp_resent', ...(result?.dev ? { devOtp: result.devOtp } : {}) });
	} catch (err) { next(err); }
};

// POST /v1/auth/otp/phone/verify
exports.verifyPhoneOtp = async (req, res, next) => {
	try {
		const { phone, otp } = req.body || {};
		if (!phone || !otp) return res.status(400).json({ status: 'fail', message: 'phone_and_otp_required' });
		const ok = await otpService.verifyPhoneOtp(phone, otp);
		if (!ok) return res.status(400).json({ status: 'fail', message: 'invalid_or_expired_otp' });
		const userLike = { _id: phone, studentName: 'Student' };
		return await issueSession(res, userLike, 'login_success');
	} catch (err) { next(err); }
};

// ===== Google OAuth (production-grade) =====
// Expects: { idToken, accessToken, refreshToken? }
exports.google = async (req, res, next) => {
	try {
		let { idToken, accessToken, refreshToken, token } = req.body || {};
		if (!idToken && token) idToken = token; // backward compatibility with frontend
		if (!idToken) return res.status(400).json({ status: 'fail', message: 'idToken_required' });

		const { OAuth2Client } = require('google-auth-library');
		const clientId = process.env.GOOGLE_CLIENT_ID;
		if (!clientId) return res.status(500).json({ status: 'fail', message: 'google_client_not_configured' });
		const client = new OAuth2Client(clientId);

		const ticket = await client.verifyIdToken({ idToken, audience: clientId });
		const payload = ticket.getPayload();
		if (!payload) return res.status(401).json({ status: 'fail', message: 'invalid_google_token' });

		const userId = payload.sub;
		const name = payload.name || 'Student';

		if (accessToken) {
			const ttl = 3600;
			await require('../config/redisConfig').set(`ga:${userId}:at`, accessToken, 'EX', ttl);
		}
		if (refreshToken) {
			const ttl = 7 * 24 * 3600;
			await require('../config/redisConfig').set(`ga:${userId}:rt`, refreshToken, 'EX', ttl);
		}

		return await issueSession(res, { _id: `google:${userId}`, studentName: name }, 'login_success');
	} catch (err) {
		logger.error({ err }, 'google_id_token_login_failed');
		return res.status(500).json({ status: 'fail', message: 'google_login_failed' });
	}
};

// Social placeholders
exports.microsoft = async (req, res, next) => {
	try {
		const { token } = req.body || {};
		if (!token) return res.status(400).json({ status: 'fail', message: 'token_required' });
		return await issueSession(res, { _id: 'microsoft:' + Date.now(), studentName: 'Student' }, 'login_success');
	} catch (err) { next(err); }
};

exports.apple = async (req, res, next) => {
	try {
		const { token } = req.body || {};
		if (!token) return res.status(400).json({ status: 'fail', message: 'token_required' });
		return await issueSession(res, { _id: 'apple:' + Date.now(), studentName: 'Student' }, 'login_success');
	} catch (err) { next(err); }
};

