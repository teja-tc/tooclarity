
// const mongoose = require('mongoose');
// const { Institution, UgPgUniversity } = require('./models/Institution');
// const Course = require('./models/Course');
// const InstituteAdmin = require('./models/InstituteAdmin');
// const Branch = require('./models/Branch');

// require('dotenv').config({ path: 'c:/Users/sridhar/tooClarity/tooclarity/backend/.env' });

// const seedData = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('MongoDB connected');

//     // await Institution.deleteMany({});
//     // await Course.deleteMany({});
//     // await InstituteAdmin.deleteMany({});
//     // await Branch.deleteMany({});

//     // Create Institute Admin
//     const admin = await InstituteAdmin.create({
//       name: 'Test Admin',
//       email: 'admin@test.com',
//       password: 'password123',
//       contactNumber: '1234567890',
//       designation: 'Administrator',
//     });

//     // Create Institution
//     const institution = await UgPgUniversity.create({
//       instituteName: 'Test University',
//       instituteType: 'Under Graduation/Post Graduation',
//       establishmentDate: '2000-01-01',
//       approvedBy: 'UGC',
//       contactInfo: 'contact@testuni.com',
//       headquartersAddress: '123 University Lane, Test City',
//       state: 'Test State',
//       pincode: '123456',
//       owner: admin._id,
//       ownershipType: 'Private',
//       collegeCategory: 'Engineering',
//       affiliationType: 'Test Affiliation',
//     });

//     admin.institution = institution._id;
//     await admin.save();

//     // Create Courses
//     await Course.create([
//       {
//         courseName: 'Computer Science Engineering',
//         aboutCourse: 'A comprehensive course on computer science.',
//         courseDuration: '4 years',
//         mode: 'Offline',
//         priceOfCourse: 500000,
//         graduationType: 'Under Graduate',
//         streamType: 'Engineering',
//         selectBranch: 'Computer Science',
//         aboutBranch: 'Focuses on software development and algorithms.',
//         institution: institution._id,
//       },
//       {
//         courseName: 'Mechanical Engineering',
//         aboutCourse: 'A comprehensive course on mechanical engineering.',
//         courseDuration: '4 years',
//         mode: 'Offline',
//         priceOfCourse: 450000,
//         graduationType: 'Under Graduate',
//         streamType: 'Engineering',
//         selectBranch: 'Mechanical',
//         aboutBranch: 'Focuses on mechanics, thermodynamics, and materials science.',
//         institution: institution._id,
//       },
//     ]);

//     console.log('Data seeded successfully');
//   } catch (error) {
//     console.error('Error seeding data:', error);
//   } finally {
//     await mongoose.disconnect();
//     console.log('MongoDB disconnected');
//   }
// };

// seedData();
import mongoose from "mongoose";

import Branch from "./models/Branch.js";
import Program from "./models/Program.js";
import Transaction from "./models/Transaction.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourDB";

async function seedDemoData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    /* ---------- 1. Seed Branches ---------- */
    const demoBranches = [
      { name: "Computer Science" },
      { name: "Electronics" },
      { name: "Mechanical" },
      { name: "Civil" },
    ];

    for (const branch of demoBranches) {
      await Branch.updateOne(
        { name: branch.name },
        { $setOnInsert: branch },
        { upsert: true }
      );
    }
    console.log("🌱 Branches seeded successfully");

    /* ---------- 2. Seed Programs ---------- */
    const demoPrograms = [
      {
        name: "Web Development Bootcamp",
        branch: "Computer Science",
        status: "Live",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-12-31"),
        leads: 15,
      },
      {
        name: "Robotics Workshop",
        branch: "Mechanical",
        status: "Inactive",
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-30"),
        leads: 5,
      },
      {
        name: "AI & Machine Learning",
        branch: "Electronics",
        status: "Live",
        startDate: new Date("2025-09-10"),
        endDate: new Date("2025-11-30"),
        leads: 22,
      },
    ];

    for (const program of demoPrograms) {
      await Program.updateOne(
        { name: program.name },
        { $setOnInsert: program },
        { upsert: true }
      );
    }
    console.log("🌱 Programs seeded successfully");

    /* ---------- 3. Seed Transactions ---------- */
    const demoTransactions = [
      {
        invoiceId: "INV-001",
        date: new Date("2025-09-01"),
        planType: "Monthly",
        amount: 499,
      },
      {
        invoiceId: "INV-002",
        date: new Date("2025-09-05"),
        planType: "Quarterly",
        amount: 1299,
      },
      {
        invoiceId: "INV-003",
        date: new Date("2025-09-10"),
        planType: "Yearly",
        amount: 4999,
      },
    ];

    for (const transaction of demoTransactions) {
      await Transaction.updateOne(
        { invoiceId: transaction.invoiceId },
        { $setOnInsert: transaction },
        { upsert: true }
      );
    }
    console.log("🌱 Transactions seeded successfully");

    console.log("✅ Demo data seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedDemoData();
