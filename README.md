# Taskora — VoiceBoard Productivity Dashboard

> **Wispr Flow Shortlisting Task** — 3-Person Team Build Plan  
> **Mandatory Referral Link**: [https://ref.wisprflow.ai/hhg](https://ref.wisprflow.ai/hhg)

Taskora is a modern productivity dashboard built through voice-driven development using **Wispr Flow**. It unites a high-velocity **Task Manager**, a **Pomodoro Focus Timer**, and a **Productivity Analytics Dashboard** into a unified, responsive interface designed for deep work.

---

## 🚀 Features

### 1. Task Manager (Person 1 — Completed ✅)
- **Voice-Driven Creation**: Seamlessly dictate task titles, priorities, and descriptions hands-free using Wispr Flow.
- **Full CRUD Operations**: Create, edit, mark active/completed, and delete tasks.
- **Input Validation**: Strict empty-title validation with visual feedback.
- **Priority Categorization**: Color-coded badges for `High`, `Medium`, and `Low` priority items.
- **Smart Filtering & Live Search**:
  - Filter by status (`All`, `Active`, `Completed`) with dynamic count badges.
  - Filter by priority level (`All Priorities`, `High`, `Medium`, `Low`).
  - Instant live keyword search across task titles and descriptions.
- **Progress Tracking**: Real-time progress bar reflecting total, pending, and completed tasks.
- **Local Persistence**: Full offline capability with zero-backend `localStorage` persistence under `taskora_tasks`.
- **Empty States**: Friendly empty-state UI for zero tasks and no search results with quick-action resets.

### 2. Pomodoro Focus Timer (Person 2 — In Progress ⏳)
- 25-minute Pomodoro countdown timer.
- Controls for Start, Pause, and Reset.
- Focus session history and streak counters.
- Persistence to `localStorage` under `taskora_focus_sessions`.

### 3. Productivity Dashboard & Analytics (Person 3 — In Progress ⏳)
- Metric cards for Total Tasks, Completed Tasks, Pending Tasks, and Focus Sessions.
- Completion rate percentage calculations.
- Progress visualization and motivational productivity status messages.
- Clean mobile-responsive layout and theme support.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Persistence**: Browser `localStorage` (No external database required)
- **Voice Development**: [Wispr Flow](https://ref.wisprflow.ai/hhg)

---

## 👥 Team Contributions & Module Ownership

| Member | Module | Branch | Status | Primary Files |
| :--- | :--- | :--- | :--- | :--- |
| **Person 1** | Task Manager & Base Scaffold | `feature/task-manager` | **Completed** ✅ | `src/components/tasks/*`, `src/types/task.ts`, `src/utils/taskStorage.ts` |
| **Person 2** | Focus Timer | `feature/focus-timer` | **Assigned** ⏳ | `src/components/timer/*`, `src/types/session.ts`, `src/utils/sessionStorage.ts` |
| **Person 3** | Dashboard & UI Analytics | `feature/dashboard-ui` | **Assigned** ⏳ | `src/components/dashboard/*`, `src/components/layout/*` |

---

## 📁 Project Structure

```text
Taskora-HHGoa-Task/
├── public/
│   └── favicon.svg               # Taskora custom SVG icon
├── src/
│   ├── components/
│   │   ├── dashboard/            # Person 3 module
│   │   │   ├── Dashboard.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/               # App layout & navigation
│   │   │   ├── Header.tsx
│   │   │   └── Navigation.tsx
│   │   ├── tasks/                # Person 1 module (Completed)
│   │   │   ├── AddTask.tsx       # Voice-ready task addition with validation
│   │   │   ├── TaskBoard.tsx     # Main task board orchestration
│   │   │   ├── TaskCard.tsx      # Task item with priority & inline editing
│   │   │   └── TaskFilter.tsx    # Filter tabs, priority selector & search
│   │   └── timer/                # Person 2 module
│   │       └── FocusTimer.tsx
│   ├── types/
│   │   ├── session.ts            # Shared FocusSession contract
│   │   └── task.ts               # Shared Task & Priority contract
│   ├── utils/
│   │   ├── sessionStorage.ts     # localStorage helper for sessions
│   │   └── taskStorage.ts        # localStorage helper for tasks
│   ├── App.tsx                   # Main application wiring
│   ├── index.css                 # Tailwind CSS v4 design tokens
│   └── main.tsx                  # React DOM root entry
├── task.md                       # Granular task tracker & progress checklist
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher, v24 recommended)
- npm (v9 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Avi007-debug/Taskora-HHGoa-Task.git
   cd Taskora-HHGoa-Task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🎙️ Voice-Driven Development with Wispr Flow

The entire project is engineered through voice-driven development using **Wispr Flow**.
- **Referral Account**: Created via [https://ref.wisprflow.ai/hhg](https://ref.wisprflow.ai/hhg).
- **Voice Workflow**: Voice commands and dictation were used for generating components, defining types, describing logic, and drafting documentation.
- **Voice Productivity**: Enabled writing expressive task titles, complex notes, and refactoring without repetitive typing.

---

## 🎬 Demo Video

- **Video Strategy**: 5-minute showcase demonstrating Wispr Flow in action across all three modules.
  - `0:00–0:20`: Introduction & Wispr Flow setup
  - `0:20–1:30`: Person 1 voice-driven Task Manager development
  - `1:30–2:40`: Person 2 Focus Timer development
  - `2:40–3:50`: Person 3 Dashboard & UI development
  - `3:50–4:30`: Module integration & App wiring
  - `4:30–5:00`: Final application demo

---

## 🔮 Future Improvements

- Sound chimes and browser notifications on timer completion.
- Drag-and-drop task reordering.
- Export / import task backups as JSON.
- Voice-activated task commands directly in the web app via Web Speech API / Wispr Flow integration.
