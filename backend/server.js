const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Institution } = require('./models/Institution');
// const {Course} =require('./models/Course')

dotenv.config();
const app = require('./app');

const DB = process.env.MONGO_URI;
mongoose.connect(DB).then(() => console.log('✅ MongoDB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`🚀 App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// 68b5d5d7d52c0e2a073a9b3c for Intermediate_college
// 68c15f7818bb3d81d9312305 for schools 
// 68c1bd1e03d44279d60a7519 for ugpg
// 68c256e2f891e7798f02e98b for coaching centers
// 68c25c25f71c4a9d33954a17 for tutition centers
// 68c27f8327ba666824931af3 for study halls
const Course = require("./models/Course");
const Branch = require("./models/Branch");

async function fetchInstitutionData(ownerId) {
  try {
    const institution = await Institution.findOne({ owner: ownerId });

    if (!institution) {
      console.log(`❌ No institution found for owner ID: ${ownerId}`);
      return;
    }

    console.log(`✅ Institution found: ${institution._id}`);

    const [courses, branches] = await Promise.all([
      Course.find({ institution: institution._id }),
      Branch.find({ institution: institution._id }),
    ]);
    console.log("Institutuion:",institution)
    console.log("📚 Courses:", courses);
    console.log("🏢 Branches:", branches);
  } catch (err) {
    console.error("🔥 Error fetching institution data:", err);
  }
}

fetchInstitutionData("68c27f8327ba666824931af3");

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  const statusCode = err.statusCode || err.status || 500; // fallback
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
  });
});
