const express = require("express");
const router = express.Router();

const {
  getInstitutionAdminLeadsSummary,
  getInstitutionAdminEnquiriesForChart,
  getInstitutionAdminRecentEnquiries,
  createEnquiry,
  getInstitutionAdminEnquiryTypeSummary,
  getInstitutionAdminEnquiryTypeByRangeRollups
} = require("../controllers/enquiries.controller");

// All routes require authentication


// Get total leads for institutionAdmin
router.get("/summary/leads", getInstitutionAdminLeadsSummary);

// Get enquiries data for chart (monthly by year)
router.get("/chart", getInstitutionAdminEnquiriesForChart);

// Get recent enquiries for dashboard
router.get("/recent", getInstitutionAdminRecentEnquiries);

// Summary by type for a time range
router.get("/summary/types", getInstitutionAdminEnquiryTypeSummary);

// Rollup-based range summary from Institution.callbackRollups/demoRollups
router.get("/summary/types/range", getInstitutionAdminEnquiryTypeByRangeRollups);

// Create new enquiry
router.post("/createEnquiry", createEnquiry);

module.exports = router;
