Job‑Verse – AI Career Hub
Job‑Verse is a full‑stack MERN web application that helps students and job‑seekers generate ATS‑friendly resumes, analyze their strengths, and practice interviews using AI‑powered tools.

Features
Resume Generator – Creates tailored, ATS‑friendly resumes from user input and job descriptions using AI.

Resume Checker / Analyzer – Evaluates resumes for skills, keywords, structure, and gives improvement feedback.

Worth Estimator – Estimates expected salary range based on profile and role.​

AI English / Interview Coach – Generates domain‑specific interview questions and simulates mock interviews.​

Dashboard UI – Modern card‑based dashboard with Job‑Verse branding and a custom favicon/logo.​

Tech Stack
Frontend: React, TypeScript (for main pages), modern UI components, CSS modules.​

Backend: Node.js, Express.js REST APIs.

Database: MongoDB Atlas with Mongoose models (User, Resume, Analysis, InterviewSession, etc.).​

AI Integration: OpenRouter Polaris‑Alpha model for text generation, analysis, and interview coaching.​

Project Structure
jobverse-backend/ – Express server, routes, controllers, MongoDB connection, AI integration.​

jobverse-career-hub-main/ – React frontend (dashboard, ResumeGenerator, ResumeChecker, WorthEstimator, AiEnglishCoach, InterviewCoach pages).​

public/ – Static assets such as favicon.ico and Job‑Verse logo.​

Getting Started
Backend setup

cd jobverse-backend

npm install

Create .env with MONGO_URI= and OPENROUTER_API_KEY= values.​

npm start (or node server.js / nodemon server.js).

Frontend setup

cd jobverse-career-hub-main

npm install

npm start and open http://localhost:3000.​

The frontend calls backend APIs such as /api/resumes/generate, /api/analyze-resume, and /api/english-coach over HTTP (default http://localhost:5000).​

ERD & DFD (High‑Level Design)
Entities: User, Resume, Analysis, InterviewQuestions, MockInterview, Admin with 1‑to‑many relationships between User and main feature entities.

Job‑Verse is a full‑stack MERN web application that helps students and job‑seekers generate ATS‑friendly resumes, analyze their strengths, and practice interviews using AI‑powered tools.

Features
Resume Generator – Creates tailored, ATS‑friendly resumes from user input and job descriptions using AI.

Resume Checker / Analyzer – Evaluates resumes for skills, keywords, structure, and gives improvement feedback.

Worth Estimator – Estimates expected salary range based on profile and role.​

AI English / Interview Coach – Generates domain‑specific interview questions and simulates mock interviews.​

Dashboard UI – Modern card‑based dashboard with Job‑Verse branding and a custom favicon/logo.​

Tech Stack
Frontend: React, TypeScript (for main pages), modern UI components, CSS modules.​

Backend: Node.js, Express.js REST APIs.

Database: MongoDB Atlas with Mongoose models (User, Resume, Analysis, InterviewSession, etc.).​

AI Integration: OpenRouter Polaris‑Alpha model for text generation, analysis, and interview coaching.​

Project Structure
jobverse-backend/ – Express server, routes, controllers, MongoDB connection, AI integration.​

jobverse-career-hub-main/ – React frontend (dashboard, ResumeGenerator, ResumeChecker, WorthEstimator, AiEnglishCoach, InterviewCoach pages).​

public/ – Static assets such as favicon.ico and Job‑Verse logo.​

Getting Started
Backend setup

cd jobverse-backend

npm install

Create .env with MONGO_URI= and OPENROUTER_API_KEY= values.​

npm start (or node server.js / nodemon server.js).

Frontend setup

cd jobverse-career-hub-main

npm install

npm start and open http://localhost:3000.​

The frontend calls backend APIs such as /api/resumes/generate, /api/analyze-resume, and /api/english-coach over HTTP (default http://localhost:5000).​



License
This project is for educational and portfolio purposes. Respect all third‑party API and service terms of use.​