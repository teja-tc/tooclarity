const express = require('express');
const { createCoupon, validateCoupon } = require('../controllers/coupon.controller');

const couponAdminRoute = express.Router();
const couponInstitutionAdminRoute = express.Router();

couponAdminRoute.route('/coupon/create').post(createCoupon);
couponInstitutionAdminRoute.route('/coupon/apply').post(validateCoupon);

module.exports = {
    couponAdminRoute,
    couponInstitutionAdminRoute
}