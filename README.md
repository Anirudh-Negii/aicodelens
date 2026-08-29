# AI Code Lens

> Review Code. Build Better.

## Overview

AI Code Lens is an AI-powered code review application that analyzes your code and provides practical feedback on bugs, security vulnerabilities, performance issues, code quality, and potential improvements.

The application provides an interactive code editor where developers can submit their code and receive an AI-generated review along with improved code when applicable.

## Live Demo

[AI Code Lens](https://aicodelens.vercel.app)

## Features

- AI-powered code reviews
- Editable code editor with syntax highlighting
- Bug and logical issue detection
- Security vulnerability identification
- Performance and code-quality analysis
- Practical solutions for identified issues
- Improved code suggestions when applicable
- Copy improved code with one click
- Responsive user interface

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Simple Code Editor
- React Markdown

### Backend

- Node.js
- Express.js

### AI

- Google Gemini

## How the App Works

```text
User enters code
       ↓
React Code Editor
       ↓
POST /ai/get-review
       ↓
Express Backend
       ↓
AI Service
       ↓
Google Gemini
       ↓
AI-generated code review
       ↓
Backend response
       ↓
Review displayed in React
```

The frontend sends the submitted code to the Express backend through a POST request.

The backend passes the code to the Gemini model along with a system instruction that defines the AI as a senior code reviewer.

The generated response is returned to the frontend and rendered as formatted Markdown with syntax-highlighted code blocks.

## Project Structure

```text
AI-Code-Lens/
│
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── ai.controller.js
│   │   ├── routes/
│   │   │   └── ai.routes.js
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   └── app.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── Frontend/
    ├── src/
    │   ├── assets/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    ├── .env
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Anirudh-Negii/aicodelens.git
cd AI-Code-Lens
```

### 2. Setup the Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

Start the backend:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:3000
```

### 3. Setup the Frontend

Open another terminal:

```bash
cd Frontend
npm install
```

Create a `.env` file inside the `Frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Future Improvements

- **Review history** — Allow users to view and revisit their previous code reviews.
- **GitHub integration** — Enable developers to review code directly from GitHub repositories or pull requests.
- **Custom review preferences** — Allow users to focus reviews on specific areas such as security, performance, or code quality.
- **Authentication** — Add user accounts to provide personalized features such as saved reviews and review history.
