# TaskFlow Backend

The REST API backend for the TaskFlow application. Built with Node.js and Express, it provides secure authentication, real-time updates, and data persistence using MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JSON Web Token (JWT) + bcryptjs
- **Real-time**: Socket.io
- **Storage**: Cloudinary + Multer (File uploads)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

npm install

### Environment Configuration

Create a `.env` file in the root of the `app` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Development

Start the backend server in development mode (using nodemon):
```bash
npm run dev
```
The server will start on `http://localhost:5000` (or the port specified in `.env`).

## Core API Routes

- `/api/auth` - User registration and login
- `/api/board` - Board creation, retrieval, and invite handling
- `/api/list` - List management within boards
- `/api/card` - Card management, updates, and file attachments
- `/api/activity` - Board and card activity tracking
