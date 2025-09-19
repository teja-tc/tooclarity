const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        trim: true,
        required: true,
    },
    customerEmail: {
        type: String,
        trim: true,
        required: true,
    },
    customerPhone: {
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
    customerAddress: {
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
    // all enquiries that this customer made IDs will be stored in this array
  enquiries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Enquiries" }],
},{timestamps:true});

const Customer = mongoose.model("Customer",customerSchema);
module.exports = Customer;