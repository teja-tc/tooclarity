// const mongoose = require("mongoose");
// const { Institution } = require("../models/Institution");
// const asyncHandler = require("express-async-handler");
// const logger = require("../config/logger");
// const InstituteAdmin = require("../models/InstituteAdmin");

// /**
//  * @desc    CREATE L1 Institution (General Info)
//  * @route   POST /api/v1/institutions
//  * @access  Private
//  */

// exports.createL1Institution = asyncHandler(async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     console.log("🚀 Starting L1 Institution creation flow...");
//     console.log("➡️  Incoming Request Body:", req.body);
//     console.log("➡️  Authenticated User ID:", req.userId);

//     // 1. Find user first
//     console.log("🔍 Finding user in InstituteAdmin...");
//     const user = await InstituteAdmin.findById(req.userId).session(session);
//     if (!user) {
//       console.log("❌ User not found with ID:", req.userId);
//       await session.abortTransaction();
//       return res.status(404).json({
//         status: "fail",
//         message: "User not found",
//       });
//     }
//     console.log("✅ User found:", user._id);

//     // 2. Create institution
//     const institutionData = {
//       ...req.body,
//       owner: req.userId,
//       instituteType: req.body.instituteType,
//     };
//     console.log("📦 Institution data prepared:", institutionData);

//     const newInstitution = (
//       await Institution.create([institutionData], {
//         session,
//         validateBeforeSave: false,
//       })
//     )[0];
//     console.log("🏫 New Institution created:", newInstitution._id);

//     // 3. Update user with institution reference
//     user.institution = newInstitution._id;
//     console.log("🔗 Linking Institution to User...");
//     await user.save({ session, validateBeforeSave: false });
//     console.log("✅ User updated with institution reference.");

//     // 4. Commit transaction
//     await session.commitTransaction();
//     console.log("💾 Transaction committed successfully.");

//     logger.info(
//       { userId: req.userId, institutionId: newInstitution._id },
//       "L1 institution created successfully."
//     );

//     return res.status(201).json({
//       status: "success",
//       message: "L1 completed. Institution created. Please proceed to L2.",
//       data: {
//         id: newInstitution._id,
//         instituteType: newInstitution.instituteType,
//       },
//     });
//   } catch (error) {
//     console.log("🔥 ERROR occurred during L1 institution creation:", error);
//     await session.abortTransaction();

//     logger.error(
//       { err: error, userId: req.userId },
//       "Error during L1 institution creation transaction."
//     );

//     if (error.name === "ValidationError" || error.name === "CastError") {
//       console.log("⚠️ Validation/Cast error:", error.message);
//       return res.status(400).json({
//         status: "fail",
//         message: error.message || "Invalid input data",
//       });
//     }

//     return res.status(500).json({
//       status: "error",
//       message: "Something went wrong while creating institution",
//     });
//   } finally {
//     console.log("🛑 Ending DB session.");
//     session.endSession();
//   }
// });


// /**
//  * @desc    UPDATE L2 Institution
//  * @route   PUT /api/v1/institutions/details
//  * @access  Private
//  */

// // exports.updateL2InstitutionDetails = asyncHandler(async (req, res, next) => {
// //   try {
// //     const userId = req.userId;
// //     console.log('In updateL2InstituteDetails')
// //     logger.info({ userId }, "Starting L2 institution update for user");

// //     // Find institution owned by this user
// //     const institution = await Institution.findOne({ owner: userId });
// //     if (!institution) {
// //       logger.error({ userId }, "Institution not found for this user");
// //       return next(new AppError("Institution not found for this user", 404));
// //     }

// //     logger.info(
// //       { institutionId: institution._id },
// //       "Institution found. Preparing to update."
// //     );

// //     // Log incoming body
// //     logger.info({ body: req.body }, "Incoming update body");

// //     // Only update schema-defined fields
// //     const schemaFields = Object.keys(institution.schema.paths);
// //     const updatedFields = {};

// //     // Keys to exclude from numeric conversion
// //     const excludeNumericConversion = [
// //       "date",
// //       "establishmentDate",
// //       "opening",
// //       "closing",
// //       "operationalTimes",
// //     ];

// //     Object.keys(req.body).forEach((key) => {
// //       if (
// //         schemaFields.includes(key) &&
// //         req.body[key] !== undefined &&
// //         req.body[key] !== null &&
// //         req.body[key] !== ""
// //       ) {
// //         let value = req.body[key];

// //         // Convert pure digit strings to integers (skip excluded keys)
// //         if (
// //           typeof value === "string" &&
// //           /^\d+$/.test(value) &&
// //           !excludeNumericConversion.includes(key)
// //         ) {
// //           value = parseInt(value, 10);
// //         }

// //         institution[key] = value;
// //         updatedFields[key] = value;
// //       } else {
// //         logger.warn(
// //           { key, value: req.body[key] },
// //           "Skipping field (not in schema or invalid)"
// //         );
// //       }
// //     });

// //     logger.info({ updatedFields }, "Fields applied to institution");

// //     const updatedInstitution = await institution.save({
// //       validateBeforeSave: true,
// //     });

