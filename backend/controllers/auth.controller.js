const InstituteAdmin = require("../models/InstituteAdmin");
const otpService = require("../services/otp.service");

const { sendTokens } = require("../utils/token.utils");

exports.register = async (req, res, next, options = {}) => {
  try {
    const {
      name,
      email,
      password,
      contactNumber,
      designation,
      linkedinUrl,
      type,
      googleId,
      profilePicture,
    } = req.body;

    const existingUser = await InstituteAdmin.findOne({
      $or: [{ email }],
    });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "Email or contact number already in use.",
      });
    }

    let newUser;

    if (type === "institution") {
      newUser = await InstituteAdmin.create({
        name,
        email,
        password: password || undefined,
        contactNumber: contactNumber || "",
        designation: designation || "",
        linkedinUrl: linkedinUrl || "",
        role: "INSTITUTE_ADMIN",
        isPaymentDone: false,
        isProfileCompleted: false,
        address: undefined,
        ProfilePicutre: undefined,
        googleId: googleId || undefined,
        isEmailVerified: true,
        isPhoneVerified: false,
      });

      if (!googleId) {
        await otpService.sendVerificationToken(email);
        return res.status(201).json({
          status: "success",
          message: "OTP sent to email. Please verify to complete registration.",
        });
      }
    } else if (type === "admin") {
      newUser = await InstituteAdmin.create({
        name,
        email,
        password,
        contactNumber,
        designation,
        role: "ADMIN",
        isPaymentDone: undefined,
        isProfileCompleted: undefined,
        address: undefined,
        ProfilePicutre: undefined,
        googleId: googleId || undefined,
        institution: undefined,
        isEmailVerified: false,
        isPhoneVerified: false,
        linkedinUrl: undefined,
      });
    } else if (type === "student") {
      newUser = await InstituteAdmin.create({
        name,
        email,
        password: password || undefined,
        contactNumber,
        designation: undefined,
        linkedinUrl: undefined,
        role: "STUDENT",
        isPaymentDone: undefined,
        isProfileCompleted: false,
        address: "",
        ProfilePicutre: profilePicture || "",
        googleId: googleId || undefined,
        institution: undefined,
        isEmailVerified: false,
        isPhoneVerified: false,
      });
    } else {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid user type." });
    }

    // ✅ Issue tokens
    const tokenData = await sendTokens(
      newUser,
      res,
      `${type.toUpperCase()} REGISTERED SUCCESSFULLY`,
      options
    );

    // Enqueue welcome notification per role
    try {
      const { addNotificationJob } = require('../jobs/notification.job');
      const title = 'Welcome to TooClarity';
      const description = `Hi ${newUser.name}, your account has been created.`;
      if (newUser.role === 'INSTITUTE_ADMIN') {
        await addNotificationJob({ title, description, category: 'system', recipientType: 'ADMIN', institutionAdmin: newUser._id });
      } else if (newUser.role === 'STUDENT') {
        await addNotificationJob({ title, description, category: 'system', recipientType: 'STUDENT', student: newUser._id });
      } else if (newUser.role === 'ADMIN') {
        await addNotificationJob({ title, description, category: 'system', recipientType: 'ADMIN', institutionAdmin: newUser._id });
      }
    } catch (_) {}

    // ✅ If returnTokens is true, we are in Google OAuth flow, so just return tokenData
    if (options.returnTokens) return tokenData;

    // ✅ Otherwise normal email/password registration
    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
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

exports.login = async (req, res, next, options = {}) => {
  try {
    const { email, password, googleId } = req.body;

    let user;

    if (googleId) {
      // ✅ Google OAuth login
      user = await InstituteAdmin.findOne({ email, googleId });
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message:
            "No account found for this Google user. Please register first.",
        });
      }
    } else {
      // ✅ Normal email + password login
      user = await InstituteAdmin.findOne({ email }).select("+password");
      if (!user || !(await user.comparePassword(password))) {
        return res
          .status(401)
          .json({ status: "fail", message: "Incorrect email or password." });
      }
    }

    // ✅ Common checks for Institute Admins
    if (user.role === "INSTITUTE_ADMIN" && !user.isEmailVerified && !googleId) {
      return res.status(403).json({
        status: "fail",
        message: "Account not verified. Please verify your Email first.",
      });
    }

    // ✅ Issue tokens
    return await sendTokens(user, res, "Login successful.", options);
  } catch (error) {
    next(error);
  }
};