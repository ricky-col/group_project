# TaskFlow Frontend

The frontend client for the TaskFlow application. Built with React, Vite, and Tailwind CSS, featuring a responsive drag-and-drop Kanban interface.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Interactions**: @dnd-kit (Drag-and-drop)
- **Editor**: React Quill (Rich text editing)
- **API Client**: Axios

## Getting Started

### Prerequisites
- Node.js (v18+)

### Installation

```bash
npm install
```

### Development

Start the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Build for Production

Compile the application for production deployment:
```bash
npm run build
```
The output will be generated in the `dist` directory.

### Linting

Run ESLint to check for code quality issues:
```bash
npm run lint
```
