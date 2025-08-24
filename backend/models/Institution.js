const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: 'instituteType',
    collection: 'institutions',
    timestamps: true
};

const institutionSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Institution name is required.'],
        trim: true,
    },
    // instituteType: {
    //     type: String,
    //     required: [true, 'Institution type is required.'],
    //     enum: [
    //         'Kindergarten/childcare center',
    //         'School',
    //         'Intermediate college(K12)',
    //         'UG / PG University',
    //         'Coaching centers',
    //         'Study halls',
    //         'Study Abroad',
    //     ],
    // },
    establishmentDate: Date,
    approvedBy: String,
    
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InstituteAdmin',
        required: true,
        index: true, 
    }
}, baseOptions);

const Institution = mongoose.model('Institution', institutionSchema);

const kindergartenSchema = new mongoose.Schema({
    schoolType: {
        type: String,
        required: [true, 'School type is required for kindergarten.'],
        enum: ['Public', 'Private (For-profit)', 'Private (Non-profit)', 'International', 'Home - based'],
        trim: true
    },
    curriculumType: {
        type: String,
        required: [true, 'Curriculum type is required.'],
        trim: true,
        maxlength: [100, 'Curriculum type cannot exceed 100 characters.']
    },
    operationalTimes: {
        opening: { type: String, required: true },
        closing: { type: String, required: true }
    },
    operationalDays: {
        type: [String],
        required: true,
        enum: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
    },
    extendedCare: {
        type: Boolean,
        required: true,
        default: false
    },
    mealsProvided: {
        type: Boolean,
        required: true,
        default: false
    },
    outdoorPlayArea: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Kindergarten = Institution.discriminator('Kindergarten/childcare center', kindergartenSchema);

const coachingCenterSchema = new mongoose.Schema({
    tuitionHalls: [{
        hallName: {
            type: String,
            required: true,
            trim: true,
            default: 'Hall 1'
        },
        tuitionType: {
            type: String,
            required: true,
            enum:['Home Tuition', 'Center Tuition']
        },
        instructorProfile: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        totalSeats: {
            type: Number,
            required: true,
            min: 1
        },
        availableSeats: {
            type: Number, required: true, min: 0,
            validate: {
                validator: function(value) { return value <= this.totalSeats; },
                message: 'Available seats cannot exceed total seats.'
            }
        },
        operationalDays: {
            type: [String],
            required: true,
            enum: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
        },
        operationalTimes: {
            opening: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },
            closing: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }
        },
        priceOfSeat: { type: Number, required: true, min: 0 },
        image: { type: String, required: true }
    }]
});

const CoachingCenter = Institution.discriminator('Coaching centers', coachingCenterSchema);

const studyHallSchema = new mongoose.Schema({
    halls: [{
        hallName: {
            type: String,
            required: true,
            trim: true,
            default: 'Hall 1'
        },
        seatingOption: {
            type: String,
            required: true,
            enum: ['Dedicated Desk', 'Hot Desk', 'Private Cabin']
        },
        totalSeats: {
            type: Number,
            required: true,
            min: 1
        },
        availableSeats: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: function(value) { return value <= this.totalSeats; },
                message: 'Available seats cannot exceed total seats.'
            }
        },
        operationalDays: {
            type: [String],
            required: true,
            enum: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
        },
        operationalTimes: {
            opening: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },
            closing: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }
        },
        priceOfSeat: {
            type: Number,
            required: true,
            min: 0
        },
        image: {
            type: String,
            required: true
        },
        amenities: {
            wifi: { type: Boolean, default: false },
            chargingPoints: { type: Boolean, default: false },
            ac: { type: Boolean, default: false },
            personalLockers: { type: Boolean, default: false }
        }
    }]
});

const StudyHall = Institution.discriminator('Study halls', studyHallSchema);

const schoolAndIntermediateSchema = new mongoose.Schema({
    schoolType: { type: String, required: true, enum: ['Co-ed', 'Boys Only', 'Girls Only'] },
    schoolCategory: { type: String, required: true, enum: ['Public', 'Private', 'Charter', 'International'] },
    curriculumType: { type: String, required: true, enum: ['State Board', 'CBSE', 'ICSE', 'IB', 'IGCSE'] },
    operationalDays: { type: [String], required: true, enum: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'] },
    otherActivities: { type: String, trim: true, maxlength: [500, 'Activities description cannot exceed 500 characters.'] },
    hostelFacility: { type: Boolean, required: true, default: false },
    playground: { type: Boolean, required: true, default: false },
    busService: { type: Boolean, required: true, default: false }
});

const School = Institution.discriminator('School', schoolAndIntermediateSchema);
const IntermediateCollege = Institution.discriminator('Intermediate college(K12)', schoolAndIntermediateSchema);

const ugPgUniversitySchema = new mongoose.Schema({
    ownershipType: { type: String, required: true, enum: ['Government', 'Private', 'Public-Private Partnership'] },
    collegeCategory: { type: String, required: true, enum: ['Engineering', 'Medical', 'Arts & Science', 'Management', 'Law'] },
    affiliationType: { type: String, required: true, trim: true, maxlength: 100 },
    placements: {
        placementDrives: { type: Boolean, default: false },
        mockInterviews: { type: Boolean, default: false },
        resumeBuilding: { type: Boolean, default: false },
        linkedinOptimization: { type: Boolean, default: false },
        exclusiveJobPortal: { type: Boolean, default: false },
        certification: { type: Boolean, default: false }
    }
});
const UgPgUniversity = Institution.discriminator('UG / PG University', ugPgUniversitySchema);


module.exports = { 
    Institution, 
    Kindergarten, 
    CoachingCenter, 
    StudyHall,
    School,
    IntermediateCollege,
    UgPgUniversity 
};