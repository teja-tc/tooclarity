const redis = require("../config/redisConfig");

class RedisUtil {
  /**
   * Save refresh token in Redis
   * @param {string} userId
   * @param {string} token
   * @param {number} ttlSeconds - expiration in seconds
   */
  static async saveRefreshToken(userId, token, ttlSeconds) {
    const key = `refresh:${userId}`;
    await redis.set(key, token, "EX", ttlSeconds);
  }

  /**
   * Get refresh token from Redis
   * @param {string} userId
   * @returns {string|null}
   */
  static async getRefreshToken(userId) {
    const key = `refresh:${userId}`;
    return await redis.get(key);
  }

  /**
   * Delete refresh token (logout / revoke)
   * @param {string} userId
   */
  static async deleteRefreshToken(userId) {
    const key = `refresh:${userId}`;
    await redis.del(key);
  }

  /**
   * Validate refresh token
   * @param {string} userId
   * @param {string} token
   * @returns {boolean}
   */
  static async validateRefreshToken(userId, token) {
    const stored = this.getRefreshToken(userId);
    return stored === token;
  }

  // ---------- OTP Methods ----------

  /**
   * Save OTP in Redis with expiry (15 minutes default)
   * @param {string} email
   * @param {string} otp
   * @param {number} ttlSeconds
   */
  static async saveOtp(email, otp, ttlSeconds = 900) {
    const key = `otp:${email}`;
    await redis.set(key, otp, "EX", ttlSeconds);
  }

  /**
   * Get OTP from Redis
   * @param {string} email
   * @returns {string|null}
   */
  static async getOtp(email) {
    const key = `otp:${email}`;
    return await redis.get(key);
  }

  /**
   * Delete OTP from Redis after verification
   * @param {string} email
   */
  static async deleteOtp(email) {
    const key = `otp:${email}`;
    await redis.del(key);
  }

  /**
   * Validate OTP
   * @param {string} email
   * @param {string} otp
   * @returns {boolean}
   */
  static async validateOtp(email, otp) {
    const stored = await this.getOtp(email);
    if (stored && stored === otp) {
      await this.deleteOtp(email); // prevent reuse
      return true;
    }
    return false;
  }
}

module.exports = RedisUtil;
