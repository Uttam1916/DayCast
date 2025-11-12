# 🌤️ DayCast - Weather-Aware Daily Planner

A MERN stack web application that combines task planning with weather integration and AI-powered activity recommendations. Plan your outdoor activities with confidence by checking real-time weather conditions and getting AI-based suitability scores.

## ✨ Features

- **Task Management**: Create, view, and manage daily tasks with intuitive calendar interface
- **Weather Integration**: Real-time weather data from OpenWeatherMap API
- **AI Recommendations**: GPT-powered activity suitability scoring based on weather conditions
- **Location Support**: Search locations by name or precise lat/lon coordinates
- **Reminders**: Browser-based notifications for upcoming tasks
- **Local-First Design**: Full offline support with automatic sync when online
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, date-fns, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **APIs**: OpenWeatherMap (weather data), OpenAI (AI evaluation)
- **Storage**: MongoDB (persistent), LocalStorage (client-side)

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas connection string)
- **API Keys**:
  - [OpenWeatherMap API](https://openweathermap.org/api) - Free tier available
  - [OpenAI API](https://platform.openai.com/api-keys) - For GPT-4o-mini

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Uttam1916/DayCast.git
cd DayCast
```

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
# - MONGODB_URI: MongoDB connection string
# - OWM_KEY: OpenWeatherMap API key
# - OPENAI_API_KEY: OpenAI API key
# - JWT_SECRET: Any random string for JWT signing

# Start the server
npm run dev
```

The backend will start on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd client
npm install

# Create .env file (optional)
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173` and proxy API calls to `http://localhost:4000`

## 📖 Usage Guide

### Creating a Task

1. Click **+ New Task** button
2. Enter task title and optional description
3. Select date and time
4. Check "Outdoor activity?" if weather-dependent
5. For outdoor tasks, enter location (city name or lat,lon)
6. Set reminder time (default: 60 minutes before)
7. Click **Save**

### Understanding Weather Suitability

The app evaluates activity suitability based on:
- **Temperature Range**: Customizable min/max preferences
- **Precipitation**: Optional avoidance of rainy weather
- **Wind Speed**: Maximum acceptable wind conditions
- **Severe Weather**: Detection of thunderstorms/extreme conditions

Scores displayed as:
- 🟢 **Good**: Excellent conditions (score ≥ 20)
- 🟡 **Maybe**: Neutral conditions (-20 ≤ score < 20)
- 🔴 **Bad**: Poor conditions (score < -20)
- ⚪ **Unknown/N/A**: Indoor tasks or insufficient data

### Offline Support

- All tasks are saved locally first
- They automatically sync when you come back online
- Unsaved tasks show an indicator and retry periodically

## 🔧 API Routes

### Tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - List all tasks
- `POST /api/tasks/:id/evaluate` - Re-evaluate task weather suitability

### Weather
- `GET /api/weather?lat=X&lon=Y&dt=timestamp` - Get forecast data

### Authentication (Optional)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## 📁 Project Structure

```
DayCast/
├── server/
│   └── src/
│       ├── index.js                 # Express server entry
│       ├── config/
│       │   └── db.js               # MongoDB connection
│       ├── controllers/
│       │   └── ai.js               # AI evaluation logic
│       ├── middleware/
│       │   └── auth.js             # JWT authentication
│       ├── models/
│       │   ├── Task.js             # Task schema
│       │   └── User.js             # User schema
│       ├── routes/
│       │   ├── auth.js             # Auth endpoints
│       │   ├── tasks.js            # Task endpoints
│       │   └── weather.js          # Weather endpoints
│       └── utils/
│           ├── weather.js          # Weather API & geocoding
│           └── evaluate.js         # Heuristic evaluation
├── client/
│   └── src/
│       ├── App.jsx                 # Root component
│       ├── main.jsx                # Entry point
│       ├── styles.css              # Global styles
│       ├── api/
│       │   └── tasks.js            # API client
│       ├── components/
│       │   ├── Calendar.jsx        # Calendar view
│       │   ├── TaskCard.jsx        # Task display
│       │   ├── TaskList.jsx        # Task list
│       │   └── TaskModal.jsx       # Create task form
│       ├── hooks/
│       │   └── useLocalTasks.js    # Local storage hook
│       ├── pages/
│       │   └── Dashboard.jsx       # Main page
│       └── utils/
│           └── notify.js           # Browser notifications
└── README.md
```

## 🔐 Environment Variables

### Server (.env)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/daycast
OWM_KEY=your_openweathermap_key
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_secret_key
```

### Client (.env, optional)
```
VITE_API_BASE=http://localhost:4000/api
```

## 🐛 Troubleshooting

### Tasks not syncing
- Check browser console for errors
- Ensure backend is running on port 4000
- Verify MongoDB connection
- Check that API keys are properly set

### Weather not showing
- Confirm OWM_KEY is set in server .env
- Verify location format (city name or lat,lon)
- Check rate limits (free tier: 60 calls/min)

### AI evaluation failing
- Ensure OPENAI_API_KEY is configured
- Check OpenAI API quota and billing
- The app will fall back to heuristic evaluation if AI fails

## 📝 License

MIT License - See LICENSE file for details

## 👤 Author

[Uttam K R](https://github.com/Uttam1916)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🚀 Future Enhancements

- [ ] User authentication system
- [ ] Task sharing and collaboration
- [ ] Weather alerts and warnings
- [ ] Multi-location support
- [ ] Mobile app (React Native)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Recurring tasks
- [ ] Analytics dashboard
