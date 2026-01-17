# Turing Task - Backend API

Backend API for the ChatGPT clone application built with Express.js, MongoDB, and JWT authentication.

## Features

- ✅ User authentication (Email/Password & Google OAuth)
- ✅ Chat management (Create, Read, Update, Delete chats)
- ✅ Message handling with simulated LLM responses
- ✅ LLM Service with 10-20 second simulated delay
- ✅ User ownership enforcement (users can only access their own chats/messages)
- ✅ JWT-based authentication
- ✅ MongoDB database with Mongoose

## Tech Stack

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + Google OAuth
- **Password Hashing:** bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials (for Google login)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   FRONTEND_URL=http://localhost:3000,http://localhost:3001
   MONGODB_URI=mongodb://localhost:27017/chatgpt-clone
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
   
   **Note:** `FRONTEND_URL` can be a comma-separated list of allowed origins for CORS. If not set, defaults to common localhost ports.

4. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user (email/password)
- `POST /api/auth/login` - Login user (email/password)
- `POST /api/auth/google` - Google OAuth authentication

### Chats

- `GET /api/chats` - Get all chats for authenticated user
- `GET /api/chats/:chatId` - Get chat with messages
- `POST /api/chats` - Create new chat
- `PUT /api/chats/:chatId` - Update chat title
- `DELETE /api/chats/:chatId` - Delete chat and all messages

### Messages

- `GET /api/chats/:chatId/messages` - Get all messages in a chat
- `POST /api/chats/:chatId/messages` - Send a message (triggers LLM response)

### Health Check

- `GET /api/health` - Server health check

## Authentication

All chat and message endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## LLM Simulation

The backend includes a simulated LLM service that:
- Introduces a random 10-20 second delay before responding
- Returns hardcoded multi-sentence responses
- Processes requests asynchronously (non-blocking)
- Saves assistant messages to the database

**Important:** After sending a message, the frontend should poll `GET /api/chats/:chatId/messages` to retrieve the LLM response once it's ready.

## Database Schema

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, optional - for local auth)
- `googleId` (String, optional, unique)
- `avatar` (String, optional)
- `provider` (String, enum: ['local', 'google'], default: 'local')
- `timestamps` (createdAt, updatedAt)

### Chat
- `title` (String, default: 'New Chat')
- `userId` (ObjectId, ref: User, required)
- `timestamps` (createdAt, updatedAt)

### Message
- `chatId` (ObjectId, ref: Chat, required)
- `role` (String, enum: ['user', 'assistant'], required)
- `content` (String, required)
- `timestamps` (createdAt, updatedAt)

## Project Structure

```
.
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication controllers
│   ├── chatController.js    # Chat controllers
│   └── messageController.js # Message controllers
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User model
│   ├── Chat.js              # Chat model
│   └── Message.js           # Message model
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── chatRoutes.js        # Chat routes
│   └── messageRoutes.js     # Message routes
├── services/
│   ├── authService.js      # Authentication logic
│   ├── chatService.js       # Chat business logic
│   ├── messageService.js    # Message business logic
│   └── llmService.js        # LLM simulation service
├── utils/
│   └── jwt.js               # JWT token utilities
├── server.js                # Express app entry point
└── package.json
```

## Security

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- User ownership is enforced at the service layer
- All chat/message endpoints require authentication
- CORS is configured for frontend origin

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Development

The server runs on `http://localhost:3000` by default (configurable via `PORT` env variable).

For development with auto-reload:
```bash
npm run dev
```
