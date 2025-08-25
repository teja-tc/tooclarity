const { sign, verify, decode } = require("jsonwebtoken");

/**
 * Generate JWT Token (access or refresh)
 * @param {string} userId - User ID to embed in the token
 * @param {"access"|"refresh"} type - Type of token
 * @returns {string} JWT token
 */
const generateToken = (userId, type = "access") => {
  let expiresIn;

  if (type === "access") {
    expiresIn = process.env.ACCESS_EXPIRES_IN || "15m";
  } else if (type === "refresh") {
    expiresIn = process.env.REFRESH_EXPIRES_IN || "7d";
  } else {
    throw new error("Invalid token type. Must be 'access' or 'refresh'.");
  }

  return sign({ id: userId, type }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

const verifyToken = (token) => {
  return verify(token, process.env.JWT_SECRET);
};

const extractToken = (req) =>{
    if(req.cookies && req.cookies.jwt){
        return req.cookie.jwt;
    }
    return null;
}

/**
 * Extract userId from token
 * @param {string} token - JWT token
 * @returns {string|null} userId
 */
const extractUserId = (token) => {
    try{
        const decoded = verifyToken(token);
        return decoded.id || null;
    }
    catch(err){
        return null;
    }
};

/**
 * Decode JWT token without verifying signature
 * (useful for reading expiry or payload safely)
 * @param {string} token
 * @returns {object|null} Decoded payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    return decode(token);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
  extractUserId,
  decodeToken,
};
