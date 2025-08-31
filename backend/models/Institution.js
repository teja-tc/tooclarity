const mongoose = require("mongoose");

const baseOptions = {
  discriminatorKey: "instituteType",
  collection: "institutions",
  timestamps: true,
};

const institutionSchema = new mongoose.Schema(
  {
    instituteName: {
      type: String,
      required: [true, "Institution name is required."],
      trim: true,
    },
    instituteType: {
      type: String,
      required: [true, "Institution type is required."],
      enum: [
        "Kindergarten/childcare center",
        "School's",
        "Intermediate college(K12)",
        "Under Graduation/Post Graduation",
        "Coaching centers",
        "Study Halls",
        "Tution Center's",
        "Study Abroad",
      ],
    },
    establishmentDate: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: String,
      trim: true,
    },
    contactInfo: {
      type: String,
      trim: true,
    },
    additionalContactInfo: {
      type: String,
      trim: true,
    },
    headquartersAddress: {
      type: String,
      required: [true, "Headquarter address is required."],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    locationURL: {
      type: String,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstituteAdmin",
      required: true,
      index: true,
    },
  },
  baseOptions
);

const Institution = mongoose.model("Institution", institutionSchema);

const kindergartenSchema = new mongoose.Schema({
  schoolType: {
    type: String,
    required: [true, "School type is required for kindergarten."],
    enum: [
      "Public",
      "Private (For-profit)",
      "Private (Non-profit)",
      "International",
      "Home - based",
    ],
    trim: true,
    default: "",
  },
  curriculumType: {
    type: String,
    required: [true, "Curriculum type is required."],
    trim: true,
    maxlength: [100, "Curriculum type cannot exceed 100 characters."],
    default: "",
  },
  // operationalTimes: {
  //   opening: { type: String, required: true },
  //   closing: { type: String, required: true },
  // },
  closingTime: { type: String, default: "" },
  openingTime: { type: String, default: "" },
  operationalDays: {
    type: [String],
    required: true,
    enum: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
    default: [],
  },
  extendedCare: {
    type: Boolean,
    required: true,
    default: false,
  },
  mealsProvided: {
    type: Boolean,
    required: true,
    default: false,
  },
  outdoorPlayArea: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Kindergarten = Institution.discriminator(
  "Kindergarten/childcare center",
  kindergartenSchema
);

const coachingCenterSchema = new mongoose.Schema({
  placementDrives: { type: Boolean, default: false },
  mockInterviews: { type: Boolean, default: false },
  resumeBuilding: { type: Boolean, default: false },
  linkedinOptimization: { type: Boolean, default: false },
  exclusiveJobPortal: { type: Boolean, default: false },
  certification: { type: Boolean, default: false },
});


const CoachingCenter = Institution.discriminator(
  "Coaching centers",
  coachingCenterSchema
);

const studyHallSchema = new mongoose.Schema({
      hallName: {
        type: String,
        required: true,
        trim: true,
        default: "Hall 1",
      },
      seatingOption: {
        type: String,
        required: true,
        enum: ["Dedicated Desk", "Hot Desk", "Private Cabin"],
        default: "",
      },
      totalSeats: {
        type: Number,
        required: true,
        min: 1,
        default: "",
      },
      availableSeats: {
        type: Number,
        required: true,
        min: 0,
        validate: {
          validator: function (value) {
            return value <= this.totalSeats;
          },
          message: "Available seats cannot exceed total seats.",
        },
        default: "",
      },
      operationalDays: {
        type: [String],
        required: true,
        enum: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
        default: [],
      },
      // operationalTimes: {
      //   opening: {
      //     type: String,
      //     required: true,
      //     match: /^([01]\d|2[0-3]):([0-5]\d)$/,
      //   },
      //   closing: {
      //     type: String,
      //     required: true,
      //     match: /^([01]\d|2[0-3]):([0-5]\d)$/,
      //   },
      // },
      closingTime: { type: String, default: "" },
      openingTime: { type: String, default: "" },
      priceOfSeat: {
        type: Number,
        required: true,
        min: 0,
        default: "",
      },
      image: {
        type: String,
        required: true,
        default: "",
      },
      amenities: {
        wifi: { type: Boolean, default: false },
        chargingPoints: { type: Boolean, default: false },
        ac: { type: Boolean, default: false },
        personalLockers: { type: Boolean, default: false },
      },
    },
  );

const StudyHall = Institution.discriminator("Study Halls", studyHallSchema);

const schoolAndIntermediateSchema = new mongoose.Schema({
  schoolType: {
    type: String,
    required: true,
    enum: ["Co-ed", "Boys Only", "Girls Only"],
    default: "",
  },
  schoolCategory: {
    type: String,
    required: true,
    enum: ["Public", "Private", "Charter", "International"],
    default: "",
  },
  curriculumType: {
    type: String,
    required: true,
    enum: ["State Board", "CBSE", "ICSE", "IB", "IGCSE"],
    default: "",
  },
  operationalDays: {
    type: [String],
    required: true,
    enum: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
    default: [],
  },
  otherActivities: {
    type: String,
    trim: true,
    maxlength: [500, "Activities description cannot exceed 500 characters."],
    default: "",
  },
  hostelFacility: { type: Boolean, required: true, default: false },
  playground: { type: Boolean, required: true, default: false },
  busService: { type: Boolean, required: true, default: false },
});

const School = Institution.discriminator(
  "School's",
  schoolAndIntermediateSchema
);
const IntermediateCollege = Institution.discriminator(
  "Intermediate college(K12)",
  schoolAndIntermediateSchema
);

const ugPgUniversitySchema = new mongoose.Schema({
  ownershipType: {
    type: String,
    required: true,
    enum: ["Government", "Private", "Public-Private Partnership"],
    default: "",
  },
  collegeCategory: {
    type: String,
    required: true,
    enum: ["Engineering", "Medical", "Arts & Science", "Management", "Law"],
    default: "",
  },
  affiliationType: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    default: "",
  },
  placements: {
    placementDrives: { type: Boolean, default: false },
    mockInterviews: { type: Boolean, default: false },
    resumeBuilding: { type: Boolean, default: false },
    linkedinOptimization: { type: Boolean, default: false },
    exclusiveJobPortal: { type: Boolean, default: false },
    certification: { type: Boolean, default: false },
  },
});
const UgPgUniversity = Institution.discriminator(
  "Under Graduation/Post Graduation",
  ugPgUniversitySchema
);

module.exports = {
  Institution,
  Kindergarten,
  CoachingCenter,
  StudyHall,
  School,
  IntermediateCollege,
  UgPgUniversity,
};
