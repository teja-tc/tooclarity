const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Institution name is required.'],
        trim: true,
    },
    instituteType: {
        type: String,
        required: [true, 'Institution type is required.'],
        enum: [
            'Kindergarten/childcare center',
            'School',
            'Intermediate college(K12)',
            'UG / PG University',
            'Coaching centers',
            'Study halls',
            'Study Abroad',
        ],
    },
    establishmentDate: Date,
    approvedBy: String,

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InstituteAdmin',
        required: true,
        index: true, 
    }
}, { timestamps: true });

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;