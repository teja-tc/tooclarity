const InstituteAdmin = require("../models/InstituteAdmin");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await InstituteAdmin.findById(req.userId).select("name email contactNumber");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User no longer exists.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

