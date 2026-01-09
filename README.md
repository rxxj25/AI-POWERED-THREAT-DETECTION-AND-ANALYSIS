# 🛡️ AI-Powered Threat Detection Dashboard

<div align="center">

![Threat Detection](https://img.shields.io/badge/AI-Threat%20Detection-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-teal?style=for-the-badge&logo=fastapi)
![Accuracy](https://img.shields.io/badge/Accuracy-99.78%25-success?style=for-the-badge)

**Real-time AI-powered network threat detection and analysis with premium dashboard**

[Live Demo](#-quick-start) • [Features](#-key-features) • [Installation](#-installation) • [Screenshots](#-screenshots)

</div>

---

## 🌟 Overview

A production-ready cybersecurity threat detection system powered by Machine Learning (Random Forest) that provides real-time network traffic analysis with an intuitive, premium dark-themed dashboard.

### ✨ Highlights

- 🤖 **99.78% Accuracy** - Random Forest ML model trained on KDD Cup '99 dataset
- 🎨 **Premium UI/UX** - Glassmorphism design with smooth animations
- 📊 **4 Complete Views** - Live Monitor, Analytics, Threat Log, Settings
- ⚡ **Real-time Analysis** - Live threat detection and visualization
- 🎯 **Production Ready** - Includes startup scripts and full documentation

---

## 🚀 Key Features

### 🔴 Live Monitoring Dashboard
- Real-time threat detection with visual status indicators
- Interactive traffic analysis charts with anomaly markers
- Live activity log with confidence scores
- Attack distribution visualization

### 📈 Analytics Dashboard
- 7-day historical trend analysis
- Attack type breakdown (DoS, Probe, R2L, U2R)
- Time-based attack distribution
- Performance metrics and insights
- Summary statistics with trends

### 🔍 Threat Log
- Comprehensive threat history table
- Search and filter by severity/type/IP
- Color-coded severity badges (Critical, High, Medium, Low)
- Confidence scores with progress bars
- Action status tracking (Blocked, Monitored, Logged)

### ⚙️ Settings Panel
- **Notifications** - Email alerts, sound notifications
- **Security** - Auto-block, traffic logging, data retention
- **Display** - Dark mode, animations, compact view
- **AI Model Config** - Confidence threshold, scan interval

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Scikit-learn** - Random Forest Classifier
- **Pandas** - Data processing
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Chart.js** - Data visualization
- **Lucide React** - Icon library
- **Vanilla CSS** - Custom glassmorphism styling

### Machine Learning
- **Algorithm**: Random Forest Classifier
- **Dataset**: KDD Cup '99 Network Intrusion Detection (25,192 records)
- **Features**: 41 network traffic features
- **Accuracy**: 99.78%

---

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- Git

### Quick Start (Recommended)

**Windows:**
```bash
# Clone the repository
git clone https://github.com/rxxj25/AI-POWERED-THREAT-DETECTION-AND-ANALYSIS.git
cd AI-POWERED-THREAT-DETECTION-AND-ANALYSIS

# Run the startup script (trains model, installs dependencies, starts servers)
start.bat
```

**Linux/Mac:**
```bash
# Clone the repository
git clone https://github.com/rxxj25/AI-POWERED-THREAT-DETECTION-AND-ANALYSIS.git
cd AI-POWERED-THREAT-DETECTION-AND-ANALYSIS

# Make script executable and run
chmod +x start.sh
./start.sh
```

**PowerShell:**
```powershell
.\start.ps1
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

### Manual Installation

<details>
<summary>Click to expand manual installation steps</summary>

#### 1. Train the ML Model
```bash
python train_saved_model.py
```

#### 2. Setup Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 3. Setup Frontend (in new terminal)
```bash
cd frontend
npm install
npm run dev
```

</details>

---

## 📸 Screenshots

### Live Monitoring Dashboard
![Dashboard](https://via.placeholder.com/800x400/1a1f3a/3b82f6?text=Real-time+Threat+Detection+Dashboard)

### Analytics View
![Analytics](https://via.placeholder.com/800x400/1a1f3a/8b5cf6?text=Historical+Analytics+%26+Trends)

### Threat Log
![Threat Log](https://via.placeholder.com/800x400/1a1f3a/ef4444?text=Comprehensive+Threat+History)

---

## 📁 Project Structure

```
AI-POWERED-THREAT-DETECTION-AND-ANALYSIS/
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── model_artifacts.pkg     # Serialized model
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Dashboard.jsx   # Live monitoring
│   │   │   ├── Analytics.jsx   # Analytics dashboard
│   │   │   ├── ThreatLog.jsx   # Threat history
│   │   │   ├── Settings.jsx    # Configuration
│   │   │   └── Sidebar.jsx     # Navigation
│   │   ├── App.jsx             # Main app
│   │   └── index.css           # Premium styling
│   └── package.json            # Node dependencies
├── Train_data.csv              # Training dataset
├── Test_data.csv               # Testing dataset
├── train_saved_model.py        # Model training script
├── start.bat                   # Windows startup script
├── start.sh                    # Linux/Mac startup script
└── start.ps1                   # PowerShell startup script
```

---

## 🎯 Usage

1. **Start Monitoring**: Click the "Start Monitoring" button on the dashboard
2. **View Real-time Threats**: Watch as the system detects and classifies network traffic
3. **Analyze Trends**: Navigate to Analytics for historical insights
4. **Review Threats**: Check Threat Log for detailed threat information
5. **Configure Settings**: Adjust system preferences in Settings panel

### Navigation
- **Live Monitor** - Real-time threat detection
- **Analytics** - Historical data and trends
- **Threat Log** - Comprehensive threat history
- **Settings** - System configuration

---

## 🔧 API Endpoints

### GET `/`
Returns system status and model accuracy

**Response:**
```json
{
  "status": "online",
  "model_accuracy": 99.78
}
```

### GET `/simulate`
Returns simulated network traffic data

**Response:**
```json
{
  "timestamp": "2026-01-09 12:30:45",
  "features": [...],
  "prediction": "Normal/Threat",
  "confidence": 98.5
}
```

### POST `/predict`
Classifies network traffic

**Request Body:**
```json
{
  "features": [...]
}
```

**Response:**
```json
{
  "prediction": "Normal/Threat",
  "confidence": 97.3
}
```

---

## 🎨 Design Features

- **Glassmorphism Effects** - Semi-transparent panels with backdrop blur
- **Gradient Backgrounds** - Multi-layered ambient glows
- **Smooth Animations** - 300-500ms cubic-bezier transitions
- **Premium Typography** - Inter font family
- **Responsive Design** - Clean layout that scales well
- **Color-coded Status** - Visual indicators for threat severity

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 📝 License

This project is created for educational and demonstration purposes.

---

## 👨‍💻 Author

**rxxj25**

GitHub: [@rxxj25](https://github.com/rxxj25)

---

## 🙏 Acknowledgments

- KDD Cup '99 dataset for training data
- FastAPI and React communities
- All open-source contributors

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ and Python

</div>
