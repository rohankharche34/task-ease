# TaskEase - Premium Task Management System

![TaskEase Banner](https://via.placeholder.com/1200x400/0f1015/8b5cf6?text=TaskEase+-+Premium+Task+Management)

TaskEase is a modern, full-stack Task Management System featuring a highly interactive Kanban board, real-time drag-and-drop, and a stunning glassmorphism UI. It is built to be fast, responsive, and aesthetically pleasing.

## ✨ Features

- **Fluid Drag-and-Drop**: Smoothly move tasks between "To Do", "In Progress", and "Done" columns.
- **Premium UI**: Custom glassmorphism aesthetic, sleek gradients, and smooth micro-animations.
- **Dynamic Theming**: Toggle between Light, Dark, and Auto (System) modes.
- **Custom Accents**: Personalize your workspace with custom glow colors (Purple, Emerald, Rose, Blue).
- **Advanced Task Fields**: Set Priority Levels (Low, Medium, High) and Due Dates.
- **Smart Dashboard**: Filter and search tasks in real-time.
- **Zero-Config Database**: Uses a local SQLite database for hassle-free setup.

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) (bootstrapped with [Vite](https://vitejs.dev/))
- Vanilla CSS (Custom properties & Glassmorphism)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (Drag and drop)
- [Lucide React](https://lucide.dev/) (Icons)
- [react-hot-toast](https://react-hot-toast.com/) (Notifications)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [SQLite3](https://github.com/TryGhost/node-sqlite3) (Database)
- [Helmet](https://helmetjs.github.io/) (Security)
- dotenv & CORS

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd task-ease
```

### 2. Setup the Backend
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
npm install
```
Start the backend server:
```bash
npm run dev
```
*The server will start on `http://localhost:5000` and automatically create the SQLite database file (`database.sqlite`).*

### 3. Setup the Frontend
Open a new terminal window and navigate to the `frontend` directory:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```
*The React app will be available at `http://localhost:5173/`.*

## 📁 Project Structure

```text
task-ease/
├── backend/
│   ├── database.js     # SQLite database initialization & schema
│   ├── server.js       # Express server & API routes
│   ├── .env            # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── KanbanBoard.jsx   # Drag-and-drop board
    │   │   ├── TaskCard.jsx      # Individual task UI
    │   │   ├── TaskModal.jsx     # Create/Edit modal form
    │   │   └── ThemeSelector.jsx # Theme & Accent picker
    │   ├── App.jsx               # Main application layout
    │   ├── index.css             # Glassmorphism & Theme system
    │   └── main.jsx              # React entry point
    ├── vite.config.js
    └── package.json
```

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
