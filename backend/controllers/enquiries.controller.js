const Enquiries = require("../models/Enquiries");
const { Institution } = require("../models/Institution");
const student = require("../models/Student"); // legacy; keep import if used elsewhere
const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");

async function getInstitutionAdminLeadsTotal(institutionAdminId) {
  const institutions = await Institution.find({ institutionAdmin: institutionAdminId }).select("_id");
  const ids = institutions.map(i => i._id);
  if (ids.length === 0) return 0;
  
  // Count ONLY enquiries that are leads (callback/demo) across the institutionAdmin's institutions
  const count = await Enquiries.countDocuments({
    institution: { $in: ids },
    enquiryType: { $in: [/^callback$/i, /^demo$/i] }
  });
  
  return count;
}

async function getInstitutionAdminEnquiriesMonthly(institutionAdminId, year) {
  const institutions = await Institution.find({ institutionAdmin: institutionAdminId }).select("_id");
  const ids = institutions.map(i => i._id);
  if (ids.length === 0) return [];
  
  const monthlyData = [];
  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const count = await Enquiries.countDocuments({
      institution: { $in: ids },
      createdAt: { $gte: startDate, $lte: endDate },
      enquiryType: { $in: [/^callback$/i, /^demo$/i] }
    });
    
    monthlyData.push({ month, count });
  }
  
  return monthlyData;
}

async function getRecentEnquiries(institutionAdminId, limit = 4) {
  const institutions = await Institution.find({ institutionAdmin: institutionAdminId }).select("_id");
  const ids = institutions.map(i => i._id);
  if (ids.length === 0) return [];
  
  const enquiries = await Enquiries.find({
    institution: { $in: ids }
  })
  .populate("institution", "institutionName headquartersAddress locationURL")
  .populate("student", "studentAddress")
  .sort({ createdAt: -1 })
  .limit(limit)
  .select("studentName studentEmail studentPhone programInterest enquiryType createdAt institution student");
  
  return enquiries;
}

function getPeriod(range) {
  const now = new Date();
  let startDate, endDate;
  const r = (range || 'weekly').toString().toLowerCase();
  if (r === 'weekly') {
    startDate = new Date(now); startDate.setUTCDate(startDate.getUTCDate() - 6); endDate = new Date(now);
  } else if (r === 'monthly') {
    startDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1); endDate = new Date(now);
  } else if (r === 'yearly') {
    startDate = new Date(now.getUTCFullYear(), 0, 1); endDate = new Date(now);
  } else {
    startDate = new Date(now); startDate.setUTCDate(startDate.getUTCDate() - 6); endDate = new Date(now);
  }
  return { startDate, endDate };
}

async function countByTypeInRange(institutionAdminId, startDate, endDate) {
  const institutions = await Institution.find({ institutionAdmin: institutionAdminId }).select("_id");
  const ids = institutions.map(i => i._id);
  if (ids.length === 0) return { callbacks: 0, demos: 0 };
  const [callbacks, demos] = await Promise.all([
    Enquiries.countDocuments({ institution: { $in: ids }, createdAt: { $gte: startDate, $lte: endDate }, enquiryType: /callback/i }),
    Enquiries.countDocuments({ institution: { $in: ids }, createdAt: { $gte: startDate, $lte: endDate }, enquiryType: /demo/i })
  ]);
  return { callbacks, demos };
}

exports.getInstitutionAdminLeadsSummary = asyncHandler(async (req, res, next) => {
  const totalLeads = await getInstitutionAdminLeadsTotal(req.userId);
  res.status(200).json({ 
    success: true, 
    data: { totalLeads } 
  });
});

exports.getInstitutionAdminEnquiriesForChart = asyncHandler(async (req, res, next) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const data = await getInstitutionAdminEnquiriesMonthly(req.userId, year);
  res.status(200).json({ 
    success: true, 
    data: { enquiriesData: data } 
  });
});

exports.getInstitutionAdminRecentEnquiries = asyncHandler(async (req, res, next) => {
  const limit = Math.max(1, Math.min(10000, parseInt(req.query.limit) || 1000));
  const offset = Math.max(0, parseInt(req.query.offset) || 0);
  const institutions = await Institution.find({ institutionAdmin: req.userId }).select("_id");
  const ids = institutions.map(i => i._id);
  if (ids.length === 0) return res.status(200).json({ success: true, data: { enquiries: [] } });

  const enquiries = await Enquiries.find({
    institution: { $in: ids }
  })
  .populate("institution", "institutionName headquartersAddress locationURL")
  .populate("student", "studentAddress")
  .sort({ createdAt: -1 })
  .skip(offset)
  .limit(limit)
  .select("studentName studentEmail studentPhone programInterest enquiryType createdAt institution student");

  res.status(200).json({ 
    success: true, 
    data: { enquiries } 
  });
});

