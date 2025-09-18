const mongoose = require("mongoose");
const { Institution } = require("../models/Institution");
const asyncHandler = require("express-async-handler");
const logger = require("../config/logger");
const InstituteAdmin = require("../models/InstituteAdmin");
const Branch = require("../models/Branch");
const Course = require("../models/Course");

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
    const user = await InstituteAdmin.findById(req.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const institutionData = {
      ...req.body,
      owner: req.userId,
      instituteType: req.body.instituteType,
    };

    const newInstitution = (
      await Institution.create([institutionData], {
        session,
        validateBeforeSave: false,
      })
    )[0];

    user.institution = newInstitution._id;
    await user.save({ session, validateBeforeSave: false });

    await session.commitTransaction();

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
    await session.abortTransaction();
    logger.error(
      { err: error, userId: req.userId },
      "Error during L1 institution creation transaction."
    );
    if (error.name === "ValidationError" || error.name === "CastError") {
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
    const institution = await Institution.findOne({ owner: userId });
    if (!institution) {
      logger.error({ userId }, "Institution not found for this user");
      return next(new AppError("Institution not found for this user", 404));
    }

    const schemaFields = Object.keys(institution.constructor.schema.paths);
    const updatedFields = {};
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
        if (
          typeof value === "string" &&
          /^\d+$/.test(value) &&
          !excludeNumericConversion.includes(key)
        ) {
          value = parseInt(value, 10);
        }
        institution[key] = value;
        updatedFields[key] = value;
      }
    });

    const updatedInstitution = await institution.save({
      validateBeforeSave: true,
    });

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


// =========================================================
// ✅ ADD THIS ENTIRE FUNCTION
// =========================================================
/**
//  * @desc    Upload file data for an institution
//  * @route   POST /api/v1/institutions/upload
//  * @access  Private
//  */
// exports.uploadFileData = asyncHandler(async (req, res, next) => {
//   logger.info({ userId: req.userId }, "File upload request received");
//   console.log("in upload file data")
//   if (!req.file) {
//     logger.warn({ userId: req.userId }, "No file uploaded.");
//     return res.status(400).json({
//       status: "fail",
//       message: "Please upload a file.",
//     });
//   }

//   // You can now process the file from req.file
//   // For example, parsing a CSV, saving to cloud storage, etc.
//   console.log("Uploaded file info:", req.file);

//   // For now, just send a success response
//   res.status(200).json({
//     status: "success",
//     message: "File uploaded successfully.",
//     data: {
//       filename: req.file.originalname,
//       size: req.file.size,
//     },
//   });
// });
/**
 * @desc    Upload file data for an institution, creating/updating institution, branches, and courses.
 * @route   POST /api/v1/institutions/upload
 * @access  Private
 */
// exports.uploadFileData = asyncHandler(async (req, res, next) => {
//   logger.info({ userId: req.userId }, "File upload request received.");

//   if (!req.file) {
//     logger.warn({ userId: req.userId }, "No file uploaded.");
//     return res.status(400).json({
//       status: "fail",
//       message: "Please upload a file.",
//     });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // 1. Parse the JSON file content from the buffer
//     const fileContent = req.file.buffer.toString('utf8');
//     const jsonData = JSON.parse(fileContent);
//     const { institution: institutionData, courses: branchesWithCourses } = jsonData;

//     // 2. Find the user to associate with the institution
//     const user = await InstituteAdmin.findById(req.userId).session(session);
//     if (!user) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ status: "fail", message: "User not found" });
//     }

//     // 3. Create or update the institution (upsert)
//     const institution = await Institution.findOneAndUpdate(
//       { owner: req.userId },
//       { ...institutionData, owner: req.userId },
//       { new: true, upsert: true, session: session, runValidators: true }
//     );

//     // 4. Link institution to the user model if not already linked
//     if (!user.institution || user.institution.toString() !== institution._id.toString()) {
//       user.institution = institution._id;
//       await user.save({ session });
//     }

//     // 5. Clear old branches and courses to prevent duplicates on re-upload
//     const oldBranches = await Branch.find({ institution: institution._id }).session(session);
//     const oldBranchIds = oldBranches.map(b => b._id);
    
//     if (oldBranchIds.length > 0) {
//         await Course.deleteMany({ branch: { $in: oldBranchIds } }).session(session);
//     }
//     await Branch.deleteMany({ institution: institution._id }).session(session);


//     // 6. Iterate through branches and their courses to create new documents
//     for (const branchData of branchesWithCourses) {
//       const { courses, ...branchInfo } = branchData;

//       // Skip if branchName is missing
//       if (!branchInfo.branchName) continue;

//       // Create the new branch linked to the institution
//       const newBranch = new Branch({
//         ...branchInfo,
//         institution: institution._id,
//         owner: req.userId
//       });
//       await newBranch.save({ session });

//       // Create the courses associated with this new branch
//       if (courses && courses.length > 0) {
//         const coursesToCreate = courses.map(courseData => ({
//           ...courseData,
//           branch: newBranch._id,
//           institution: institution._id,
//           owner: req.userId
//         }));
//         await Course.insertMany(coursesToCreate, { session });
//       }
//     }

