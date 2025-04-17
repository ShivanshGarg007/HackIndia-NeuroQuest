// services/aiService.js
const { HfInference } = require('@huggingface/inference');

class AIService {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async generateFeedback(quizData) {
    try {
      // Calculate performance metrics
      const performanceLevel = this.analyzePerformanceLevel(quizData);
      
      // Generate structured feedback
      return {
        performance: this.getPerformanceFeedback(quizData),
        recommendations: this.getRecommendations(quizData),
        nextSteps: this.getNextSteps(quizData)
      };
    } catch (error) {
      console.error('Feedback Generation Error:', error);
      return this.getFallbackFeedback(quizData);
    }
  }

  analyzePerformanceLevel(quizData) {
    const { accuracy } = quizData;
    if (accuracy >= 90) return 'excellent';
    if (accuracy >= 80) return 'very good';
    if (accuracy >= 70) return 'good';
    if (accuracy >= 60) return 'fair';
    return 'needs improvement';
  }

  getPerformanceFeedback(quizData) {
    const level = this.analyzePerformanceLevel(quizData);
    const feedback = {
      level,
      score: quizData.accuracy,
      correctAnswers: quizData.correctAnswers,
      totalQuestions: quizData.totalQuestions,
      message: this.getPerformanceMessage(level, quizData)
    };

    return feedback;
  }

  getPerformanceMessage(level, quizData) {
    const messages = {
      excellent: `Outstanding! You scored ${quizData.accuracy}% with ${quizData.correctAnswers} correct answers out of ${quizData.totalQuestions}.`,
      'very good': `Great work! You scored ${quizData.accuracy}% with ${quizData.correctAnswers} correct answers out of ${quizData.totalQuestions}.`,
      good: `Good job! You scored ${quizData.accuracy}% with ${quizData.correctAnswers} correct answers out of ${quizData.totalQuestions}.`,
      fair: `You're making progress. You scored ${quizData.accuracy}% with ${quizData.correctAnswers} correct answers out of ${quizData.totalQuestions}.`,
      'needs improvement': `Keep practicing! You scored ${quizData.accuracy}% with ${quizData.correctAnswers} correct answers out of ${quizData.totalQuestions}.`
    };
    return messages[level] || messages['fair'];
  }

  getRecommendations(quizData) {
    const level = this.analyzePerformanceLevel(quizData);
    
    const recommendations = {
      excellent: [
        'Challenge yourself with more advanced topics',
        'Try questions with shorter time limits',
        'Help others understand difficult concepts'
      ],
      'very good': [
        'Focus on the few questions you missed',
        'Practice more complex scenarios',
        'Review advanced concepts'
      ],
      good: [
        'Review the questions you missed',
        'Practice similar questions more',
        'Focus on understanding core concepts'
      ],
      fair: [
        'Focus on basic concepts first',
        'Take more practice quizzes',
        'Spend more time on each question'
      ],
      'needs improvement': [
        'Review fundamental concepts',
        'Start with easier questions',
        'Consider using additional study resources'
      ]
    };

    return recommendations[level] || recommendations['fair'];
  }

  getNextSteps(quizData) {
    const level = this.analyzePerformanceLevel(quizData);
    
    const nextSteps = {
      excellent: {
        action: 'Advance to next level',
        suggestedTopics: ['Advanced concepts', 'Complex problem-solving', 'Teaching others'],
        practiceCount: 5
      },
      'very good': {
        action: 'Reinforce and advance',
        suggestedTopics: ['Missed concepts', 'Advanced applications', 'Time management'],
        practiceCount: 7
      },
      good: {
        action: 'Practice and improve',
        suggestedTopics: ['Core concepts', 'Problem areas', 'Timed practice'],
        practiceCount: 10
      },
      fair: {
        action: 'Review and practice',
        suggestedTopics: ['Basic concepts', 'Fundamental principles', 'Practice exercises'],
        practiceCount: 12
      },
      'needs improvement': {
        action: 'Focus on basics',
        suggestedTopics: ['Foundational concepts', 'Basic principles', 'Simple exercises'],
        practiceCount: 15
      }
    };

    return nextSteps[level] || nextSteps['fair'];
  }

  getFallbackFeedback(quizData) {
    return {
      performance: this.getPerformanceFeedback(quizData),
      recommendations: [
        'Continue practicing regularly',
        'Review incorrect answers',
        'Focus on understanding core concepts'
      ],
      nextSteps: {
        action: 'Practice more',
        suggestedTopics: ['Review basics', 'Core concepts'],
        practiceCount: 10
      }
    };
  }

