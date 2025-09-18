const express = require('express');
const { createCoupon, applyCoupon } = require('../controllers/coupon.controller');

const couponAdminRoute = express.Router();
const couponInstitutionAdminRoute = express.Router();

couponAdminRoute.route('/coupon/create').post(createCoupon);
couponInstitutionAdminRoute.route('/coupon/apply').post(applyCoupon);

module.exports = {
    couponAdminRoute,
    couponInstitutionAdminRoute
}