//     // 7. If all operations are successful, commit the transaction
//     await session.commitTransaction();

//     logger.info({ userId: req.userId, institutionId: institution._id }, "File data processed and saved successfully.");
    
//     res.status(200).json({
//       status: "success",
//       message: "File data uploaded and processed successfully.",
//       data: {
//         institutionId: institution._id,
//         branchesCreated: branchesWithCourses.length,
//         coursesCreated: branchesWithCourses.reduce((acc, branch) => acc + (branch.courses ? branch.courses.length : 0), 0)
//       }
//     });

//   } catch (error) {
//     // If any error occurs, abort the entire transaction
//     await session.abortTransaction();
//     logger.error({ err: error, userId: req.userId }, "Error during file data processing.");
    
//     if (error instanceof SyntaxError) {
//       return res.status(400).json({ status: "fail", message: "Invalid JSON format in the uploaded file." });
//     }

//     next(error); // Pass other errors to the global error handler
//   } finally {
//     // End the session
//     session.endSession();
//   }
// });
exports.uploadFileData = asyncHandler(async (req, res, next) => {
  console.log("➡️ File upload request received for user:", req.userId);

  if (!req.file) {
    console.warn("⚠️ No file uploaded by user:", req.userId);
    return res.status(400).json({
      status: "fail",
      message: "Please upload a file.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("🟢 MongoDB session started.");

  try {
    // 1️⃣ Parse JSON from uploaded file
    const fileContent = req.file.buffer.toString('utf8');
    const jsonData = JSON.parse(fileContent);
    const { institution: institutionData, courses: branchesWithCourses } = jsonData;
    console.log("📄 Parsed JSON data:", JSON.stringify(jsonData, null, 2));

    // 2️⃣ Find the user
    const user = await InstituteAdmin.findById(req.userId).session(session);
    if (!user) {
      console.error("❌ User not found with id:", req.userId);
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
    console.log("👤 User found:", user.name);

    // 3️⃣ Create or update institution
    const institution = await Institution.findOneAndUpdate(
      { owner: req.userId },
      { ...institutionData, owner: req.userId },
      { new: true, upsert: true, session: session, runValidators: true }
    );
    console.log("🏫 Institution created/updated:", institution._id, institution.instituteName);

    // 4️⃣ Link institution to user
    if (!user.institution || user.institution.toString() !== institution._id.toString()) {
      user.institution = institution._id;
      await user.save({ session });
      console.log("🔗 Institution linked to user:", user.institution.toString());
    }

    // 5️⃣ Clear old branches and courses
    const oldBranches = await Branch.find({ institution: institution._id }).session(session);
    console.log("🧹 Old branches found:", oldBranches.length);
    const oldBranchIds = oldBranches.map(b => b._id);
    if (oldBranchIds.length > 0) {
      const deletedCourses = await Course.deleteMany({ branch: { $in: oldBranchIds } }).session(session);
      console.log(`🗑 Deleted ${deletedCourses.deletedCount} old courses.`);
    }
    const deletedBranches = await Branch.deleteMany({ institution: institution._id }).session(session);
    console.log(`🗑 Deleted ${deletedBranches.deletedCount} old branches.`);

    // 6️⃣ Create new branches and courses
    for (const branchData of branchesWithCourses) {
      const { courses, ...branchInfo } = branchData;
      if (!branchInfo.branchName) {
        console.warn("⚠️ Skipping branch without name:", branchInfo);
        continue;
      }

      const newBranch = new Branch({
        ...branchInfo,
        institution: institution._id,
        owner: req.userId
      });
      await newBranch.save({ session });
      console.log("✅ Branch created:", newBranch.branchName, newBranch._id);

      if (courses && courses.length > 0) {
        const coursesToCreate = courses.map(courseData => ({
          ...courseData,
          branch: newBranch._id,
          institution: institution._id,
          owner: req.userId
        }));
        const insertedCourses = await Course.insertMany(coursesToCreate, { session });
        console.log(`📚 Created ${insertedCourses.length} courses for branch:`, newBranch.branchName);
      }
    }

    // 7️⃣ Commit transaction
    await session.commitTransaction();
    console.log("✅ Transaction committed successfully.");

    res.status(200).json({
      status: "success",
      message: "File data uploaded and processed successfully.",
      data: {
        institutionId: institution._id,
        branchesCreated: branchesWithCourses.length,
        coursesCreated: branchesWithCourses.reduce((acc, branch) => acc + (branch.courses ? branch.courses.length : 0), 0)
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("❌ Error during file upload:", error);
    if (error instanceof SyntaxError) {
      return res.status(400).json({ status: "fail", message: "Invalid JSON format in the uploaded file." });
    }
    next(error);
  } finally {
    session.endSession();
    console.log("🟢 MongoDB session ended.");
  }
});
// =========================================================
// END OF ADDED FUNCTION
// =========================================================


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
    const institution = await Institution.findById(institutionId).session(session);

    if (!institution) {
      return res.status(404).json({ status: "fail", message: "Institution not found." });
    }

    await institution.remove({ session });

    req.user.institution = undefined;
    await req.user.save({ session, validateBeforeSave: false });

    await session.commitTransaction();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});