# TaskFlow Backend

The backend engine for TaskFlow, built with Node.js, Express, and MongoDB. It handles authentication, real-time updates via Socket.io, and project management logic.

## Getting Started

1.  **Install dependencies:**
    
    npm install
    

2.  **Environment Variables:**
    Create a `.env` file with the following:
    ```env
    PORT=3333
    DB_URL=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

3.  **Run the server:**
    
    npm start
    # or for development
    npx nodemon server.js

## Project Structure

- **`models/`**: MongoDB schemas using Mongoose.
  - `User.js`, `Board.js`, `List.js`, `Card.js`, `Activity.js`.
- **`routes/`**: API endpoint definitions.
  - `authRoute.js`, `boardRoute.js`, `listRoute.js`, `cardRoute.js`, `activityRoute.js`.
- **`middleware/`**: Custom Express middlewares (e.g., `authMiddleware.js`).
- **`services/`**: Core logic and shared services.
- **`socket.js`**: Real-time event handling using Socket.io.
- **`server.js`**: Main entry point where the Express app and Server are initialized.
- **`test.http`**: REST Client file for testing API endpoints.

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/board/get` - Fetch user boards
- `POST /api/board/create` - Create a new board
- `GET /api/list/get/:boardId` - Fetch lists for a board
- `PUT /api/card/update/:cardId` - Update card details
- ... and more.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Auth**: JWT (JSON Web Tokens) & Cookie-parser
