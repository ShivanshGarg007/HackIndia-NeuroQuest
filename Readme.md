# NeuroQuest

A MERN stack application for adaptive learning and performance tracking.

## Project Structure
```
neuroquest/
├── backend/           # Express.js server
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   ├── services/     # External services (AI, etc.)
│   └── config/       # Configuration files
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd frontend
   npm install
   ```
3. Set up environment variables:
   - Create `.env` in backend directory
   - Add MongoDB connection string
   - Add OpenAI API key

4. Start the application:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm start
   ```

## Features
- Daily quizzes with performance tracking
- Real-time progress monitoring
- AI-powered performance analysis
- Personalized feedback
- Interactive analytics dashboard

## Tech Stack
- MongoDB: Database
- Express.js: Backend framework
- React: Frontend framework
- Node.js: Runtime environment
- OpenAI API: AI-powered feedback