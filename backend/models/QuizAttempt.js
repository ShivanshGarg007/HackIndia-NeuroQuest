const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  }
});

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  answers: [answerSchema],
  stats: {
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    totalTime: { type: Number, required: true }, // in seconds
    accuracy: { type: Number, required: true }, // percentage
    averageTimePerQuestion: { type: Number, required: true } // in seconds
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    aiGeneratedFeedback: { type: String }
  },
  categories: [{
    name: { type: String },
    accuracy: { type: Number }
  }]
}, {
  timestamps: true
});

quizAttemptSchema.index({ user: 1, createdAt: -1 });

quizAttemptSchema.methods.calculateStats = function() {
  const totalQuestions = this.answers.length;
  const correctAnswers = this.answers.filter(a => a.isCorrect).length;
  const totalTime = this.answers.reduce((sum, a) => sum + a.timeSpent, 0);

  this.stats = {
    totalQuestions,
    correctAnswers,
    totalTime,
    accuracy: (correctAnswers / totalQuestions) * 100,
    averageTimePerQuestion: totalTime / totalQuestions
  };
};

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;