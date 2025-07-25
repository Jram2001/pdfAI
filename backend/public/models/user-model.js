const mongoose = require("mongoose");
const { string, lowercase, date } = require("zod");

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    username: {
        type: string,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: string,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: string,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now
    next();
})
