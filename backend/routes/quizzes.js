const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');

// Get daily quiz questions
router.get('/daily', auth, async (req, res) => {
  try {
    // Get total count of questions
    const totalQuestions = await Question.countDocuments();
    
    // Get random questions
    const questions = await Question.aggregate([
      { $sample: { size: 3 } }
    ]);

    res.json({ 
      questions,
      metadata: {
        totalQuestionsInDB: totalQuestions,
        fetchedAt: new Date().toISOString(),
        isRandom: true,
        questionsReturned: questions.length
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get questions by difficulty
router.get('/daily/:difficulty', auth, async (req, res) => {
  try {
    const { difficulty } = req.params;
    const count = req.query.count || 3;

    const questions = await Question.aggregate([
      {
        $match: {
          difficulty: difficulty
        }
      },
      {
        $sample: { size: parseInt(count) }
      }
    ]);

    res.json({ questions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all categories
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Question.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get questions by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const count = req.query.count || 3;

    const questions = await Question.aggregate([
      {
        $match: {
          category: category
        }
      },
      {
        $sample: { size: parseInt(count) }
      }
    ]);

    res.json({ questions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get practice questions based on weak areas
router.get('/practice', auth, async (req, res) => {
  try {
    const { count = 5 } = req.query;
    const weakAreas = req.user.stats.weakAreas || [];

    const questions = await Question.aggregate([
      {
        $match: {
          category: { $in: weakAreas }
        }
      },
      {
        $sample: { size: parseInt(count) }
      }
    ]);

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add this route temporarily for debugging
router.get('/check', auth, async (req, res) => {
  try {
    const count = await Question.countDocuments();
    const sample = await Question.find().limit(1);
    res.json({
      questionCount: count,
      sampleQuestion: sample,
      mongoURI: process.env.MONGODB_URI.split('@')[1] // Only show the non-sensitive part
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;