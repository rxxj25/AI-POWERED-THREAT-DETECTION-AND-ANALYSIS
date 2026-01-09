#!/bin/bash
# Bash script to start both backend and frontend

echo "========================================"
echo "  AI Threat Detection Dashboard Startup"
echo "========================================"
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if model exists, if not train it
if [ ! -f "saved_model.pkl" ]; then
    echo -e "${YELLOW}[1/4] Training ML model...${NC}"
    python train_saved_model.py
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Model training failed!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Model trained successfully!${NC}"
else
    echo -e "${GREEN}[1/4] Model already trained ✓${NC}"
fi

# Check backend dependencies
echo -e "${YELLOW}[2/4] Checking backend dependencies...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null || true
pip install -q -r requirements.txt
echo -e "${GREEN}✓ Backend ready!${NC}"

# Check frontend dependencies
echo -e "${YELLOW}[3/4] Checking frontend dependencies...${NC}"
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi
echo -e "${GREEN}✓ Frontend ready!${NC}"
cd ..

echo ""
echo -e "${YELLOW}[4/4] Starting servers...${NC}"
echo ""
echo -e "${GREEN}Backend:  http://localhost:8000${NC}"
echo -e "${GREEN}Frontend: http://localhost:5173${NC}"
echo ""
echo -e "${CYAN}Press Ctrl+C to stop both servers${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✓ Servers stopped${NC}"
    exit 0
}

# Set trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Start backend
cd backend
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null || true
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
