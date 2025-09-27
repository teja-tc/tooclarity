const InstituteAdmin = require("../models/InstituteAdmin");
const otpService = require("../services/otp.service");

const JwtUtil = require("../utils/jwt.util");
const CookieUtil = require("../utils/cookie.util");
const RedisUtil = require("../utils/redis.util");

const { OAuth2Client } = require('google-auth-library');
const Secure = require('../utils/secure.util');
const OAuthToken = require('../models/OAuthToken');
const logger = require('../config/logger');

// helper to send tokens
const sendTokens = async (user, res, message) => {

  const userId = user._id;
  const username = user.name;
  const role = user.role;

  // 1. generate tokens
  const accessToken = JwtUtil.generateToken(userId, username, "access", role);
  const refreshToken = JwtUtil.generateToken(userId, username, "refresh", role);

  // 2. decode refresh to calculate expiry
  const decodedRefresh = JwtUtil.decodeToken(refreshToken);
  const ttlSeconds = decodedRefresh.exp - Math.floor(Date.now() / 1000);

  // 3. save refresh token in redis
  await RedisUtil.saveRefreshToken(userId, refreshToken, ttlSeconds);

  // 4. send access token in cookie (expiry handled by CookieUtil.updateCookie)
  CookieUtil.setCookie(res, "access_token", accessToken);
  CookieUtil.setCookie(res, "username", username, { maxAge: 7 * 24 * 60 * 60 * 1000 });

  // 5. respond
  return res.status(200).json({
    status: "success",
    message,
  });
};


exports.register = async (req, res, next) => {
  try {
    const { name, email, password, contactNumber, designation, linkedinUrl, type } =
      req.body;

    const existingUser = await InstituteAdmin.findOne({
      $or: [{ email }, { contactNumber }],
    });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "Email or contact number already in use.",
      });
    }

    let newUser;

    if (type === "institution") {
      // Institution registration
      newUser = await InstituteAdmin.create({
        name,
        email,
        password,
        contactNumber,
        designation,
        linkedinUrl,
        role: "INSTITUTE_ADMIN",
        isPaymentDone: false,
        isProfileCompleted: false,
      });

      // Send OTP for email verification
      await otpService.sendVerificationToken(email);

      return res.status(201).json({
        status: "success",
        message:
          "User registered successfully. An OTP has been sent to your email for verification.",
      });
    } else if (type === "admin") {
      // Admin registration
      newUser = await InstituteAdmin.create({
        name,
        email,
        password,
        contactNumber,
        designation,
        role: "ADMIN",
      });

      return await sendTokens(newUser, res, "ADMIN REGISTERED SUCCESSFULLY");
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user type.",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // 1. Validate OTP from Redis
    const isOtpValid = await otpService.checkVerificationToken(email, otp);
    if (!isOtpValid) {
      return res
        .status(400)
        .json({ status: "fail", message: "Incorrect or expired OTP." });
    }

    // 2. Find user by email
    const user = await InstituteAdmin.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found." });
    }

    // 3. Check if already verified
    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email is already verified." });
    }

    // 4. Mark email as verified
    user.isEmailVerified = true;
    await user.save();

    // 5. Issue tokens (login user immediately after verification)
    return await sendTokens(user, res, "Email verified successfully.");
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password} = req.body;

    const user = await InstituteAdmin.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Incorrect email or password." });
    }

    if (user.role == "INSTITUTE_ADMIN" && !user.isEmailVerified) {
      return res.status(403).json({
        status: "fail",
        message: "Account not verified. Please verify your Email first.",
      });
    }

    return await sendTokens(user, res, "Login successful.");
  } catch (error) {
    next(error);
  }
};

