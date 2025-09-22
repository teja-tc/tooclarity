const express = require("express");
const router = express.Router();

const {
  getOwnerLeadsSummary,
  getOwnerEnquiriesForChart,
  getOwnerRecentEnquiries,
  createEnquiry,
  getOwnerEnquiryTypeSummary,
  getOwnerEnquiryTypeByRangeRollups
} = require("../controllers/enquiries.controller");

// All routes require authentication


// Get total leads for owner
router.get("/summary/leads", getOwnerLeadsSummary);

// Get enquiries data for chart (monthly by year)
router.get("/chart", getOwnerEnquiriesForChart);

// Get recent enquiries for dashboard
router.get("/recent", getOwnerRecentEnquiries);

// Summary by type for a time range
router.get("/summary/types", getOwnerEnquiryTypeSummary);

// Rollup-based range summary from Institution.callbackRollups/demoRollups
router.get("/summary/types/range", getOwnerEnquiryTypeByRangeRollups);

// Create new enquiry
router.post("/createEnquiry", createEnquiry);

module.exports = router;