  async analyzeAnswerPattern(answers) {
    try {
      // Calculate pattern metrics
      const total = answers.length;
      const correct = answers.filter(a => a.isCorrect).length;
      const streaks = this.findStreaks(answers);

      return {
        accuracy: (correct / total) * 100,
        longestCorrectStreak: streaks.correct,
        longestIncorrectStreak: streaks.incorrect,
        pattern: this.determinePattern(answers),
        consistency: this.calculateConsistency(answers)
      };
    } catch (error) {
      console.error('Pattern Analysis Error:', error);
      return {
        error: 'Unable to analyze pattern',
        basicStats: {
          total: answers.length,
          correct: answers.filter(a => a.isCorrect).length
        }
      };
    }
  }

  findStreaks(answers) {
    let currentCorrect = 0;
    let currentIncorrect = 0;
    let maxCorrect = 0;
    let maxIncorrect = 0;

    answers.forEach(answer => {
      if (answer.isCorrect) {
        currentCorrect++;
        currentIncorrect = 0;
        maxCorrect = Math.max(maxCorrect, currentCorrect);
      } else {
        currentIncorrect++;
        currentCorrect = 0;
        maxIncorrect = Math.max(maxIncorrect, currentIncorrect);
      }
    });

    return { correct: maxCorrect, incorrect: maxIncorrect };
  }

  determinePattern(answers) {
    const pattern = answers.map(a => a.isCorrect ? 1 : 0);
    const improving = this.isImproving(pattern);
    const consistent = this.isConsistent(pattern);

    if (improving) return 'Improving';
    if (consistent) return 'Consistent';
    return 'Variable';
  }

  isImproving(pattern) {
    const firstHalf = pattern.slice(0, pattern.length / 2);
    const secondHalf = pattern.slice(pattern.length / 2);
    const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    return secondHalfAvg > firstHalfAvg;
  }

  isConsistent(pattern) {
    const avg = pattern.reduce((a, b) => a + b, 0) / pattern.length;
    const variance = pattern.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / pattern.length;
    return variance < 0.25; // Threshold for consistency
  }

  calculateConsistency(answers) {
    const pattern = answers.map(a => a.isCorrect ? 1 : 0);
    const avg = pattern.reduce((a, b) => a + b, 0) / pattern.length;
    const variance = pattern.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / pattern.length;
    
    if (variance < 0.1) return 'Very Consistent';
    if (variance < 0.25) return 'Consistent';
    if (variance < 0.4) return 'Somewhat Consistent';
    return 'Inconsistent';
  }

  async analyzeQuestionResponse(question, selectedOptionId, timeSpent) {
    try {
      // Get the selected option and correct option
      const selectedOption = question.options.find(opt => opt._id.toString() === selectedOptionId);
      const correctOption = question.options.find(opt => opt.isCorrect);
      
      // Analyze the response
      const isCorrect = selectedOption?.isCorrect || false;
      const conceptUnderstanding = this.analyzeConceptUnderstanding(
        question,
        selectedOption,
        correctOption
      );

      // Generate specific feedback
      return {
        questionAnalysis: {
          topic: question.category,
          concept: question.text,
          isCorrect,
          timeSpent,
          understanding: conceptUnderstanding.level,
          suggestion: conceptUnderstanding.suggestion,
          explanation: this.generateExplanation(question, selectedOption, correctOption),
          relatedTopics: this.getRelatedTopics(question.category, question.tags),
          practiceRecommendation: this.getPracticeRecommendation(
            question.category,
            question.difficulty,
            isCorrect
          )
        }
      };
    } catch (error) {
      console.error('Question Analysis Error:', error);
      return this.getFallbackQuestionAnalysis(question, selectedOptionId);
    }
  }

  analyzeConceptUnderstanding(question, selectedOption, correctOption) {
    if (!selectedOption) {
      return {
        level: 'unknown',
        suggestion: 'Please provide a valid answer choice.'
      };
    }

    if (selectedOption.isCorrect) {
      return {
        level: 'good',
        suggestion: `Excellent understanding of ${question.category}. Consider exploring more advanced topics in this area.`
      };
    }

    // Analyze the difference between selected and correct answer
    return this.generateMisconceptionFeedback(question, selectedOption, correctOption);
  }

  generateMisconceptionFeedback(question, selectedOption, correctOption) {
    // Map common misconceptions based on wrong answer choices
    const misconceptions = {
      neuroscience: {
        neurons: {
          function: "Review the basic functions of neurons, focusing on signal transmission.",
          structure: "Study the structural components of neurons and their specific roles.",
          types: "Learn about different types of neurons and their specialized functions."
        },
        brain: {
          anatomy: "Focus on brain anatomy and the functions of different regions.",
          physiology: "Study brain physiology and how different parts work together.",
          pathways: "Review neural pathways and information flow in the brain."
        }
      }
    };

    const category = question.category.toLowerCase();
    const tags = question.tags.map(tag => tag.toLowerCase());

    let feedback = {
      level: 'needs_improvement',
      suggestion: `Review ${question.category} fundamentals, particularly regarding ${question.tags.join(', ')}.`
    };

    // Get specific misconception feedback if available
    for (const tag of tags) {
      if (misconceptions[category]?.[tag]) {
        feedback.suggestion = misconceptions[category][tag];
        break;
      }
    }

    return feedback;
  }