// //     logger.info(
// //       { userId, institutionId: institution._id },
// //       "L2 institution details updated successfully."
// //     );

// //     res.status(200).json({
// //       status: "success",
// //       message: "L2 completed. Institution details updated successfully.",
// //       data: { institution: updatedInstitution },
// //     });
// //   } catch (err) {
// //     logger.error({ err }, "Error while updating L2 institution details");
// //     next(err);
// //   }
// // });
// exports.updateL2InstitutionDetails = asyncHandler(async (req, res, next) => {
//   try {
//     const userId = req.userId;
//     console.log('In updateL2InstituteDetails')
//     logger.info({ userId }, "Starting L2 institution update for user");


//      const { instituteType } = req.body; // should come from frontend
//     console.log('In updateL2InstituteDetails');
//     logger.info({ userId, instituteType }, "Starting L2 institution update for user");

//     // Find institution owned by this user and of this type
//     const institution = await Institution.findOne({ owner: userId, instituteType });
//     // Find institution owned by this user
//     // const institution = await Institution.findOne({ owner: userId });
//     if (!institution) {
//       logger.error({ userId }, "Institution not found for this user");
//       return next(new AppError("Institution not found for this user", 404));
//     }

//     logger.info(
//       { institutionId: institution._id },
//       "Institution found. Preparing to update."
//     );

//     // Log incoming body
//     logger.info({ body: req.body }, "Incoming update body");

//     // Only update schema-defined fields
//     const schemaFields = Object.keys(institution.schema.paths);
//     const updatedFields = {};

//     // Keys to exclude from numeric conversion
//     const excludeNumericConversion = [
//       "date",
//       "establishmentDate",
//       "opening",
//       "closing",
//       "operationalTimes",
//     ];

//     Object.keys(req.body).forEach((key) => {
//       if (
//         schemaFields.includes(key) &&
//         req.body[key] !== undefined &&
//         req.body[key] !== null &&
//         req.body[key] !== ""
//       ) {
//         let value = req.body[key];

//         // Convert pure digit strings to integers (skip excluded keys)
//         if (
//           typeof value === "string" &&
//           /^\d+$/.test(value) &&
//           !excludeNumericConversion.includes(key)
//         ) {
//           value = parseInt(value, 10);
//         }

//         institution[key] = value;
//         updatedFields[key] = value;
//       } else {
//         logger.warn(
//           { key, value: req.body[key] },
//           "Skipping field (not in schema or invalid)"
//         );
//       }
//     });

//     logger.info({ updatedFields }, "Fields applied to institution");

//     const updatedInstitution = await institution.save({
//       validateBeforeSave: true,
//     });

//     logger.info(
//       { userId, institutionId: institution._id },
//       "L2 institution details updated successfully."
//     );

//     res.status(200).json({
//       status: "success",
//       message: "L2 completed. Institution details updated successfully.",
//       data: { institution: updatedInstitution },
//     });
//   } catch (err) {
//     logger.error({ err }, "Error while updating L2 institution details");
//     next(err);
//   }
// });

// /**
//  * @desc    READ the institution of the logged-in admin
//  * @route   GET /api/v1/institutions/me
//  * @access  Private
//  */
// exports.getMyInstitution = asyncHandler(async (req, res, next) => {
//   const institution = await Institution.findById(req.user.institution);

//   if (!institution) {
//     return res.status(404).json({
//       status: "fail",
//       message: "No institution found for this account.",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: { institution },
//   });
// });

// /**
//  * @desc    DELETE the institution of the logged-in admin
//  * @route   DELETE /api/v1/institutions/me
//  * @access  Private
//  */
// exports.deleteMyInstitution = asyncHandler(async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const institutionId = req.user.institution;
//     const institution = await Institution.findById(institutionId).session(
//       session
//     );

//     if (!institution) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Institution not found." });
//     }

//     await institution.remove({ session });

//     req.user.institution = undefined;
//     await req.user.save({ session, validateBeforeSave: false });

//     await session.commitTransaction();

//     logger.info(
//       { userId: req.user.id, institutionId },
//       "Institution deleted successfully."
//     );

//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     logger.error(
//       { err: error, userId: req.user.id },
//       "Error during institution deletion transaction."
//     );
//     next(error);
//   } finally {
//     session.endSession();
//   }
// });

const mongoose = require("mongoose");
const { Institution } = require("../models/Institution");
const asyncHandler = require("express-async-handler");
const logger = require("../config/logger");
const InstituteAdmin = require("../models/InstituteAdmin");

/**
 * @desc    CREATE L1 Institution (General Info)
 * @route   POST /api/v1/institutions
 * @access  Private
 */