exports.createEnquiry = asyncHandler(async (req, res, next) => {
  const { studentName, studentEmail, studentPhone, institution, programInterest, enquiryType } = req.body;
  
  const enquiry = await Enquiries.create({
    // studentName,
    // studentEmail, 
    // studentPhone,
    institution,
    programInterest,
    enquiryType
  });
  
  try {
    const io = req.app.get("io");
    if (io) {
      io.to(`institution:${institution}`).emit("enquiryCreated", { enquiry });
      
      // Update Institution rollups for callback/demo
      try {
        const { Institution } = require("../models/Institution");
        const instDoc = await Institution.findById(institution).select('_id institutionAdmin callbackLeadsTotal demoLeadsTotal callbackRollups demoRollups');
        if (instDoc) {
          const now = new Date();
          const yyyy = now.getUTCFullYear();
          const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
          const dd = String(now.getUTCDate()).padStart(2, '0');
          const dayKey = `${yyyy}-${mm}-${dd}`;
          const isCallback = /callback/i.test(enquiryType || '');
          const isDemo = /demo/i.test(enquiryType || '');
          const updates = {};
          if (isCallback) updates['callbackLeadsTotal'] = (instDoc.callbackLeadsTotal || 0) + 1;
          if (isDemo) updates['demoLeadsTotal'] = (instDoc.demoLeadsTotal || 0) + 1;
          // rollups
          if (isCallback) {
            const idx = (instDoc.callbackRollups || []).findIndex(r => r.day === dayKey);
            if (idx >= 0) instDoc.callbackRollups[idx].count += 1; else instDoc.callbackRollups.push({ day: dayKey, count: 1 });
          }
          if (isDemo) {
            const idx = (instDoc.demoRollups || []).findIndex(r => r.day === dayKey);
            if (idx >= 0) instDoc.demoRollups[idx].count += 1; else instDoc.demoRollups.push({ day: dayKey, count: 1 });
          }
          if (Object.keys(updates).length > 0) {
            Object.assign(instDoc, updates);
            await instDoc.save();
          }
        }
      } catch (err) {
        console.error('EnquiriesController: update institution rollups failed', err?.message || err);
      }
      
      const inst = await Institution.findById(institution).select("institutionAdmin");
      if (inst?.institutionAdmin) {
        const adminId = String(inst.institutionAdmin);
        io.to(`institutionAdmin:${adminId}`).emit("enquiryCreated", { enquiry });
        
        // Emit updated leads total (based on students now)
        const totalLeads = await getInstitutionAdminLeadsTotal(adminId);
        io.to(`institutionAdmin:${adminId}`).emit("institutionAdminTotalLeads", { totalLeads });
      }
    }
  } catch (err) {
    console.error('EnquiriesController: create enquiry handler failed', err?.message || err);
  }
  
  res.status(201).json({
    success: true,
    data: enquiry
  });
});

// New: summary by type in a range
exports.getInstitutionAdminEnquiryTypeSummary = asyncHandler(async (req, res, next) => {
  const range = (req.query.range || 'weekly').toString().toLowerCase();
  const { startDate, endDate } = getPeriod(range);
  const { callbacks, demos } = await countByTypeInRange(req.userId, startDate, endDate);
  res.status(200).json({ success: true, data: { range, callbacks, demos } });
});

// Rollup-based range summary from Institution.callbackRollups/demoRollups
exports.getInstitutionAdminEnquiryTypeByRangeRollups = asyncHandler(async (req, res, next) => {
  const range = (req.query.range || 'weekly').toString().toLowerCase();
  const type = (req.query.type || '').toString().toLowerCase();
  if (type && !['callback','demo'].includes(type)) return next(new AppError('Invalid type. Use type=callback|demo', 400));
  const { startDate, endDate } = getPeriod(range);
  const startKey = startDate.toISOString().split('T')[0];
  const endKey = endDate.toISOString().split('T')[0];
  const institutions = await Institution.find({ institutionAdmin: req.userId }).select('_id');
  const ids = institutions.map(i => i._id);
  if (ids.length === 0) return res.status(200).json({ success: true, data: { callbacks: 0, demos: 0 } });

  const doSum = async (field) => {
    const agg = await Institution.aggregate([
      { $match: { _id: { $in: ids } } },
      { $unwind: { path: `$${field}`, preserveNullAndEmptyArrays: false } },
      { $match: { [`${field}.day`]: { $gte: startKey, $lte: endKey } } },
      { $group: { _id: null, total: { $sum: `$${field}.count` } } }
    ]);
    return agg[0]?.total || 0;
  };

  if (type) {
    const total = await doSum(type === 'callback' ? 'callbackRollups' : 'demoRollups');
    return res.status(200).json({ success: true, data: { [type + 's']: total } });
  }

  const [callbacks, demos] = await Promise.all([
    doSum('callbackRollups'),
    doSum('demoRollups')
  ]);
  return res.status(200).json({ success: true, data: { callbacks, demos } });
});
