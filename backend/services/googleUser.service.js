const InstituteAdmin = require('../models/InstituteAdmin');
const Student = require('../models/Student');

/**
 * Find or create a user (InstituteAdmin or Student) based on Google profile and userType.
 * @param {object} profile - Google profile
 * @param {string} userType - 'admin' or 'student'
 * @returns {Promise<object>} user
 */
async function findOrCreateGoogleUser(profile, userType) {
  if (userType === 'student') {
    let user = await Student.findOne({ googleId: profile.id });
    if (!user) {
      user = await Student.create({
        googleId: profile.id,
        studentName: profile.displayName,
        studentEmail: profile.emails[0].value,
        // You may want to set institution or other fields here
      });
    }
    user._userType = 'student';
    return user;
  } else {
    let user = await InstituteAdmin.findOne({ googleId: profile.id });
    if (!user) {
      user = await InstituteAdmin.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        role: 'INSTITUTE_ADMIN',
        isEmailVerified: true,
      });
    }
    user._userType = 'admin';
    return user;
  }
}

module.exports = { findOrCreateGoogleUser };
