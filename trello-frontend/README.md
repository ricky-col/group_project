# TaskFlow Frontend

A sleek, professional Trello clone built with React, Tailwind CSS, and Zustand. Features a premium "black-on-black" aesthetic, real-time collaboration, and smooth drag-and-drop functionality.

## Getting Started

1.  **Install dependencies:**
    npm install
    

2.  **Environment Setup:**
    Ensure the backend is running on `http://localhost:3333`. You can configure the API base URL in `src/services/api.js`.

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Project Structure

- **`src/components/`**: Reusable UI components.
  - `Board/`: Board-specific logic and headers.
  - `List/`: List containers and creation tools.
  - `Card/`: Draggable cards and the professional Card Modal.
  - `Common/`: Shared components like the informative Footer.
- **`src/pages/`**: Main application views.
  - `Landing.jsx`: Professional monochrome landing page.
  - `Dashboard.jsx`: User workspace and board selection.
  - `Login.jsx` & `Register.jsx`: Premium split-screen authentication.
- **`src/store/`**: State management using Zustand.
  - `authStore.js`: Handles user session and persistence.
  - `boardStore.js`: Manages boards, lists, and real-time card updates.
- **`src/services/`**: Network and external communication.
  - `api.js`: Axios instance for REST calls.
  - `Socket.js`: Socket.io client for real-time synchronization.

## Design Philosophy

- **Theme**: High-contrast, minimalist dark mode.
- **Layout**: Professional split-screen auth and responsive board view.
- **Interactions**: Subtle animations and "below-the-fold" footer visibility.

## Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Real-time**: Socket.io-client
- **Editor**: React-Quill
