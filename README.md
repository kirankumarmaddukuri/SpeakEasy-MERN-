# 🌍 SpeakEasy - Interactive Language Learning Platform

A modern, full-stack MERN application for learning multiple languages through interactive lessons, daily challenges, flashcards, and storytelling.

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Features
- **Multi-language Support** - Learn Spanish, French, German, Japanese, Italian, Portuguese, and more
- **Interactive Lessons** - Structured lessons with quizzes and progress tracking
- **Daily Challenges** - Fresh challenges every day with bonus points
- **Practice Mode** - Free-form practice sessions to reinforce learning
- **Flashcards** - Spaced repetition system for vocabulary retention
- **Story-based Learning** - Learn through engaging narratives

### 👤 User Features
- **User Authentication** - Secure JWT-based authentication
- **Progress Tracking** - Track lessons completed, scores, and achievements
- **Streak System** - Maintain daily learning streaks
- **Achievement Badges** - Unlock achievements as you progress
- **Customizable Profiles** - Avatar selection and personalization
- **Dark Mode** - Eye-friendly dark theme support

### 📊 Analytics
- **Learning History** - View your progress over time
- **Weekly Statistics** - Track lessons and points earned
- **Performance Metrics** - Monitor accuracy and improvement

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **Context API** - State management
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt.js** - Password hashing

### DevOps
- **nodemon** - Auto-restart development server
- **express-validator** - Request validation
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
SpeakEasy/
├── frontend/                 # React frontend application
│   ├── components/          # React components
│   │   ├── Dashboard.jsx
│   │   ├── DailyChallenge.jsx
│   │   ├── LessonView.jsx
│   │   ├── PracticeMode.jsx
│   │   ├── Flashcards.jsx
│   │   └── ...
│   ├── context/            # React Context providers
│   │   ├── AppContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/               # Static data (languages, lessons, stories)
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.jsx            # Main App component
│   └── package.json
│
├── server/                  # Node.js backend
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── progressController.js
│   │   └── challengeController.js
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Progress.js
│   │   ├── DailyChallenge.js
│   │   └── Story.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── progress.js
│   │   └── challenges.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js
│   ├── config/           # Configuration files
│   │   └── db.js
│   ├── server.js         # Entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kirankumarmaddukuri/SpeakEasy-MERN-.git
   cd SpeakEasy-MERN-
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/speakeasy
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/speakeasy
   
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/speakeasy` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `PORT` | Port for backend server | `5000` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| GET | `/auth/logout` | Logout user | ✅ |

### Progress Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/progress` | Get user progress | ✅ |
| POST | `/progress/lesson` | Save lesson completion | ✅ |
| GET | `/progress/weekly` | Get weekly stats | ✅ |
| POST | `/progress/flashcard` | Save flashcard progress | ✅ |
| POST | `/progress/story` | Save story completion | ✅ |
| POST | `/progress/practice` | Save practice session | ✅ |

### Challenge Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/challenges/daily` | Get daily challenge | ✅ |
| POST | `/challenges/daily` | Submit challenge | ✅ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PUT | `/users/profile` | Update profile | ✅ |
| PUT | `/users/language` | Update current language | ✅ |
| PUT | `/users/onboarding` | Complete onboarding | ✅ |
| GET | `/users/stats` | Get user statistics | ✅ |
| POST | `/users/achievements` | Unlock achievement | ✅ |

**📄 For detailed API documentation with request/response examples, see [API_DOCS.md](./API_DOCS.md)**

---

## 🗄 Database Schema

### Collections

#### 1. `users`
Stores user accounts, authentication, and progress data.

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  currentLanguage: String,
  languages: [{ code, name, flag, totalScore, completedLessons }],
  totalPoints: Number,
  streak: Number,
  lastActiveDate: Date,
  achievements: [String],
  dailyChallenges: [{ date, completed, score, bonusPoints }],
  flashcardProgress: [{ language, knownCards, learningCards }],
  completedStories: [{ storyId, completedAt }],
  practiceSessions: [{ language, questionsAnswered, correctAnswers, date }]
}
```

#### 2. `progresses`
Individual progress records for lessons and exercises.

```javascript
{
  user: ObjectId (ref: User),
  language: String,
  lessonId: String,
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  passed: Boolean,
  date: Date
}
```

#### 3. `dailychallenges`
Daily challenge questions (created automatically daily).

```javascript
{
  date: String (YYYY-MM-DD),
  questions: [{
    language: String,
    question: String,
    options: [String],
    correctAnswer: Number (index),
    type: String
  }],
  createdAt: Date
}
```

#### 4. `stories` (Optional)
Story content for story-based learning (currently frontend-only).


## 🧪 Testing

### Backend API Testing

Use **Postman** or **Thunder Client** to test API endpoints.

**Quick test sequence:**
```bash
# 1. Register
POST http://localhost:5000/api/auth/register
Body: { "name": "Test", "email": "test@test.com", "password": "123456" }

# 2. Login
POST http://localhost:5000/api/auth/login
Body: { "email": "test@test.com", "password": "123456" }

# 3. Get Profile (use token from login)
GET http://localhost:5000/api/auth/me
Header: Authorization: Bearer {token}
```



---



<div align="center">
  
**Made with ❤️ by Kiran Kumar**

⭐ Star this repo if you found it helpful!

</div>
