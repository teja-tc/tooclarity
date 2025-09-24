const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  studentEmail: { type: String, required: true, trim: true },
  studentPhone: { type: String, required: true, trim: true },

  institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution", required: true, index: true },

  programInterest: { type: String, required: true, trim: true },
  enquiryType: {
    type: String,
    enum: ["Requested for callback", "Requested for demo"],
    required: true,
  },

  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },

}, { timestamps: true });

const Enquiries = mongoose.model("Enquiries", enquirySchema);
module.exports = Enquiries;
