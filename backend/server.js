const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = require('./app');

const DB = process.env.MONGO_URI;
mongoose.connect(DB).then(() => console.log('✅ MongoDB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`🚀 App running on port ${port}...`);
});

// Attach Socket.IO
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
  }
});
app.set('io', io);

io.on('connection', (socket) => {
  // Expect client to join institution room
  socket.on('joinInstitution', (institutionId) => {
    if (institutionId) socket.join(`institution:${institutionId}`);
  });
  // Owner scope room for cross-institution aggregates
  socket.on('joinOwner', (ownerId) => {
    if (ownerId) socket.join(`owner:${ownerId}`);
  });
});

// Emit realtime events even if DB is updated externally (watch courseViews changes)
(async () => {
  try {
    const Course = require('./models/Course');
    const { Institution } = require('./models/Institution');
    const changeStream = Course.watch([
      { $match: { 'operationType': { $in: ['update', 'replace'] } } }
    ], { fullDocument: 'updateLookup' });

    changeStream.on('change', async (change) => {
      try {
        const doc = change.fullDocument;
        if (!doc) return;
        const updated = change.updateDescription?.updatedFields || {};
        const institutionId = String(doc.institution);
        const { Institution } = require('./models/Institution');
        const inst = await Institution.findById(institutionId).select('owner');

        const keys = Object.keys(updated);
        const viewsRollupsChanged = keys.some(k => k.startsWith('viewsRollups'));
        const comparisonsRollupsChanged = keys.some(k => k.startsWith('comparisonRollups'));

        // courseViews or viewsRollups change → emit views events and owner totals
        if (typeof updated.courseViews !== 'undefined' || viewsRollupsChanged || change.operationType === 'replace') {
          if (institutionId) io.to(`institution:${institutionId}`).emit('courseViewsUpdated', { institutionId, courseId: String(doc._id), courseViews: doc.courseViews });
          if (inst?.owner) {
            const ownerId = String(inst.owner);
            io.to(`owner:${ownerId}`).emit('courseViewsUpdated', { institutionId, courseId: String(doc._id), courseViews: doc.courseViews });
            const institutions = await Institution.find({ owner: ownerId }).select('_id');
            const ids = institutions.map(i => i._id);
            if (ids.length > 0) {
              const agg = await require('./models/Course').aggregate([
                { $match: { institution: { $in: ids } } },
                { $group: { _id: null, totalViews: { $sum: { $ifNull: ["$courseViews", 0] } } } }
              ]);
              const totalViews = (agg[0]?.totalViews) || 0;
              io.to(`owner:${ownerId}`).emit('ownerTotalViews', { totalViews });
            }
          }
        }

        // comparisons or comparisonRollups change → emit comparison events and owner totals
        if (typeof updated.comparisons !== 'undefined' || comparisonsRollupsChanged || change.operationType === 'replace') {
          if (institutionId) io.to(`institution:${institutionId}`).emit('comparisonsUpdated', { institutionId, courseId: String(doc._id), comparisons: doc.comparisons });
          if (inst?.owner) {
            const ownerId = String(inst.owner);
            io.to(`owner:${ownerId}`).emit('comparisonsUpdated', { institutionId, courseId: String(doc._id), comparisons: doc.comparisons });
            const institutions = await Institution.find({ owner: ownerId }).select('_id');
            const ids = institutions.map(i => i._id);
            if (ids.length > 0) {
              const agg = await require('./models/Course').aggregate([
                { $match: { institution: { $in: ids } } },
                { $group: { _id: null, totalComparisons: { $sum: { $ifNull: ["$comparisons", 0] } } } }
              ]);
              const totalComparisons = (agg[0]?.totalComparisons) || 0;
              io.to(`owner:${ownerId}`).emit('ownerTotalComparisons', { totalComparisons });
            }
          }
        }
      } catch {}
    });
  } catch (e) {
    console.error('Change stream init failed:', e?.message || e);
  }
})();

// Watch enquiries collection for realtime callback/demo updates and total leads
(async () => {
  try {
    const Enquiries = require('./models/Enquiries');
    const { Institution } = require('./models/Institution');
    const stream = Enquiries.watch([{ $match: { operationType: { $in: ['insert'] } } }], { fullDocument: 'updateLookup' });
    stream.on('change', async (change) => {
      try {
        const doc = change.fullDocument;
        if (!doc) return;
        const institutionId = String(doc.institution);
        if (institutionId) io.to(`institution:${institutionId}`).emit('enquiryCreated', { enquiry: doc });
        // Notify owner rooms as well and push updated totals
        const inst = await Institution.findById(institutionId).select('owner');
        if (inst?.owner) {
          const ownerId = String(inst.owner);
          io.to(`owner:${ownerId}`).emit('enquiryCreated', { enquiry: doc });
          // Emit updated total leads (customer-based)
          const { default: mongoose } = require('mongoose');
          const Customer = require('./models/Customer');
          const institutions = await Institution.find({ owner: ownerId }).select('_id');
          const ids = institutions.map(i => i._id);
          const totalLeads = await Customer.countDocuments({ institution: { $in: ids } });
          io.to(`owner:${ownerId}`).emit('ownerTotalLeads', { totalLeads });
        }
      } catch {}
    });
  } catch (e) {
    console.error('Enquiries change stream init failed:', e?.message || e);
  }
})();

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
