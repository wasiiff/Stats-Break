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
| Hosting / Deployment | Vercel |
| Others | RTK Query |

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
