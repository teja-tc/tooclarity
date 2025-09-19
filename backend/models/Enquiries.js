const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },

  institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution", required: true, index: true },

  programInterest: { type: String, required: true, trim: true },
  enquiryType: {
    type: String,
    enum: ["Requested for callback", "Requested for demo"],
    required: true,
  },

  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

}, { timestamps: true });

const Enquiries = mongoose.model("Enquiries", enquirySchema);
module.exports = Enquiries;