// Helpers reused
function getServerBase(req) {
  const explicit = process.env.SERVER_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http');
  const host = req.get('host');
  return `${proto}://${host}`;
}
function resolveLoginRole(req) {
  // priority: ?role= → state → default 'STUDENT'
  const r = (req.query.role || req.query.state || '').toString().toUpperCase();
  if (r === 'STUDENT' || r === 'INSTITUTE_ADMIN' || r === 'ADMIN') return r;
  if (r === 'INSTITUTION' || r === 'INSTITUTIONADMIN') return 'INSTITUTE_ADMIN';
  if (r === 'STUDENT' || r === 'INSTITUTE_ADMIN' || r === 'ADMIN') return r;
  if ((req.query.state || '').toString().toLowerCase() === 'student') return 'STUDENT';
  if ((req.query.state || '').toString().toLowerCase() === 'admin') return 'ADMIN';
  if ((req.query.state || '').toString().toLowerCase() === 'institutionadmin') return 'INSTITUTE_ADMIN';
  return 'STUDENT';
}
async function setSessionCookiesGeneric(res, userId, username, role) {
  const JwtUtil = require('../utils/jwt.util');
  const CookieUtil = require('../utils/cookie.util');
  const RedisUtil = require('../utils/redis.util');
  const accessToken = JwtUtil.generateToken(userId, username, 'access', role);
  const refreshToken = JwtUtil.generateToken(userId, username, 'refresh', role);
  const decodedRefresh = JwtUtil.decodeToken(refreshToken);
  const ttlSeconds = decodedRefresh.exp - Math.floor(Date.now() / 1000);
  await RedisUtil.saveRefreshToken(userId, refreshToken, ttlSeconds);
  CookieUtil.setCookie(res, 'access_token', accessToken);
  CookieUtil.setCookie(res, 'username', username, { maxAge: 7 * 24 * 60 * 60 * 1000 });
}

// Add these helper functions at the top
async function refreshGoogleAccessToken(googleUserId) {
  try {
    const OAuthToken = require('../models/OAuthToken');
    const Secure = require('../utils/secure.util');
    const redis = require('../config/redisConfig');
    
    // Get encrypted refresh token from MongoDB
    const tokenDoc = await OAuthToken.findOne({ 
      provider: 'google', 
      providerUserId: googleUserId 
    });
    
    if (!tokenDoc) {
      throw new Error('No refresh token found');
    }
    
    // Decrypt refresh token
    const refreshToken = Secure.decrypt(tokenDoc.encryptedRefreshToken);
    
    // Exchange refresh token for new access token
    const { OAuth2Client } = require('google-auth-library');
    const oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    });
    
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    const newAccessToken = credentials.access_token;
    const newRefreshToken = credentials.refresh_token;
    const expiryMs = credentials.expiry_date ? 
      Math.max(60000, credentials.expiry_date - Date.now()) : 3600000;
    
    // Store new access token in Redis
    await redis.set(`ga:${googleUserId}:at`, newAccessToken, 'PX', expiryMs);
    
    // Update refresh token if provided
    if (newRefreshToken) {
      const encrypted = Secure.encrypt(newRefreshToken);
      await OAuthToken.findOneAndUpdate(
        { provider: 'google', providerUserId: googleUserId },
        { 
          encryptedRefreshToken: encrypted,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        },
        { upsert: true, new: true }
      );
    }
    
    return newAccessToken;
  } catch (error) {
    console.error('Google token refresh failed:', error);
    throw error;
  }
}

async function refreshProfileSnapshot(googleUserId, accessToken) {
  try {
    const redis = require('../config/redisConfig');
    
    // Fetch fresh data from Google People API
    const peopleRes = await fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,genders,birthdays,phoneNumbers,organizations,addresses,locales,urls', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!peopleRes.ok) {
      throw new Error(`People API failed: ${peopleRes.status}`);
    }
    
    const people = await peopleRes.json();
    
    // Extract and normalize profile data
    const primaryEmail = people?.emailAddresses?.[0]?.value || null;
    const photoUrl = people?.photos?.[0]?.url || null;
    const givenName = people?.names?.[0]?.givenName || null;
    const familyName = people?.names?.[0]?.familyName || null;
    const fullName = people?.names?.[0]?.displayName || `${givenName ?? ''} ${familyName ?? ''}`.trim() || null;
    const birthday = people?.birthdays?.[0]?.text || people?.birthdays?.[0]?.date || null;
    const gender = people?.genders?.[0]?.value || null;
    const phone = people?.phoneNumbers?.[0]?.value || null;
    const organization = people?.organizations?.[0]?.name || null;
    const address = people?.addresses?.[0]?.formattedValue || null;
    
    const profileSnapshot = {
      provider: 'google',
      providerUserId: googleUserId,
      name: fullName,
      email: primaryEmail,
      emailVerified: true, // Google emails are verified
      picture: photoUrl,
      givenName,
      familyName,
      birthday,
      gender,
      phone,
      organization,
      address,
      updatedAt: Date.now(),
    };
    
    // Store in Redis with 7-day TTL
    await redis.set(
      `sp:${googleUserId}`,
      JSON.stringify(profileSnapshot),
      'PX',
      7 * 24 * 60 * 60 * 1000
    );
    
    return profileSnapshot;
  } catch (error) {
    console.error('Profile snapshot refresh failed:', error);
    throw error;
  }
}