  generateExplanation(question, selectedOption, correctOption) {
    if (!selectedOption) {
      return "No answer was selected. Make sure to choose an answer for each question.";
    }

    if (selectedOption.isCorrect) {
      return `Correct! ${question.explanation} This demonstrates good understanding of ${question.category}.`;
    }

    return `
      The correct answer was: "${correctOption.text}"
      
      ${question.explanation}
      
      Your answer "${selectedOption.text}" is incorrect because:
      ${this.getSpecificMisconceptionExplanation(question, selectedOption, correctOption)}
      
      Key points to remember:
      ${this.getKeyPoints(question)}
    `;
  }

  getSpecificMisconceptionExplanation(question, selectedOption, correctOption) {
    // Add specific explanations based on common misconceptions
    const misconceptionMap = {
      neurons: {
        "To produce hormones": "Neurons primarily transmit signals; hormone production is mainly done by endocrine cells.",
        "To filter blood": "Blood filtration is done by the kidneys; neurons are specialized for signal transmission.",
        "To store memories": "While neurons are involved in memory, their primary function is signal transmission."
      },
      "brain anatomy": {
        "Cerebellum": "The cerebellum is primarily involved in motor control and balance.",
        "Medulla": "The medulla controls automatic functions like breathing and heart rate.",
        "Thalamus": "The thalamus is a relay station for sensory and motor signals."
      }
    };

    // Try to find a specific explanation
    for (const tag of question.tags) {
      if (misconceptionMap[tag]?.[selectedOption.text]) {
        return misconceptionMap[tag][selectedOption.text];
      }
    }

    // Default explanation if no specific one is found
    return `The answer you chose suggests a common misconception about ${question.category}. 
            Review the fundamental concepts and pay attention to ${question.tags.join(', ')}.`;
  }

  getKeyPoints(question) {
    const keyPoints = {
      neuroscience: {
        neurons: [
          "Neurons are specialized cells for signal transmission",
          "They have distinct structural components (dendrites, axon, cell body)",
          "They communicate through electrical and chemical signals"
        ],
        "brain anatomy": [
          "Different brain regions have specialized functions",
          "Brain regions work together in networks",
          "Structure relates directly to function"
        ]
      }
    };

    const category = question.category.toLowerCase();
    const relevantPoints = question.tags
      .map(tag => keyPoints[category]?.[tag])
      .filter(points => points)
      .flat();

    return relevantPoints.length > 0
      ? relevantPoints.map(point => `• ${point}`).join('\n')
      : `• Focus on understanding the core concepts of ${question.category}
         • Review the relationship between different components
         • Practice similar questions to reinforce understanding`;
  }

  getRelatedTopics(category, tags) {
    const relatedTopicsMap = {
      neuroscience: {
        neurons: [
          "Neurotransmitters",
          "Action Potentials",
          "Synaptic Transmission"
        ],
        "brain anatomy": [
          "Neural Circuits",
          "Brain Development",
          "Neuroplasticity"
        ]
      }
    };

    const relatedTopics = new Set();
    tags.forEach(tag => {
      const topics = relatedTopicsMap[category.toLowerCase()]?.[tag] || [];
      topics.forEach(topic => relatedTopics.add(topic));
    });

    return Array.from(relatedTopics);
  }

  getPracticeRecommendation(category, difficulty, isCorrect) {
    if (isCorrect) {
      return {
        nextDifficulty: this.getNextDifficulty(difficulty),
        focusAreas: [`Advanced ${category} concepts`, 'Application-based questions'],
        recommendedCount: 5
      };
    }

    return {
      nextDifficulty: difficulty,
      focusAreas: [`${category} fundamentals`, 'Basic concept questions'],
      recommendedCount: 10
    };
  }

  getNextDifficulty(currentDifficulty) {
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = difficulties.indexOf(currentDifficulty);
    return currentIndex < difficulties.length - 1 
      ? difficulties[currentIndex + 1] 
      : currentDifficulty;
  }

  getFallbackQuestionAnalysis(question, selectedOptionId) {
    const selectedOption = question.options.find(opt => opt._id.toString() === selectedOptionId);
    const isCorrect = selectedOption?.isCorrect || false;

    return {
      questionAnalysis: {
        topic: question.category,
        concept: question.text,
        isCorrect,
        understanding: isCorrect ? 'good' : 'needs_improvement',
        suggestion: isCorrect 
          ? `Good understanding of ${question.category}` 
          : `Review the concepts related to ${question.category}`,
        explanation: question.explanation,
        relatedTopics: [`Basic ${question.category}`],
        practiceRecommendation: {
          nextDifficulty: question.difficulty,
          focusAreas: [`${question.category} fundamentals`],
          recommendedCount: isCorrect ? 5 : 10
        }
      }
    };
  }
}

module.exports = new AIService();