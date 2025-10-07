# Stats-Break 🎯

[Live Demo](https://cric-stat-ai-ui.vercel.app/)  

**Stats-Break** is an AI-powered chatbot that delivers cricket statistics in both **text** and **table** formats. Built using **TypeScript**, **NestJS**, **MongoDB**, and integrates with the **Gemini API** for AI responses.

---

## 📌 Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture & Components](#architecture--components)  
- [Getting Started](#getting-started)  
  - Prerequisites  
  - Installation  
  - Environment Variables  
  - Running Locally  
- [Usage](#usage)  
- [Deploying](#deploying)  
- [Contributing](#contributing)  
- [License](#license)  
- [Acknowledgments](#acknowledgments)  

---

## 🛠️ Features

- AI chatbot interface for cricket stats queries  
- Presents results in readable text and structured tables  
- Supports searching for players, matches, teams, etc.  
- Backend built with NestJS + MongoDB  
- Uses Gemini API key for AI responses  
- Easily extendable for new stats or data sources  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Next.js / React (TypeScript) |
| Backend | NestJS (TypeScript) |
| Database | MongoDB |
| AI / Language Model | Gemini API |
| Hosting / Deployment | Vercel (frontend), (your backend host) |
| Others | Axios / Fetch, Express (Nest under the hood) |

---

## 🏗 Architecture & Components

- **Frontend (client/)**  
  - Chat UI to send user queries  
  - Displays responses as text or tables  
  - Connects via HTTP API to backend  

- **Backend (server/)**  
  - API endpoint receives queries  
  - Fetches relevant cricket data from database or external sources  
  - Sends prompt to Gemini API + formatting logic  
  - Returns structured JSON for frontend to render  

- **Database (MongoDB)**  
  - Stores players, match stats, teams, cached results, etc.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Node.js (v16+ recommended)  
- npm or yarn  
- MongoDB instance (local or cloud)  
- Gemini API key  

### Installation

Clone the repo:

```bash
git clone https://github.com/wasiiff/Stats-Break.git
cd Stats-Break
Install dependencies (both frontend & backend):

bash

cd client
npm install
cd ../server
npm install
Environment Variables
Create .env (or .env.local) files for frontend & backend. Example:

Backend .env

text
MONGO_URI=mongodb+srv://...your_mongo_uri...
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=4000
Frontend .env.local

text

NEXT_PUBLIC_API_URL=http://localhost:4000/api
Run Locally
In separate terminals:

bash
# Run backend
cd server
npm run start:dev

# Run frontend
cd client
npm run dev
Open browser at http://localhost:3000

⚙ Usage
Type cricket-related queries in the chat box (e.g. “Sachin Tendulkar batting avg”, “India vs Pakistan 2023 stats”)

The AI will respond with text, and if applicable, present a table of stats

Use the UI’s formatting to copy or export results

📦 Deploying
Deploy backend to a server (e.g. DigitalOcean, AWS, Heroku)

Set environment variables on the server (Mongo URI, Gemini key)

Build and deploy frontend via Vercel (you already have live link)

Point NEXT_PUBLIC_API_URL to your deployed backend

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/xyz)

Commit your changes (git commit -m "Add xyz feature")

Push (git push origin feature/xyz)

Open a Pull Request

Please follow the existing code style and include tests when relevant.

📄 License
This project is licensed under the MIT License. See LICENSE for detail