// Start endpoint (shared)
exports.googleStart = async (req, res, next) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const serverBase = getServerBase(req);
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${serverBase}/api/v1/auth/google/callback`;
    if (!clientId) {
      if (req.query.mode === 'json') return res.status(500).json({ success: false, error: 'google_client_not_configured' });
      return res.status(500).json({ status: 'fail', message: 'google_client_not_configured' });
    }
    const scope = [
      'openid','email','profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/user.birthday.read',
      'https://www.googleapis.com/auth/user.gender.read',
      'https://www.googleapis.com/auth/user.phonenumbers.read',
      'https://www.googleapis.com/auth/user.addresses.read',
      'https://www.googleapis.com/auth/user.emails.read',
      'https://www.googleapis.com/auth/user.organization.read'
    ].join(' ');
    // propagate role via state param
    const state = (req.query.role || req.query.state || 'student').toString();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      access_type: 'offline',
      include_granted_scopes: 'true',
      prompt: 'consent',
      state
    }).toString();
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    if (req.query.mode === 'json') return res.json({ success: true, url });
    return res.redirect(url);
  } catch (err) {
    logger.error({ err }, 'google_start_failed');
    if (req.query.mode === 'json') return res.status(500).json({ success: false, error: 'google_start_failed' });
    const base = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
    return res.redirect(`${base}/?auth_error=google_start_failed`);
  }
};

// Callback endpoint (shared)
exports.googleCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code) {
      const base = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
      return res.redirect(`${base}/?auth_error=missing_code&auth_detail=no_code_param`);
    }
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const serverBase = getServerBase(req);
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${serverBase}/api/v1/auth/google/callback`;
    if (!clientId || !clientSecret) {
      const base = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
      return res.redirect(`${base}/?auth_error=google_misconfigured&auth_detail=missing_client_or_secret`);
    }

    const oauth2Client = new OAuth2Client({ clientId, clientSecret, redirectUri });

    // 1) Exchange code
    let tokens;
    try {
      const r = await oauth2Client.getToken({ code, redirect_uri: redirectUri });
      tokens = r.tokens || {};
    } catch (err) {
      logger.error({ err }, 'google_token_exchange_failed');
      const base = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
      return res.redirect(`${base}/?auth_error=token_exchange_failed&auth_detail=${encodeURIComponent(err?.message || 'exchange_failed')}`);
    }

    const idToken = tokens.id_token;
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    const expiryMs = typeof tokens.expiry_date === 'number' ? Math.max(60000, tokens.expiry_date - Date.now()) : 3600000;

    // 2) Verify ID token
    let payload;
    try {
      const ticket = await oauth2Client.verifyIdToken({ idToken, audience: clientId });
      payload = ticket.getPayload();
      if (!payload) throw new Error('no_payload');
    } catch (err) {
      logger.error({ err }, 'google_id_token_verify_failed');
      const base = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
      return res.redirect(`${base}/?auth_error=invalid_id_token&auth_detail=${encodeURIComponent(err?.message || 'verify_failed')}`);
    }

    const googleUserId = payload.sub;
    const name = payload.name || 'User';
    const resolvedRole = resolveLoginRole(req);

    // 3) People API fetch
    let people = null;
    try {
      if (accessToken) {
        const peopleRes = await fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,genders,birthdays,phoneNumbers,organizations,addresses,locales,urls', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (peopleRes.ok) people = await peopleRes.json();
      }
    } catch (err) {
      logger.warn({ err }, 'google_people_api_fetch_failed');
    }

    // 4) Persist tokens
    try {
      if (accessToken) {
        await require('../config/redisConfig').set(`ga:${googleUserId}:at`, accessToken, 'PX', expiryMs);
      }
      if (refreshToken) {
        const encrypted = Secure.encrypt(refreshToken);
        await OAuthToken.findOneAndUpdate(
          { provider: 'google', providerUserId: googleUserId },
          { 
            encryptedRefreshToken: encrypted,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          },
          { upsert: true, new: true }
        );
      }

      // 5) Snapshot for profile UI
      try {
        const primaryEmail = payload.email || people?.emailAddresses?.[0]?.value || null;
        const photoUrl = payload.picture || people?.photos?.[0]?.url || null;
        const givenName = payload.given_name || people?.names?.[0]?.givenName || null;
        const familyName = payload.family_name || people?.names?.[0]?.familyName || null;
        const fullName = payload.name || people?.names?.[0]?.displayName || `${givenName ?? ''} ${familyName ?? ''}`.trim() || null;
        const locale = payload.locale || people?.locales?.[0]?.value || null;
        const birthday = people?.birthdays?.[0]?.text || people?.birthdays?.[0]?.date || null;
        const gender = people?.genders?.[0]?.value || null;
        const phone = people?.phoneNumbers?.[0]?.value || null;
        const organization = people?.organizations?.[0]?.name || null;
        const address = people?.addresses?.[0]?.formattedValue || null;

        const profileSnapshot = {
          provider: 'google',
          providerUserId: googleUserId,
          name: fullName,
          email: primaryEmail,
          emailVerified: payload.email_verified ?? null,
          picture: photoUrl,
          givenName,
          familyName,
          locale,
          hd: payload.hd || null,
          birthday,
          gender,
          phone,
          organization,
          address,
          updatedAt: Date.now(),
        };
        await require('../config/redisConfig').set(
          `sp:${googleUserId}`,
          JSON.stringify(profileSnapshot),
          'PX',
          7 * 24 * 60 * 60 * 1000
        );
      } catch (e) {
        logger.warn({ e }, 'google_profile_snapshot_persist_failed');
      }
    } catch (err) {
      logger.error({ err }, 'google_token_persist_failed');
    }

    // 6) Issue app cookies and redirect by role
    await setSessionCookiesGeneric(res, `google:${googleUserId}`, name, resolvedRole);
    const base = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
    const defaultRedirect = resolvedRole === 'STUDENT'
      ? `${base}/student/profile`
      : `${base}/dashboard`;
    const finalRedirect = process.env.GOOGLE_POST_LOGIN_REDIRECT || defaultRedirect;
    return res.redirect(finalRedirect);
  } catch (err) {
    logger.error({ err }, 'google_callback_unhandled');
    const base = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
    return res.redirect(`${base}/?auth_error=google_callback_failed&auth_detail=${encodeURIComponent(err?.message || 'unhandled')}`);
  }
};

// Add new endpoint for token refresh
exports.refreshGoogleTokens = async (req, res, next) => {
  try {
    const userId = req.userId; // e.g., google:123
    if (!userId || !userId.startsWith('google:')) {
      return res.status(400).json({ success: false, message: 'Invalid user for Google token refresh' });
    }
    
    const googleUserId = userId.replace('google:', '');
    
    // Refresh access token
    const newAccessToken = await refreshGoogleAccessToken(googleUserId);
    
    // Refresh profile snapshot
    const profileSnapshot = await refreshProfileSnapshot(googleUserId, newAccessToken);
    
    res.json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessTokenRefreshed: true,
        profileUpdated: true,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error({ error }, 'google_token_refresh_failed');
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message
    });
  }
};
