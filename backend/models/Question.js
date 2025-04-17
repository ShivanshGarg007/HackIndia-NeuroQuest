const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'open-ended'],
    required: true
  },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  explanation: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  tags: [{
    type: String,
    index: true
  }],
  stats: {
    timesAnswered: { type: Number, default: 0 },
    timesCorrect: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
    difficultyRating: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

questionSchema.virtual('successRate').get(function() {
  return this.stats.timesAnswered > 0 
    ? (this.stats.timesCorrect / this.stats.timesAnswered) * 100 
    : 0;
});

questionSchema.index({ category: 1, difficulty: 1, 'stats.difficultyRating': 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;