const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OpenAI = require('openai');
const QuizAttempt = require('../models/QuizAttempt');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate feedback for a quiz attempt
router.post('/generate/:attemptId', auth, async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user._id
    }).populate('answers.question');

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    // Prepare data for AI analysis
    const performanceData = {
      accuracy: attempt.stats.accuracy,
      averageTime: attempt.stats.averageTimePerQuestion,
      categoryPerformance: attempt.categories,
      questions: attempt.answers.map(answer => ({
        category: answer.question.category,
        isCorrect: answer.isCorrect,
        timeSpent: answer.timeSpent,
        difficulty: answer.question.difficulty
      }))
    };

    // Generate AI feedback
    const prompt = `As an educational AI assistant, analyze this quiz performance data and provide specific, actionable feedback:

Performance Summary:
- Overall Accuracy: ${performanceData.accuracy}%
- Average Time per Question: ${performanceData.averageTime} seconds
- Category Performance: ${performanceData.categoryPerformance.map(cat => 
  `${cat.name}: ${cat.accuracy}%`).join(', ')}

Please provide:
1. Strengths (what the student did well)
2. Areas for improvement
3. Specific study recommendations
4. Time management advice if needed
5. Suggested practice areas

Format the response in JSON with these keys: strengths, weaknesses, recommendations, timeManagement, practiceAreas`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500
    });

    const feedback = JSON.parse(completion.choices[0].message.content);

    // Update attempt with AI feedback
    attempt.feedback = {
      strengths: feedback.strengths,
      weaknesses: feedback.weaknesses,
      suggestions: feedback.recommendations,
      aiGeneratedFeedback: completion.choices[0].message.content
    };

    await attempt.save();

    res.json({ feedback: attempt.feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feedback history
router.get('/history', auth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const attempts = await QuizAttempt.find({ 
      user: req.user._id,
      'feedback.aiGeneratedFeedback': { $exists: true }
    })
    .select('feedback stats categories createdAt')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json({ feedback: attempts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;