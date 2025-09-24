// models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: 8,
        select: false,
    },
    contactNumber: {
        type: String,
        match: [/^\d{10}$/, 'Contact number must be 10 digits'],
        trim: true,
        required: [true, 'Contact number is required']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);