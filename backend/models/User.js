const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  stats: {
    totalQuizzesTaken: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    averageTimePerQuestion: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastQuizDate: { type: Date },
    weakAreas: [{ type: String }]
  },
  preferences: {
    dailyGoal: { type: Number, default: 5 },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    categories: [{ type: String }]
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;