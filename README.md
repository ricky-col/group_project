# TaskFlow

A modern, full-stack visual task management application inspired by Trello. Built with the MERN stack and optimized for a seamless, drag-and-drop user experience.

## Features

- **Kanban Boards**: Create and manage multiple projects.
- **Drag-and-Drop**: Easily move lists and cards using `@dnd-kit`.
- **Card Management**: Add detailed descriptions using a rich text editor (React Quill), manage checklists, set due dates, and track activity.
- **File Attachments**: Upload and attach files to cards using Cloudinary.
- **Real-Time Collaboration**: Invite team members via shareable links to collaborate on boards.
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing and session-based client storage.
- **Responsive UI**: Fully mobile-responsive design built with Tailwind CSS.

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- Zustand (State management)
- React Router DOM
- @dnd-kit (Drag-and-drop)
- React Quill (Rich text editing)
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Token (JWT) + bcryptjs
- Cloudinary + Multer (File uploads)
- Socket.io (Real-time events)

## Folder Structure

The repository is structured as a monorepo containing both the frontend and backend applications.

```text
group_project/
├── app/                  # Express backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── server.js         # Entry point
│
└── trello-frontend/      # React frontend (Vite)
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Route views
    │   ├── services/     # API integration (Axios)
    │   └── store/        # Zustand state
    └── vite.config.js    # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/ricky-col/group_project.git
cd group_project
```

### 2. Backend Setup
```bash
cd app
npm install
```

Create a `.env` file in the `app` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../trello-frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:5173` and the backend will run on `http://localhost:5000`.

## API Endpoints Overview

- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate user and return JWT
- `GET /api/board/get` - Fetch all boards for the authenticated user
- `POST /api/board/create` - Create a new board
- `POST /api/board/invite` - Generate a shareable board invite link
- `POST /api/list/create` - Add a list to a board
- `POST /api/card/create` - Add a card to a list
- `PUT /api/card/update/:id` - Update card details (description, checklist, etc.)
- `POST /api/card/upload/:id` - Attach a file to a card

## Deployment

The application is configured to be easily deployable to services like Render, Heroku, or Vercel.

**Frontend (Render)**
- Build command: `npm run build`
- Publish directory: `dist`
- Note: Add a redirect rule (`/*` -> `/index.html`) for React Router SPA support.

**Backend (Render)**
- Build command: `npm install`
- Start command: `node server.js`
- Ensure all environment variables from `.env` are added to the deployment dashboard.
