const OpenAI = require('openai');

class FeedbackService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateFeedback(quizAttempt, userStats) {
    try {
      const prompt = this.createPrompt(quizAttempt, userStats);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert neuroscience tutor providing personalized feedback on quiz performance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI feedback:', error);
      throw error;
    }
  }

  createPrompt(quizAttempt, userStats) {
    const correctAnswers = quizAttempt.answers.filter(a => a.isCorrect).length;
    const totalQuestions = quizAttempt.answers.length;
    const accuracy = (correctAnswers / totalQuestions) * 100;

    return `
      Analyze this quiz performance and provide personalized feedback:

      Quiz Performance:
      - Accuracy: ${accuracy}%
      - Total Questions: ${totalQuestions}
      - Correct Answers: ${correctAnswers}
      - Average Time per Question: ${quizAttempt.stats.averageTimePerQuestion} seconds

      Questions Performance:
      ${quizAttempt.answers.map(answer => `
        - Category: ${answer.question.category}
        - Correct: ${answer.isCorrect}
        - Time Taken: ${answer.timeSpent} seconds
      `).join('\n')}

      User History:
      - Total Quizzes Taken: ${userStats.totalQuizzesTaken}
      - Average Accuracy: ${userStats.averageAccuracy}%
      - Weak Areas: ${userStats.weakAreas.join(', ')}

      Please provide:
      1. Analysis of performance
      2. Specific strengths
      3. Areas for improvement
      4. Study recommendations
      5. Time management advice if needed
    `;
  }
}

module.exports = new FeedbackService();
