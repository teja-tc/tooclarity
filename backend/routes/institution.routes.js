const express = require('express');
const institutionController = require('../controllers/institution.controller');
const { validateL1Creation, validateL2Update } = require('../middleware/validators')
const courseController = require('../controllers/course.controller');
const enquiriesController = require('../controllers/enquiries.controller');

const router = express.Router();

// CREATE (L1)
router.post('/', validateL1Creation, institutionController.createL1Institution);

// UPDATE (L2)
router.put(
	'/details',
	validateL2Update,
	institutionController.updateL2InstitutionDetails
);

// READ & DELETE (match frontend helpers)
router.get('/me', institutionController.getMyInstitution);
router.delete('/me', institutionController.deleteMyInstitution);

// Unified owner metrics
router.get('/summary/metrics/owner', courseController.getOwnerMetricSummaryUnified);
router.get('/summary/metrics/owner/range', courseController.getOwnerMetricByRangeUnified);
// New: series endpoint (monthly for a given year)
router.get('/summary/metrics/owner/series', courseController.getOwnerMetricSeriesUnified);
// New: callback/demo rollups by range for owner
router.get('/summary/enquiries/owner/range', enquiriesController.getOwnerEnquiryTypeByRangeRollups);

module.exports = router;