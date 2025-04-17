const Question = require('../models/Question');
const sampleQuestions = require('../data/questions.json');

const seedQuestions = async () => {
  try {
    await Question.deleteMany();
    await Question.insertMany(sampleQuestions);
    console.log('Questions seeded successfully');
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
};

module.exports = { seedQuestions };
