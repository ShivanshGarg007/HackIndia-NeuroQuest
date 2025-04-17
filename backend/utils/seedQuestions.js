const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

const sampleQuestions = [
    {
        text: "What is the primary function of neurons in the nervous system?",
        type: "multiple-choice",
        options: [
            { text: "To transmit electrical and chemical signals", isCorrect: true },
            { text: "To produce hormones", isCorrect: false },
            { text: "To filter blood", isCorrect: false },
            { text: "To store memories", isCorrect: false }
        ],
        explanation: "Neurons are specialized cells that transmit electrical and chemical signals throughout the nervous system.",
        category: "neuroscience",
        difficulty: "beginner",
        tags: ["neurons", "basics"]
    },
    {
        text: "Which part of the brain is responsible for memory formation?",
        type: "multiple-choice",
        options: [
            { text: "Hippocampus", isCorrect: true },
            { text: "Cerebellum", isCorrect: false },
            { text: "Medulla", isCorrect: false },
            { text: "Thalamus", isCorrect: false }
        ],
        explanation: "The hippocampus plays a crucial role in forming, organizing, and storing memories.",
        category: "neuroscience",
        difficulty: "beginner",
        tags: ["brain", "memory"]
    },
    {
        text: "What is the blood-brain barrier?",
        type: "multiple-choice",
        options: [
            { text: "A selective membrane that protects the brain", isCorrect: true },
            { text: "A type of blood cell", isCorrect: false },
            { text: "A brain structure", isCorrect: false },
            { text: "A type of neurotransmitter", isCorrect: false }
        ],
        explanation: "The blood-brain barrier is a protective membrane that selectively filters substances entering the brain.",
        category: "neuroscience",
        difficulty: "beginner",
        tags: ["anatomy", "protection"]
    },
    {
        text: "Which neurotransmitter is often associated with pleasure and reward?",
        type: "multiple-choice",
        options: [
            { text: "Dopamine", isCorrect: true },
            { text: "Serotonin", isCorrect: false },
            { text: "GABA", isCorrect: false },
            { text: "Acetylcholine", isCorrect: false }
        ],
        explanation: "Dopamine is a key neurotransmitter in the reward pathway of the brain.",
        category: "neuroscience",
        difficulty: "beginner",
        tags: ["neurotransmitters", "reward"]
    },
    {
        text: "What is the main function of the cerebellum?",
        type: "multiple-choice",
        options: [
            { text: "Balance and coordination", isCorrect: true },
            { text: "Memory formation", isCorrect: false },
            { text: "Vision processing", isCorrect: false },
            { text: "Language processing", isCorrect: false }
        ],
        explanation: "The cerebellum is primarily responsible for balance, posture, and coordination of movement.",
        category: "neuroscience",
        difficulty: "beginner",
        tags: ["brain", "anatomy"]
    },
    {
        text: "Which brain wave pattern is associated with deep sleep?",
        type: "multiple-choice",
        options: [
            { text: "Delta waves", isCorrect: true },
            { text: "Alpha waves", isCorrect: false },
            { text: "Beta waves", isCorrect: false },
            { text: "Gamma waves", isCorrect: false }
        ],
        explanation: "Delta waves are slow brain waves that occur during deep, dreamless sleep.",
        category: "neuroscience",
        difficulty: "beginner",
        tags: ["brain waves", "sleep"]
    },
    {
        text: "What is the primary role of the myelin sheath?",
        type: "multiple-choice",
        options: [
            { text: "To protect neurons from toxins", isCorrect: false },
            { text: "To insulate axons and increase signal transmission speed", isCorrect: true },
            { text: "To produce neurotransmitters", isCorrect: false },
            { text: "To connect neurons to blood vessels", isCorrect: false }
        ],
        explanation: "The myelin sheath insulates axons, allowing electrical impulses to transmit quickly and efficiently along nerve cells.",
        category: "neuroscience",
        difficulty: "beginner",
        tags: ["myelin", "nervous system"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Clear existing questions
        await Question.deleteMany({});
        console.log('Cleared existing questions...');

        // Insert new questions
        await Question.insertMany(sampleQuestions);
        console.log('Sample questions inserted successfully!');

        await mongoose.connection.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
