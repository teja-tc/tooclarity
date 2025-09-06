const InstituteAdmin = require("../models/InstituteAdmin");
const otpService = require("../services/otp.service");

const JwtUtil = require("../utils/jwt.util");
const CookieUtil = require("../utils/cookie.util");
const RedisUtil = require("../utils/redis.util");

// helper to send tokens
const sendTokens = async (user, res, message) => {

  const userId = user._id;
  const username = user.name;

  // 1. generate tokens
  const accessToken = JwtUtil.generateToken(userId, username, "access");
  const refreshToken = JwtUtil.generateToken(userId, username, "refresh");

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
    const { name, email, password, contactNumber, designation, linkedinUrl } =
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

    const newInstituteAdmin = await InstituteAdmin.create({
      name,
      email,
      password,
      contactNumber,
      designation,
      linkedinUrl,
    });

    // send OTP for phone verification
    await otpService.sendVerificationToken(email);

    return res.status(201).json({
      status: "success",
      message:
        "User registered successfully. An OTP has been sent to your contact number for verification.",
    });
  } catch (error) {
    next(error);
  }
};

// exports.verifyPhoneOtp = async (req, res, next) => {
//   try {
//     const { contactNumber, otp } = req.body;
//     const isOtpValid = await otpService.checkVerificationToken(
//       contactNumber,
//       otp
//     );
//     if (!isOtpValid) {
//       return res
//         .status(400)
//         .json({ status: "fail", message: "Incorrect or expired OTP." });
//     }

//     const user = await InstituteAdmin.findOne({ contactNumber });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "User not found" });
//     }
//     if (user.isPhoneVerified) {
//       return res
//         .status(400)
//         .json({ status: "fail", message: "Phone number is already verified." });
//     }

//     user.isPhoneVerified = true;
//     await user.save();

//     // issue tokens
//     return await sendTokens(
//       user._id,
//       res,
//       "Phone number verified successfully."
//     );
//   } catch (error) {
//     next(error);
//   }
// };

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
    const { email, password } = req.body;

    const user = await InstituteAdmin.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Incorrect email or password." });
    }

    if (!user.isEmailVerified) {
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
