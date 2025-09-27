const { verifyToken, generateToken, decodeToken, refreshAccessTokenIfNeeded, refreshRefreshTokenIfNeeded } = require("../utils/jwt.util");
const CookieUtil = require("../utils/cookie.util");
const {
  getRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
} = require("../utils/redis.util");
const User = require("../models/InstituteAdmin"); // 👈 import your User model
const { decode } = require("jsonwebtoken");

// Enhanced Google token refresh with proper error handling
async function refreshGoogleAccessToken(googleUserId) {
  try {
    const OAuthToken = require('../models/OAuthToken');
    const Secure = require('../utils/secure.util');
    const redis = require('../config/redisConfig');
    
    // Get active refresh token from MongoDB
    const tokenDoc = await OAuthToken.findOne({ 
      provider: 'google', 
      providerUserId: googleUserId,
      isActive: true,
      expiresAt: { $gt: new Date() } // Not expired
    });
    
    if (!tokenDoc) {
      console.log('❌ No valid Google refresh token found');
      return null;
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
    
    // Store new access token in Redis (short-lived)
    await redis.set(`ga:${googleUserId}:at`, newAccessToken, 'PX', expiryMs);
    
    // Update refresh token in MongoDB if new one provided
    if (newRefreshToken) {
      const encrypted = Secure.encrypt(newRefreshToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      // Store old token in previousTokens for rotation
      const previousTokens = [...(tokenDoc.previousTokens || [])];
      previousTokens.push({
        encryptedToken: tokenDoc.encryptedRefreshToken,
        expiresAt: tokenDoc.expiresAt,
        revokedAt: new Date()
      });
      
      // Keep only last 3 previous tokens
      if (previousTokens.length > 3) {
        previousTokens.splice(0, previousTokens.length - 3);
      }
      
      await OAuthToken.findOneAndUpdate(
        { provider: 'google', providerUserId: googleUserId },
        { 
          encryptedRefreshToken: encrypted,
          expiresAt,
          lastUsedAt: new Date(),
          previousTokens
        },
        { upsert: true, new: true }
      );
    } else {
      // Just update last used time
      await OAuthToken.findOneAndUpdate(
        { provider: 'google', providerUserId: googleUserId },
        { lastUsedAt: new Date() }
      );
    }
    
    console.log('✅ Google access token refreshed successfully');
    return newAccessToken;
  } catch (error) {
    console.error('❌ Google token refresh failed:', error);
    
    // If refresh token is invalid, mark it as inactive
    if (error.message.includes('invalid_grant') || error.message.includes('invalid_request')) {
      try {
        await OAuthToken.findOneAndUpdate(
          { provider: 'google', providerUserId: googleUserId },
          { isActive: false }
        );
        console.log('🔒 Invalid refresh token marked as inactive');
      } catch (updateError) {
        console.error('❌ Failed to mark token as inactive:', updateError);
      }
    }
    
    throw error;
  }
}

async function refreshGoogleProfileSnapshot(googleUserId, accessToken) {
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
    const fullName = people?.names?.[0]?.displayName || `${(givenName ?? '')} ${(familyName ?? '')}`.trim() || null;
    const profileUrl = people?.urls?.find(u => u?.type === 'profile')?.value || null;
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
      profileUrl,
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
    
    console.log('✅ Google profile snapshot refreshed successfully');
    return profileSnapshot;
  } catch (error) {
    console.error('❌ Profile snapshot refresh failed:', error);
    throw error;
  }
}

async function handleGoogleTokenRefresh(userId) {
  try {
    // Only handle Google OAuth users
    if (!userId || !userId.startsWith('google:')) {
      return;
    }
    
    const googleUserId = userId.replace('google:', '');
    const redis = require('../config/redisConfig');
    
    // Check if access token exists and is valid
    const accessToken = await redis.get(`ga:${googleUserId}:at`);
    
    if (!accessToken) {
      console.log(' No Google access token found, attempting refresh...');
      const newAccessToken = await refreshGoogleAccessToken(googleUserId);
      
      // Refresh profile snapshot with new token
      await refreshGoogleProfileSnapshot(googleUserId, newAccessToken);
    } else {
      // Check if profile snapshot needs refresh (older than 1 day)
      const profileSnapshot = await redis.get(`sp:${googleUserId}`);
      if (!profileSnapshot) {
        console.log('🔄 No profile snapshot found, refreshing...');
        await refreshGoogleProfileSnapshot(googleUserId, accessToken);
      } else {
        try {
          const profile = JSON.parse(profileSnapshot);
          const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
          if (profile.updatedAt < oneDayAgo) {
            console.log('🔄 Profile snapshot is stale, refreshing...');
            await refreshGoogleProfileSnapshot(googleUserId, accessToken);
          }
        } catch (parseError) {
          console.log('🔄 Invalid profile snapshot, refreshing...');
          await refreshGoogleProfileSnapshot(googleUserId, accessToken);
        }
      }
    }
  } catch (error) {
    console.error('❌ Google token refresh error:', error);
    // Don't throw - this shouldn't block the request
  }
}

const globalAuthMiddleware = async (req, res, next) => {
  try {
    console.log("➡️ Incoming request:", req.method, req.path);

    const publicPaths = ["/login", "/register", "/otp", "/verify-email","/payment/verify"];
    if (publicPaths.includes(req.path)) {
      console.log("✅ Public path, skipping auth");
      return next();
    }

    // 1️⃣ Extract cookies
    const accessToken = CookieUtil.getCookie(req, "access_token");
    const usernameCookie = CookieUtil.getCookie(req, "username");
    
    console.log("🔹 Access token from cookie:", accessToken);
    console.log(" Username cookie:", usernameCookie);

    let userId;
    let refreshToken;

    if (accessToken) {
      try {
        // normal verify
        const decoded = verifyToken(accessToken);
        console.log("✅ Access token valid:", decoded);
        refreshAccessTokenIfNeeded(req, res);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        
        // Handle Google token refresh for Google OAuth users
        await handleGoogleTokenRefresh(decoded.id);
        
        return next(); // valid access token
      } catch (err) {
        if (err.name !== "TokenExpiredError") {
          console.log("❌ Invalid access token:", err.message);
          return res.status(401).json({ message: "Invalid access token" });
        }
        console.log("⚠️ Access token expired, will try refresh flow");

        // decode expired access token for userId
        try {
          const decodedAccess = decodeToken(accessToken);
          userId = decodedAccess?.id;
          console.log("🔹 Decoded expired access token:", decodedAccess);
        } catch (decodeErr) {
          console.log("❌ Could not decode expired access token:", decodeErr.message);
        }
      }
    } else {
      console.log("⚠️ No access token found in cookie, fallback to username cookie");
      if (usernameCookie) {
        try {
          const user = await User.findOne({ name: usernameCookie }).select("_id role");
          if (user) {
            userId = user._id.toString();
            console.log("✅ Found userId from username cookie:", userId);
            // Short-circuit for dev usage when username cookie is present
            req.userId = userId;
            req.userRole = user.role;
            await refreshRefreshTokenIfNeeded(userId, usernameCookie);
            
            // Handle Google token refresh for Google OAuth users
            await handleGoogleTokenRefresh(userId);
            
            return next();
          } else {
            console.log("❌ No user found for username cookie");
          }
        } catch (dbErr) {
          console.error("❌ DB error while fetching userId from username:", dbErr);
        }
      }
    }

    if (!userId) {
      console.log("❌ No userId found (no access token & no valid username cookie)");
      return res.status(401).json({ message: "Session expired, please login again" });
    }

    // 2️⃣ Get refresh token from Redis
    refreshToken = await getRefreshToken(userId);
    console.log(" Refresh token from Redis:", refreshToken);

    if (!refreshToken) {
      console.log("❌ No refresh token found, session expired");
      return res.status(401).json({ message: "Session expired, please login again" });
    }

    // 3️⃣ Verify refresh token
    let decodedRefresh;
    try {
      decodedRefresh = verifyToken(refreshToken);
      userId = decodedRefresh.id;
      req.userRole = decodedRefresh.role;
      req.userId = userId;
      req.userRole = decodedRefresh.role;
      console.log("userId set to req:", userId);
      await refreshRefreshTokenIfNeeded(userId, usernameCookie, refreshToken);
      console.log("✅ Refresh token valid:", decodedRefresh);
    } catch (err) {
      console.log("❌ Refresh token invalid or expired:", err.message);
      await deleteRefreshToken(userId);
      return res.status(401).json({ message: "Refresh expired, please login again" });
    }

    // 4️⃣ Issue new tokens
    const newAccessToken = generateToken(userId, usernameCookie ,"access", decodedRefresh.role);
    CookieUtil.setCookie(res, "access_token", newAccessToken);
    console.log("🔹 New access token issued");

    await refreshRefreshTokenIfNeeded(userId, usernameCookie, refreshToken);

    req.userId = userId;
    req.userRole = decodedRefresh.role;
    
    // Handle Google token refresh for Google OAuth users
    await handleGoogleTokenRefresh(userId);
    
    return next();
  } catch (err) {
    console.error("🔥 Auth Middleware Error:", err);
    return res.status(500).json({ message: "Internal auth error" });
  }
};

module.exports = globalAuthMiddleware;
