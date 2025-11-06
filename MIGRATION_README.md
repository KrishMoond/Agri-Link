# 🔄 Firebase to MongoDB Migration Guide

## Migration Complete! ✅

Your Agri-Link application has been successfully migrated from Firebase to MongoDB localhost.

## 🗂️ What Changed

### Backend (NEW)
- **Node.js/Express** server with MongoDB
- **JWT Authentication** instead of Firebase Auth
- **REST API** endpoints for all operations
- **Mongoose** for MongoDB object modeling

### Frontend (UPDATED)
- Removed Firebase dependencies
- Added **Axios** for API calls
- Updated authentication to use **localStorage**
- Modified all services to use REST APIs

## 🚀 Setup Instructions

### 1. Install MongoDB
```bash
# Download and install MongoDB Community Server
# Start MongoDB service on localhost:27017
```

### 2. Setup Backend
```bash
# Run the setup script
setup-backend.bat

# OR manually:
cd backend
npm install
```

### 3. Start Services
```bash
# Terminal 1: Start MongoDB (if not running as service)
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
npm run dev
```

## 📊 Database Structure

### Collections
- **users**: User profiles and authentication
- **auctions**: Auction listings and bids

### Environment Variables (.env)
```
MONGODB_URI=mongodb://localhost:27017/agri_link
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID

### Auctions
- `POST /api/auctions` - Create auction
- `GET /api/auctions/active` - Get active auctions
- `GET /api/auctions/seller/:id` - Get seller's auctions
- `POST /api/auctions/:id/bid` - Place bid
- `DELETE /api/auctions/:id` - Delete auction

## 🔐 Authentication Flow

1. User registers/logs in via API
2. Server returns JWT token
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes

## 📝 Key Changes Made

### Removed Files
- `.firebaserc`
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`

### Updated Files
- `src/configs/firebase.ts` → API configuration
- `src/services/` → All services use REST APIs
- `components/auth/` → Updated authentication
- `package.json` → Removed Firebase dependencies

### New Files
- `backend/` → Complete Node.js backend
- `src/configs/api.ts` → Axios configuration
- `src/services/authService.ts` → Authentication service

## 🎯 Benefits of Migration

- **Full Control**: Own your data and infrastructure
- **Cost Effective**: No Firebase pricing concerns
- **Flexibility**: Customize backend as needed
- **Performance**: Direct database access
- **Privacy**: Data stays on your servers

## 🔍 Testing

1. Start all services
2. Register a new user
3. Create an auction
4. Place bids
5. Check dashboard analytics

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on port 27017
- Check MongoDB service status
- Verify connection string in .env

### Authentication Issues
- Clear localStorage and re-login
- Check JWT_SECRET in backend .env
- Verify API endpoints are accessible

### CORS Issues
- Backend includes CORS middleware
- Check if frontend and backend ports match

## 📞 Support

If you encounter any issues:
1. Check console logs for errors
2. Verify all services are running
3. Ensure MongoDB is accessible
4. Check API endpoint responses

Your application is now running on a robust MongoDB backend! 🎉