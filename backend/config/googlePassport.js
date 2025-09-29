// Google OAuth configuration and passport setup
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { findOrCreateGoogleUser } = require('../services/googleUser.service');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Determine user type from query param (default: admin)
    const userType = req.query.userType === 'student' ? 'student' : 'admin';
    const user = await findOrCreateGoogleUser(profile, userType);
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, { id: user.id, userType: user._userType });
});

passport.deserializeUser(async (obj, done) => {
  try {
    let user;
    if (obj.userType === 'student') {
      user = await require('../models/Student').findById(obj.id);
    } else {
      user = await require('../models/InstituteAdmin').findById(obj.id);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
