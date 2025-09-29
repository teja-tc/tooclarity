const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { sendTokens } = require('../controllers/auth.controller');
const { googleAuthCallback } = require("../controllers/google.auth.controller");


// // /api/v1/auth/google?userType=admin|student
// router.get('/google', (req, res, next) => {
//   const userType = req.query.userType === 'student' ? 'student' : 'admin';
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//     session: false,
//     state: JSON.stringify({ userType }),
//   })(req, res, next);
// });

// /api/v1/auth/google/callback
// router.get('/google/callback',
//   (req, res, next) => {
//     if (req.query.state) {
//       try {
//         const state = JSON.parse(req.query.state);
//         req.query.userType = state.userType;
//       } catch {}
//     }
//     next();
//   },
//   passport.authenticate('google', { failureRedirect: '/login', session: false }),
//   require('../controllers/auth.controller').googleOAuthCallback
// );

router.get("/callback", googleAuthCallback);

module.exports = router;