exports.createL1Institution = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("🚀 Starting L1 Institution creation flow...");
    console.log("➡️  Incoming Request Body:", req.body);
    console.log("➡️  Authenticated User ID:", req.userId);

    // 1. Find user first
    console.log("🔍 Finding user in InstituteAdmin...");
    const user = await InstituteAdmin.findById(req.userId).session(session);
    if (!user) {
      console.log("❌ User not found with ID:", req.userId);
      await session.abortTransaction();
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    console.log("✅ User found:", user._id);

    // 2. Create institution
    const institutionData = {
      ...req.body,
      owner: req.userId,
      instituteType: req.body.instituteType,
    };
    console.log("📦 Institution data prepared:", institutionData);

    const newInstitution = (
      await Institution.create([institutionData], {
        session,
        validateBeforeSave: false,
      })
    )[0];
    console.log("🏫 New Institution created:", newInstitution._id);

    // 3. Update user with institution reference
    user.institution = newInstitution._id;
    console.log("🔗 Linking Institution to User...");
    await user.save({ session, validateBeforeSave: false });
    console.log("✅ User updated with institution reference.");

    // 4. Commit transaction
    await session.commitTransaction();
    console.log("💾 Transaction committed successfully.");

    logger.info(
      { userId: req.userId, institutionId: newInstitution._id },
      "L1 institution created successfully."
    );

    return res.status(201).json({
      status: "success",
      message: "L1 completed. Institution created. Please proceed to L2.",
      data: {
        id: newInstitution._id,
        instituteType: newInstitution.instituteType,
      },
    });
  } catch (error) {
    console.log("🔥 ERROR occurred during L1 institution creation:", error);
    await session.abortTransaction();

    logger.error(
      { err: error, userId: req.userId },
      "Error during L1 institution creation transaction."
    );

    if (error.name === "ValidationError" || error.name === "CastError") {
      console.log("⚠️ Validation/Cast error:", error.message);
      return res.status(400).json({
        status: "fail",
        message: error.message || "Invalid input data",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Something went wrong while creating institution",
    });
  } finally {
    console.log("🛑 Ending DB session.");
    session.endSession();
  }
});


/**
 * @desc    UPDATE L2 Institution
 * @route   PUT /api/v1/institutions/details
 * @access  Private
 */

exports.updateL2InstitutionDetails = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.userId;
    logger.info({ userId }, "Starting L2 institution update for user");

    // Find institution owned by this user
    const institution = await Institution.findOne({ owner: userId });
    if (!institution) {
      logger.error({ userId }, "Institution not found for this user");
      return next(new AppError("Institution not found for this user", 404));
    }

    logger.info(
      { institutionId: institution._id },
      "Institution found. Preparing to update."
    );

    // Log incoming body
    logger.info({ body: req.body }, "Incoming update body");

    // Only update schema-defined fields
    // const schemaFields = Object.keys(institution.schema.paths);
    const schemaFields = Object.keys(institution.constructor.schema.paths);

    const updatedFields = {};

    // Keys to exclude from numeric conversion
    const excludeNumericConversion = [
      "date",
      "establishmentDate",
      "opening",
      "closing",
      "operationalTimes",
    ];

    Object.keys(req.body).forEach((key) => {
      if (
        schemaFields.includes(key) &&
        req.body[key] !== undefined &&
        req.body[key] !== null &&
        req.body[key] !== ""
      ) {
        let value = req.body[key];

        // Convert pure digit strings to integers (skip excluded keys)
        if (
          typeof value === "string" &&
          /^\d+$/.test(value) &&
          !excludeNumericConversion.includes(key)
        ) {
          value = parseInt(value, 10);
        }

        institution[key] = value;
        updatedFields[key] = value;
      } else {
        logger.warn(
          { key, value: req.body[key] },
          "Skipping field (not in schema or invalid)"
        );
      }
    });

    logger.info({ updatedFields }, "Fields applied to institution");

    const updatedInstitution = await institution.save({
      validateBeforeSave: true,
    });

    logger.info(
      { userId, institutionId: institution._id },
      "L2 institution details updated successfully."
    );

    res.status(200).json({
      status: "success",
      message: "L2 completed. Institution details updated successfully.",
      data: { institution: updatedInstitution },
    });
  } catch (err) {
    logger.error({ err }, "Error while updating L2 institution details");
    next(err);
  }
});

/**
 * @desc    READ the institution of the logged-in admin
 * @route   GET /api/v1/institutions/me
 * @access  Private
 */
exports.getMyInstitution = asyncHandler(async (req, res, next) => {
  const institution = await Institution.findById(req.user.institution);

  if (!institution) {
    return res.status(404).json({
      status: "fail",
      message: "No institution found for this account.",
    });
  }

  res.status(200).json({
    status: "success",
    data: { institution },
  });
});

/**
 * @desc    DELETE the institution of the logged-in admin
 * @route   DELETE /api/v1/institutions/me
 * @access  Private
 */
exports.deleteMyInstitution = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const institutionId = req.user.institution;
    const institution = await Institution.findById(institutionId).session(
      session
    );

    if (!institution) {
      return res
        .status(404)
        .json({ status: "fail", message: "Institution not found." });
    }

    await institution.remove({ session });

    req.user.institution = undefined;
    await req.user.save({ session, validateBeforeSave: false });

    await session.commitTransaction();

    logger.info(
      { userId: req.user.id, institutionId },
      "Institution deleted successfully."
    );

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    await session.abortTransaction();
    logger.error(
      { err: error, userId: req.user.id },
      "Error during institution deletion transaction."
    );
    next(error);
  } finally {
    session.endSession();
  }
});