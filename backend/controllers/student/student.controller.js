const InstituteAdmin = require('../../models/InstituteAdmin.js');
const { matchedData } = require('express-validator');

// ✅ Reusable schema validation for academic profiles
const validateProfileDetails = (profileType, details) => {
  switch (profileType) {
    case 'KINDERGARTEN':
      return ['CURRENTLY_IN', 'COMPLETED', 'SEEKING_ADMISSION'].includes(details.status);

    case 'SCHOOL':
    case 'INTERMEDIATE':
    case 'TUITION_CENTER':
      return typeof details.studyingIn === 'string' && typeof details.preferredStream === 'string';

    case 'GRADUATION':
      if (details.graduationType === 'UNDER_GRADUATE' || details.graduationType === 'POST_GRADUATE') {
        return typeof details.studyingIn === 'string' && typeof details.preferredStream === 'string';
      }
      return false;

    case 'COACHING':
      return (
        ['UPSKILLING_SKILL_DEVELOPMENT', 'EXAM_PREPARATION', 'VOCATIONAL_TRAINING'].includes(details.lookingFor) &&
        typeof details.academicLevel === 'string' &&
        typeof details.stream === 'string' &&
        typeof details.passoutYear === 'string'
      );

    case 'STUDY_HALLS':
      return true;

    case 'STUDY_ABROAD':
      return (
        typeof details.studyGoals === 'string' &&
        typeof details.budgetPerYear === 'string' &&
        Array.isArray(details.preferredCountries) &&
        ['YES', 'NO', 'APPLIED'].includes(details.passportStatus)
      );

    default:
      return false;
  }
};

// ✅ Create a new Student
const createStudent = async (req, res) => {
  const { name, email, contactNumber, address, googleId } = matchedData(req);

  try {
    const student = new InstituteAdmin({
      googleId,
      name,
      email,
      contactNumber,
      address,
      role: 'STUDENT',
    });

    await student.save();
    res.status(201).json({ data: student });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// ✅ Get a Student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await InstituteAdmin.findOne({ _id: req.params.id, role: 'STUDENT' });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.status(200).json({ data: student });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// ✅ Update Student Details
const updateStudentDetails = async (req, res) => {
  const updates = matchedData(req, { locations: ['body'] });

  try {
    const student = await InstituteAdmin.findOneAndUpdate(
      { _id: req.params.id, role: 'STUDENT' },
      { $set: updates },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.status(200).json({ data: student });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// ✅ Update Academic Profile
const updateAcademicProfile = async (req, res) => {
  const { profileType, details } = req.body;

  if (!validateProfileDetails(profileType, details)) {
    return res.status(400).json({ error: 'Invalid structure for the provided profile details.' });
  }

  const academicProfile = { profileType, details };

  try {
    const student = await InstituteAdmin.findOneAndUpdate(
      { _id: req.params.id, role: 'STUDENT' },
      { $set: { academicProfile } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.status(200).json({
      message: 'Academic profile updated successfully.',
      data: student.academicProfile,
    });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

module.exports = {
  createStudent,
  getStudentById,
  updateStudentDetails,
  updateAcademicProfile,
};
