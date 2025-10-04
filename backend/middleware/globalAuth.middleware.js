const { verifyToken, generateToken, decodeToken, refreshAccessTokenIfNeeded, refreshRefreshTokenIfNeeded } = require("../utils/jwt.util");
const CookieUtil = require("../utils/cookie.util");
const {
  getRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
} = require("../utils/redis.util");
const User = require("../models/InstituteAdmin"); // 👈 import your User model
const { decode } = require("jsonwebtoken");

const globalAuthMiddleware = async (req, res, next) => {
  try {
    console.log("➡️ Incoming request:", req.method, req.path);

    const publicPaths = ["/login", "/register", "/otp", "/verify-email","/payment/verify", "/forgot-password", "/reset-password" ];
    if (publicPaths.includes(req.path)) {
      console.log("✅ Public path, skipping auth");
      return next();
    }

    // 1️⃣ Extract cookies
    const accessToken = CookieUtil.getCookie(req, "access_token");
    const usernameCookie = CookieUtil.getCookie(req, "username");
    // const usernameCookie = rawUsername ? decodeURIComponent(rawUsername) : null;
    
    console.log("🔹 Access token from cookie:", accessToken);
    console.log("🔹 Username cookie:", usernameCookie);

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
            req.userRole = decodedAccess.role;
            await refreshRefreshTokenIfNeeded(userId, usernameCookie, );
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
    console.log("🔹 Refresh token from Redis:", refreshToken);

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
    return next();
  } catch (err) {
    console.error("🔥 Auth Middleware Error:", err);
    return res.status(500).json({ message: "Internal auth error" });
  }
};

module.exports = globalAuthMiddleware;


// backend/middleware/globalAuth.middleware.js

// const { verifyToken, decodeToken } = require("../utils/jwt.util");
// const CookieUtil = require("../utils/cookie.util");
// const { getRefreshToken, deleteRefreshToken } = require("../utils/redis.util");
// const User = require("../models/InstituteAdmin");
// const AppError = require('../utils/appError'); // It's better to use your AppError class

// const globalAuthMiddleware = async (req, res, next) => {
//   try {
//     // --- NO CHANGE HERE ---
//     const publicPaths = ["/login", "/register", "/otp", "/verify-email", "/payment/verify", "/forgot-password", "/verify-password-otp", "/reset-password", "/refresh-token"];
    
//     // A more robust way to check public paths
//     if (publicPaths.some(path => req.path.includes(path))) {
//       return next();
//     }

//     // 1️⃣ Extract access token from the cookie
//     const accessToken = req.cookies.access_token; // Switched to req.cookies for consistency with industry practice

//     if (accessToken) {
//       try {
//         // --- MODIFIED: Added password change check ---
//         const decoded = verifyToken(accessToken);
        
//         // Fetch user from DB to check for password changes
//         const currentUser = await User.findById(decoded.id).select('+passwordChangedAt');

//         if (!currentUser) {
//             return next(new AppError('The user belonging to this token no longer exists.', 401));
//         }

//         // Check if password was changed after the token was issued
//         if (currentUser.passwordChangedAt) {
//             const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
//             if (decoded.iat < changedTimestamp) {
//                 // Invalidate tokens and force re-login
//                 res.cookie('access_token', 'loggedout', { httpOnly: true, expires: new Date(Date.now() + 10 * 1000) });
//                 res.cookie('refresh_token', 'loggedout', { httpOnly: true, expires: new Date(Date.now() + 10 * 1000) });
//                 return next(new AppError('User recently changed password! Please log in again.', 401));
//             }
//         }
        
//         req.user = currentUser; // Attach user to request
//         req.userId = currentUser._id;
//         req.userRole = currentUser.role;

//         return next(); // Access token is valid and password has not been changed

//       } catch (err) {
//         if (err.name !== "TokenExpiredError") {
//           console.log("❌ Invalid access token:", err.message);
//           return res.status(401).json({ message: "Invalid access token" });
//         }
//         // If token is expired, we will proceed to the refresh token logic below.
//       }
//     }

//     // --- REFRESH TOKEN LOGIC ---
//     // This part of the logic will now execute only if the access token is expired or missing.

//     const refreshToken = req.cookies.refresh_token;

//     if (!refreshToken) {
//       return res.status(401).json({ message: "Session expired, please login again" });
//     }

//     // 2️⃣ Verify refresh token
//     let decodedRefresh;
//     try {
//       decodedRefresh = verifyToken(refreshToken, 'refresh'); // Assuming you have a separate secret for refresh tokens

//       // Check if refresh token is still valid in Redis
//       const redisToken = await getRefreshToken(decodedRefresh.id);
//       if (!redisToken || redisToken !== refreshToken) {
//           await deleteRefreshToken(decodedRefresh.id); // Clean up stale token
//           return res.status(401).json({ message: "Session invalid, please login again" });
//       }

//     } catch (err) {
//       // If refresh token itself is invalid/expired, delete from Redis and force re-login
//       if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
//          // Attempt to decode to get user ID for cleanup
//          const decoded = decodeToken(refreshToken);
//          if (decoded && decoded.id) {
//             await deleteRefreshToken(decoded.id);
//          }
//       }
//       return res.status(401).json({ message: "Refresh token expired, please login again" });
//     }

//     // 3️⃣ Issue new tokens
//     const user = await User.findById(decodedRefresh.id);
//     if (!user) {
//         return res.status(401).json({ message: "User not found." });
//     }

//     const newAccessToken = require('../utils/jwt.util').generateToken({ id: user._id, role: user.role }, 'access');
//     CookieUtil.setCookie(res, "access_token", newAccessToken);
    
//     req.user = user;
//     req.userId = user._id;
//     req.userRole = user.role;
    
//     return next();

//   } catch (err) {
//     console.error("🔥 Auth Middleware Error:", err);
//     return res.status(500).json({ message: "Internal auth error" });
//   }
// };

// module.exports = globalAuthMiddleware;