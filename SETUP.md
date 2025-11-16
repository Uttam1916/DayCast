# 🚀 DayCast - Setup & Running Guide

## Quick Start

### 1️⃣ Prerequisites

Before you start, make sure you have:

- **Node.js v14+** - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local: `brew install mongodb-community` (macOS) or `apt-get install mongodb` (Linux)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **API Keys** (free):
  - [OpenWeatherMap](https://openweathermap.org/api) - Get free API key

### 2️⃣ Clone & Install

```bash
# Clone repository
git clone https://github.com/Uttam1916/DayCast.git
cd DayCast

# Install all dependencies
npm run install-all
```

### 3️⃣ Configure Environment Variables

#### Server Setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
# Server Port
PORT=4000
NODE_ENV=development

# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/daycast

# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daycast?retryWrites=true&w=majority

# Get from https://openweathermap.org/api
OWM_KEY=your_openweathermap_api_key_here

# Any random string (change in production!)
JWT_SECRET=super_secret_key_change_this_in_production
```

#### Client Setup (Optional)

```bash
cd ../client
cp .env.example .env
```

`client/.env` is optional - defaults to `http://localhost:4000/api`

### 4️⃣ Running the App

#### Option A: Run Both Servers Together (Recommended)

```bash
# From project root
npm run dev
```

This starts:
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5️⃣ Access the App

Open your browser:
```
http://localhost:5173
```

## 📝 How to Use

### Creating Your First Task

1. Click **+ New Task**
2. Enter task details:
   - **Title**: "Morning Run" (required)
   - **Description**: Optional details
   - **Date & Time**: When you want to do it
   - **Outdoor?**: Toggle if weather-dependent
   - **Location**: City or lat,lon (required for outdoor)
   - **Reminder**: Minutes before (default: 60)
3. Click **Save**

### Understanding Weather Suitability

For outdoor tasks, the AI will evaluate weather:

| Score | Suitability | What It Means |
|-------|-------------|---------------|
| ≥ 20 | 🟢 Good | Great conditions for the activity |
| -20 to 20 | 🟡 Maybe | Acceptable, may be uncomfortable |
| < -20 | 🔴 Bad | Poor conditions, not recommended |
| - | ⚪ Unknown | Insufficient data or indoor task |

**Evaluation factors:**
- Temperature range (5-30°C default)
- Wind speed
- Precipitation chance
- Severe weather detection

### Offline Support

✅ All tasks saved locally first  
✅ Automatic sync when back online  
✅ Unsynced tasks marked with indicator  
✅ Periodic retry on connection restore

## 🐛 Troubleshooting

### "MongoDB connection failed"

**Solution:**
```bash
# Make sure MongoDB is running
# Local MongoDB:
brew services start mongodb-community  # macOS

# OR check your Atlas connection string
# MONGODB_URI should look like:
# mongodb+srv://user:pass@cluster.mongodb.net/daycast?retryWrites=true&w=majority
```

### "Weather not showing / API Error"

**Check:**
1. OWM_KEY is set in `server/.env`
2. Free tier allows 60 calls/minute
3. Location format is correct (city name or lat,lon)
4. No typos in API key

### "Weather data missing / Weather API failing"

**Check:**
1. OWM_KEY is set in `.env`
2. API key is active and not rate-limited
3. Location format is correct (city name or lat,lon)
4. No typos in API key

### "Suggestions not showing / Generic evaluation"

**Note:** AI evaluation currently uses heuristic scoring (rule-based evaluation based on weather conditions and task preferences)

### "Frontend not loading / Blank page"

**Solution:**
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (macOS)

# Check browser console for errors (F12)
# Ensure backend is running on port 4000
```

### "Cannot connect to backend"

**Solution:**
```bash
# Check if backend is running
curl http://localhost:4000/

# Should respond with:
# {"ok":true,"msg":"DayCast - Weather-aware Daily Planner"}

# Check CORS configuration in server/src/index.js
# Should allow requests from http://localhost:5173
```

## 📊 Development Workflow

### Backend Development

```bash
cd server
npm run dev
```

- Watches for file changes automatically (nodemon)
- Server restarts on code changes
- API runs on `http://localhost:4000`

### Frontend Development

```bash
cd client
npm run dev
```

- Hot Module Replacement (HMR) enabled
- Auto-refresh on file changes
- Dev server on `http://localhost:5173`

### Building for Production

```bash
# Build frontend
npm run client:build

# Output in client/dist/
# Deploy this folder to your hosting
```

## 🔌 API Endpoints

### Tasks
```
POST   /api/tasks          - Create task
GET    /api/tasks          - List all tasks
POST   /api/tasks/:id/evaluate - Re-evaluate task
```

### Weather
```
GET    /api/weather?lat=X&lon=Y&dt=timestamp
```

### Auth (optional)
```
POST   /api/auth/register  - Sign up
POST   /api/auth/login     - Sign in
```

## 📁 Project Structure

```
DayCast/
├── server/                  # Node.js/Express backend
│   ├── src/
│   │   ├── index.js         # Server entry point
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # MongoDB schemas
│   │   ├── controllers/     # Business logic
│   │   └── utils/           # Helper functions
│   ├── .env.example
│   └── package.json
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.jsx          # Root component
│   │   ├── pages/           # Page components
│   │   ├── components/      # UI components
│   │   ├── api/             # API calls
│   │   └── utils/           # Helpers
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

## 📝 Notes

- The app uses **LocalStorage** for client-side persistence
- **MongoDB** stores tasks server-side
- **OpenWeatherMap** provides free weather data (60 calls/min limit)
- **OpenAI GPT-4o-mini** provides AI evaluation (paid API)
- Browser **Notifications API** for reminders

## 🆘 Need Help?

- Check [README.md](./README.md) for feature overview
- Review error messages in browser console (F12)
- Check server logs in terminal
- Check MongoDB connection logs

## 🎯 Next Steps

1. Customize weather preferences in `TaskModal.jsx`
2. Add user authentication (optional)
3. Deploy to production (Vercel, Heroku, etc.)
4. Set up CI/CD pipeline
5. Add more weather integration features

Happy planning! 🌤️
