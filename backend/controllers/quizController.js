const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');

exports.getDailyQuiz = async (req, res, next) => {
  try {
    const { difficulty = req.user.preferences.difficulty, count = 5 } = req.query;
    const questions = await Question.aggregate([
      { $match: { difficulty } },
      { $sample: { size: parseInt(count) } }
    ]);
    res.json({ questions });
  } catch (error) {
    next(error);
  }
};

// Add other quiz controller methods...
