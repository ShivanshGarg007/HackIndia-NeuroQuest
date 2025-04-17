const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const aiService = require('../services/aiService');

// Submit quiz attempt
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid answers format' });
    }

    // Process answers and calculate stats
    const processedAnswers = await Promise.all(answers.map(async answer => {
      const question = await Question.findById(answer.questionId);
      if (!question) {
        throw new Error(`Question not found: ${answer.questionId}`);
      }

      const isCorrect = question.options.find(
        opt => opt._id.toString() === answer.selectedOptionId
      )?.isCorrect || false;

      return {
        question: question._id,
        userAnswer: answer.selectedOptionId,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    }));

    // Calculate quiz statistics
    const stats = {
      totalQuestions: processedAnswers.length,
      correctAnswers: processedAnswers.filter(a => a.isCorrect).length,
      totalTime: processedAnswers.reduce((sum, a) => sum + a.timeSpent, 0),
      accuracy: 0,
      averageTimePerQuestion: 0
    };

    // Calculate accuracy and average time
    stats.accuracy = (stats.correctAnswers / stats.totalQuestions) * 100;
    stats.averageTimePerQuestion = stats.totalTime / stats.totalQuestions;

    // Generate AI feedback
    const feedback = await aiService.generateFeedback(stats);

    // Calculate category performance
    const categoryPerformance = {};
    for (const answer of processedAnswers) {
      const question = await Question.findById(answer.question);
      const category = question.category;
      
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { correct: 0, total: 0 };
      }
      categoryPerformance[category].total += 1;
      if (answer.isCorrect) {
        categoryPerformance[category].correct += 1;
      }
    }

    const categories = Object.entries(categoryPerformance).map(([name, stats]) => ({
      name,
      accuracy: (stats.correct / stats.total) * 100
    }));

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      user: req.user._id,
      answers: processedAnswers,
      stats: {
        totalQuestions: stats.totalQuestions,
        correctAnswers: stats.correctAnswers,
        totalTime: stats.totalTime,
        accuracy: stats.accuracy,
        averageTimePerQuestion: stats.averageTimePerQuestion
      },
      feedback: {
        strengths: feedback.recommendations.filter((_, i) => i < 2),
        weaknesses: feedback.recommendations.filter((_, i) => i >= 2),
        suggestions: [feedback.nextSteps.action],
        aiGeneratedFeedback: JSON.stringify(feedback)
      },
      categories
    });

    // Update user stats
    req.user.stats.totalQuizzesTaken += 1;
    req.user.stats.averageAccuracy = 
      (req.user.stats.averageAccuracy * (req.user.stats.totalQuizzesTaken - 1) + stats.accuracy) / 
      req.user.stats.totalQuizzesTaken;
    await req.user.save();

    res.status(201).json({
      success: true,
      attempt: {
        id: attempt._id,
        stats,
        feedback,
        categories
      },
      userStats: req.user.stats
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ 
      error: 'Error submitting quiz',
      details: error.message 
    });
  }
});

// Get attempt history
router.get('/history', auth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('answers.question');
    
    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching attempt history' });
  }
});

// Test endpoint for AI feedback
router.post('/test-ai', auth, async (req, res) => {
  try {
    const testData = {
      accuracy: 75,
      correctAnswers: 15,
      totalQuestions: 20,
      averageTime: 30
    };

    const feedback = await aiService.generateQuizFeedback(testData);
    const pattern = await aiService.analyzeAnswerPattern([
      { isCorrect: true },
      { isCorrect: false },
      { isCorrect: true }
    ]);

    res.json({
      feedback,
      pattern,
      testData
    });
  } catch (error) {
    res.status(500).json({
      error: 'AI Service Error',
      details: error.message
    });
  }
});

module.exports = router;