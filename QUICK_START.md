# 🚀 Quick Start Guide

## Prerequisites
1. **MongoDB** - Install and start MongoDB on localhost:27017
2. **Node.js** - Version 16 or higher

## Setup Steps

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Start Development
```bash
# Option 1: Use the startup script
start-dev.bat

# Option 2: Manual start
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

## Default URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/agri_link

## Test the Migration
1. Open http://localhost:5173
2. Register a new user
3. Create an auction (if seller)
4. Check MongoDB for data

## Troubleshooting
- Ensure MongoDB is running
- Check console for errors
- Verify backend is accessible at localhost:5000