const { verifyToken, generateToken } = require("../utils/jwt.util");
const CookieUtil = require("../utils/cookie.util");
const {
  getRefreshToken,
  setRefreshToken,
  deleteRefreshToken,
} = require("../utils/redis.util");

const globalAuthMiddleware = async (req, res, next) => {
  try {
    const publicPaths = ["/login", "/register", "/otp", "/verify-email"];

    if (publicPaths.includes(req.path)) {
      return next();
    }

    // 1. Extract access token from cookies
    const accessToken = CookieUtil.getCookie(req, "access_token");

    if (accessToken) {
      try {
        const decoded = verifyToken(accessToken);
        req.userId = decoded.id;
        return next();
      } catch (err) {
        if (err.name !== "TokenExpiredError") {
          return res.status(401).json({ message: "Invalid access token" });
        }
      }
    }

    // 2. Fallback to refresh token from Redis
    const refreshToken = await getRefreshToken(req.userId || null);

    if (!refreshToken) {
      CookieUtil.clearCookie(res, "access_token");
      return res.status(401).json({ message: "Session expired, please login again" });
    }

    let decodedRefresh;
    try {
      decodedRefresh = verifyToken(refreshToken);
    } catch (err) {
      await deleteRefreshToken(req.userId || "");
      CookieUtil.clearCookie(res, "access_token");
      return res.status(401).json({ message: "Refresh expired, please login again" });
    }

    const userId = decodedRefresh.id;

    // 3. Issue new access token
    const newAccessToken = generateToken(userId, "access");
    CookieUtil.setCookie(res, "access_token", newAccessToken);

    // 4. Rotate refresh token
    const newRefreshToken = generateToken(userId, "refresh");
    await setRefreshToken(userId, newRefreshToken);

    req.userId = userId;
    return next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(500).json({ message: "Internal auth error" });
  }
};

module.exports = globalAuthMiddleware;
