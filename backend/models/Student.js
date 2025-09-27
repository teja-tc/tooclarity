const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        trim: true,
        required: true,
    },
    studentEmail: {
        type: String,
        trim: true,
        required: true,
    },
    studentPhone: {
        type: String,
        trim: true,
        required: true,
    },
     /*       document size increases more than 16MB 
      enquiries: [{
        programInterest: { type: String, required: true, trim: true },
        enquiryType: { type: String, enum: ["Requested for callback", "Requested for demo"], required: true },
        createdAt: { type: Date, default: Date.now }
      }]*/
    studentAddress: {
        type: String,
        trim: true,
        required: true,
    },
    // Relation
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        required: true,
        index: true,
      },
    // all enquiries that this student made IDs will be stored in this array
  enquiries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Enquiries" }],
},{timestamps:true});

const Student = mongoose.model("Student",studentSchema);
module.exports = Student;