const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const instituteAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
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
    designation: {
        type: String,
        required: [true, 'Designation is required.'],
        trim: true,
    },
    linkedinUrl: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['INSTITUTE_ADMIN', 'ADMIN', 'STUDENT'],
        required: true,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
    },
    isEmailVerified:{
        type:Boolean,
        default:false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    // role:{
    //     type:String,
    //     enum:['INSTITUTE_ADMIN','ADMIN','STUDENT'],
    //     // default:'INSTITUTE_ADMIN',
    //     required:true
    // },
    isPaymentDone:{
        type:Boolean,
        default:false
    },
    isProfileCompleted:{
        type:Boolean,
        default:false
    }
}, { timestamps: true});

instituteAdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

instituteAdminSchema.methods.comparePassword = async function(candidatePassword) { 
    return await bcrypt.compare(candidatePassword, this.password);
}

const InstituteAdmin = mongoose.model('InstituteAdmin', instituteAdminSchema);

module.exports = InstituteAdmin;