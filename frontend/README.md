# 🎯 OmniPrep Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</div>

<br />

<div align="center">
  <h3>🧠 Voice-driven interview preparation platform with real-time AI feedback</h3>
  <p>A responsive and dynamic React.js + Vite frontend built for OmniPrep</p>
</div>

---

## ✨ Features

| Feature                              | Description                                          |
| ------------------------------------ | ---------------------------------------------------- |
| 🎤 **Mock Interview Sessions**       | Real-time mock interviews with OmniDimension Voice AI  |
| **🧪 Practice Section** | Practice communication skills and get voice-based feedback                |
| **💼 Job Search**               | Explore job listings and prepare accordingly  |
|**📅 Interview Management**      | Add, track, and mark interviews as complete  |
| **🔐 Clerk Authentication**  | Secure login & JWT-based session management           |
| **📈 Interview Reports**            | Post-interview summaries and improvement suggestions|
| **📊 User Stats**            | Track average confidence, practice sessions, mock interviews taken|
---

## 🚀 Quick Start

### 📋 Prerequisites

* Node.js **18+**
* Clerk project with frontend API key

### 🛠️ Installation

```bash
cd VoiceMirror/frontend
```

```bash
npm install
# or
yarn install
```

```bash
npm run dev
# or
yarn dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 📁 Folder Structure

```bash
frontend/
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── eslint.config.js
└── src/
    ├── App.css
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── pages/
    │   ├── HomePage.jsx
    │   ├── JobSearch.jsx
    │   ├── LandingPage.jsx
    │   ├── Mockinterview.jsx
    │   ├── MockInterviewResult.jsx
    │   ├── PractiseSection.jsx
    │   ├── UpcomingInterview.jsx
    │   ├── VoiceAgent.jsx
    │   └── VoiceAgent2.jsx
    └── routes/
        └── ProtectedRoute.jsx
```

---

## 🔐 Environment Variables

Create a `.env` file in `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key
```

---

## 🔧 Scripts

| Script            | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start dev server with Vite |
| `npm run build`   | Build production assets    |
| `npm run preview` | Preview built app          |
| `npm run lint`    | Run ESLint checks          |

---

## 🧠 Tech Stack

| Technology   | Purpose                |
| ------------ | ---------------------- |
| React        | UI library             |
| Vite         | Dev server and bundler |
| Tailwind CSS | Styling                |
| Clerk        | Authentication         |
| Axios        | API requests           |
| React Router | Routing                |

---

## 🧑‍💻 Development Tips

* Wrap private pages using `ProtectedRoute.jsx`
* Use `useUser()` from Clerk for auth-based access
* All API requests hit `VITE_BACKEND_URL`
* Use state management via React hooks
---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Write clean code & meaningful commits
4. Push and open a PR

