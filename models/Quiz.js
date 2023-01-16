const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    difficulty: {
        type: Number,
        max: 5,
        min: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date,
    },
    questions: {
        type: [Object],
        required: true,
    },
    usersWhoPlayed: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
        required: true,
    },
    results: {
        type: [Object],
        default: {},
        required: true,
    }
});

module.exports = mongoose.models.Quiz || mongoose.model("Quiz", userSchema);
