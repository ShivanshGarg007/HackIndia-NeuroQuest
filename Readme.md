# 🧠 NeuroQuest

**NeuroQuest** is an AI-powered quiz web application built with the **MERN stack** (MongoDB, Express, React, Node.js). It helps users learn neuroscience through dynamic, multiple-choice quizzes. NeuroQuest integrates artificial intelligence to generate custom questions, adapt to user performance, and provide a smarter, more personalized learning experience.

---

## 🌟 Key Features

- 🤖 **AI-Generated Questions**: NeuroQuest uses AI (e.g., OpenAI API) to create high-quality neuroscience questions dynamically.
- 🧠 **Neuroscience Focus**: Covers key neuroscience concepts, terminology, and brain anatomy.
- 📊 **User Progress Tracking** *(in progress)*: Tracks correct answers, topics, and learning progress.
- 📈 **Smart Difficulty Scaling** *(planned)*: AI will adapt the difficulty of questions based on user performance.
- 🔄 **Dynamic Content Seeding**: Backend can auto-generate and seed new questions using an AI prompt.

---

## 🛠 Tech Stack

| Layer       | Technology              |
|-------------|--------------------------|
| Frontend    | React, Tailwind CSS      |
| Backend     | Node.js, Express         |
| Database    | MongoDB                  |
| AI Engine   | OpenAI API (or similar)  |

---

## 🔌 How AI Is Integrated

- **Dynamic Question Generation**  
  When the database needs new content, AI is prompted with neuroscience topics to generate question-answer-choice sets automatically.

- **Quiz Personalization** *(planned)*  
  AI will be used to adapt quizzes to the user's weak areas and learning style, delivering a more efficient study session.

- **Question Clarity Check** *(optional)*  
  AI may also validate and clarify questions for better readability and correctness.

---

## 📦 Project Structure

```
NeuroQuest/
├── client/               # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── server/               # Node + Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ai/               # AI logic & prompt handling
├── .env
└── README.md
```

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neuroquest.git
   cd neuroquest
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**

   Create a `.env` file in `server/`:
   ```
   MONGO_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   ```

5. **Run the App**
   ```bash
   # Backend
   npm run dev

   # Frontend
   cd ../client
   npm run dev
   ```

---

## 🔮 Future Plans

- Personalized quiz sessions based on user profile
- Timed quiz mode
- Admin dashboard to approve/edit AI-generated content
- Mobile app version
- GPT-powered explanations for answers

---

## 🤝 Contributing

We welcome contributions! Feel free to open issues, suggest features, or fork the repo and make a PR.

---

## 📄 License

MIT License

---
