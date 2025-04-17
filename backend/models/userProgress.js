const mongoose = require("mongoose")

const userProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    lastTestScore: { type: Number, min: 0, max: 100 },
    timeSpent: { type: Number, default: 0 }, // in minutes
    lastSectionCompleted: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    updatedAt: { type: Date, default: Date.now }
  })

  module.exports = mongoose.model('userProgress', userProgressSchema);