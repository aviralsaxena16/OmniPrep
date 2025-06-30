# 🧠 OmniPrep Backend

Robust **Node.js + Express** backend for OmniPrep – a real-time AI-powered interview preparation platform. Integrates with **OmniDimension Voice AI** and **Clerk** for authentication and personalized feedback.

---

## 🚀 Features

* 🎤 **Real-Time Voice Analysis** – Integrates with OmniDimension AI for soft skill coaching
* 👤 **User Syncing** – Automatically stores new users on first login
* 📅 **Upcoming Interview Tracking** – Add, fetch, and mark interviews as completed
* 📈 **Progress Tracking** – Record user performance and improvement over time
* 📦 **Webhook Integration** – Store mock interview results via OmniDimension Webhook
* 🌐 **Security & Middleware** – Built-in validation, CORS, and logging

---

## ⚡ Quick Start

### 📦 Prerequisites

* Node.js **18+**
* MongoDB URI
* Clerk JWT Secret

### 🛠️ Installation

```bash
git clone https://github.com/yourusername/omniPrep.git
cd omniPrep/backend
```

```bash
npm install
```

```bash
cp .env.example .env
# Fill in Mongo URI and Clerk credentials
```

```bash
npm start
```

Runs at: [http://localhost:5000](http://localhost:5000)

---

### 📱 API Endpoints

### 👤 User Routes

| Method | Endpoint                           | Description                         |
| ------ | ---------------------------------- | ----------------------------------- |
| POST   | `/user/store-user`                 | Create or sync a user by email/name |
| POST   | `/user/upcoming-interviews`        | Add an upcoming interview           |
| GET    | `/user/upcoming-interviews?email=` | Fetch upcoming interviews           |
| PATCH  | `/user/mark-done`                  | Mark interview as completed         |

### 🧠 Interview Result Routes

| Method | Endpoint           | Description                                      |
| ------ | ------------------ | ------------------------------------------------ |
| GET    | `/results/:callId` | Get single result by `callId`                    |
| GET    | `/results`         | Get all interview results (admin use)            |
| POST   | `/results`         | Store new result via POST (internal use/webhook) |

### 🎤 OmniDimension Webhook

| Method | Endpoint                 | Description                                  |
| ------ | ------------------------ | -------------------------------------------- |
| POST   | `/webhook/omnidimension` | Receives voice agent's final analysis result |

---

### 🔐 Environment Variables

Create `.env` file:

```env
MONGO_URI=mongodb+srv://your-cluster
PORT=5000
```

---

### 📁 Project Structure

```bash
backend/
├── db.js               # MongoDB connection setup
├── index.js            # Main Express server
├── models/
│   └── User.js         # Mongoose user schema
├── routes/
│   ├── interview.js    # Interview result 
│   ├── store.js        # Result/session storage in-memory
│   ├── user.js         # User profile & interview tracking
│   └── webhook.js      # OmniDimension webhook handler
└── package.json        # Metadata and dependencies
```


### 💠 Dev Commands

| Script        | Description            |
| ------------- | ---------------------- |
| `npm start`   | Run in production mode |
| `npm run dev` | Run with nodemon (dev) |

---

### 📦 Deployment

Use **Render**, **Railway**, or **Heroku**:

* Set environment variables securely
* Use reverse proxy and SSL for production

---

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write clear commits and PR description

---
