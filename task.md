# Taskora — Development Task Tracker & Roadmap

> **VoiceBoard Project**: Wispr Flow Shortlisting Task — 3-Person Team Build Plan  
> **Project Name**: **Taskora**  
> **Tech Stack**: React 19 + TypeScript + Tailwind CSS + Lucide Icons + localStorage

---

## 🏗️ Phase 1 — Repository & Architecture Setup (Person 1 Lead)

- [x] **Project Initialization**: Scaffolding with Vite + React + TypeScript
- [x] **Styling Engine**: Set up Tailwind CSS v4 and custom glassmorphism styles
- [x] **Branding**: Set project title to **Taskora** in `index.html`, `package.json`, and UI
- [x] **Typography & Favicon**: Add Inter / Outfit Google Fonts and custom Taskora SVG favicon
- [x] **Data Contracts**: Define shared types:
  - [x] `src/types/task.ts` (Task, Priority, Filter types)
  - [x] `src/types/session.ts` (FocusSession type)
- [x] **Storage Foundation**:
  - [x] `src/utils/taskStorage.ts` for task persistence under `taskora_tasks`
  - [x] `src/utils/sessionStorage.ts` for timer session persistence under `taskora_focus_sessions`
- [x] **Git Branch Structure**: Set up feature branch workflow (`feature/task-manager`, `feature/focus-timer`, `feature/dashboard-ui`)

---

## 👤 Person 1 — Task Manager (Active Focus)

**Branch**: `feature/task-manager`  
**Primary Files**:
- `src/components/tasks/TaskBoard.tsx`
- `src/components/tasks/TaskCard.tsx`
- `src/components/tasks/AddTask.tsx`
- `src/components/tasks/TaskFilter.tsx`
- `src/types/task.ts`
- `src/utils/taskStorage.ts`

### Detailed Checklist:
- [x] **Data Contract**: Create `Task` type with `id`, `title`, `description`, `priority ('low' | 'medium' | 'high')`, `completed`, `createdAt`.
- [x] **Persistence**: Implement `loadTasks()` and `saveTasks()` with `localStorage`.
- [x] **AddTask Component**:
  - [x] Quick add input field with Wispr Flow voice indicator
  - [x] Detailed expansion mode for description and priority selection
  - [x] Strict validation: Prevent empty or whitespace-only task titles with error message
  - [x] Wispr Flow voice-first guidance tip banner
  - [x] Enter key to quickly submit
- [x] **TaskCard Component**:
  - [x] Interactive completion checkbox with smooth animation
  - [x] Priority badge chip (Low / Medium / High) with color codes
  - [x] Inline edit mode for updating title, description, and priority
  - [x] Edit title validation
  - [x] Delete task action
  - [x] Formatted relative/readable date display
  - [x] Completed state strikethrough and visual differentiation
- [x] **TaskFilter Component**:
  - [x] Status tabs: `All`, `Active`, `Completed` with dynamic counts
  - [x] Priority filter: `All Priorities`, `High`, `Medium`, `Low`
  - [x] Live keyword search by title or description
  - [x] Reset / clear filters button
- [x] **TaskBoard Component**:
  - [x] Orchestrate task state and sync with `localStorage`
  - [x] Hero overview header with task statistics (Total, Pending, Completed, % Progress)
  - [x] Render filtered and searched tasks
  - [x] Clear all completed tasks action
  - [x] Empty state for no tasks at all (with action CTA)
  - [x] Empty state for no matching filter/search results (with reset CTA)
  - [x] Responsive layout for mobile and desktop
- [x] **Integration Readiness**: Expose `tasks[]` array and CRUD hooks so Dashboard (Person 3) can consume them seamlessly.

---

## 👤 Person 2 — Focus Timer (To be built by Teammate 2)

**Branch**: `feature/focus-timer`  
**Primary Files**:
- `src/components/timer/FocusTimer.tsx`
- `src/components/timer/TimerControls.tsx`
- `src/components/timer/SessionHistory.tsx`
- `src/types/session.ts`
- `src/utils/sessionStorage.ts`

### Detailed Checklist:
- [ ] Create timer state with remaining seconds and running/paused status.
- [ ] Default the countdown timer to 25:00 (1500 seconds).
- [ ] Implement controls: Start, Pause, and Reset.
- [ ] Ensure countdown does not duplicate intervals when Start is clicked multiple times.
- [ ] When timer reaches 00:00, generate a completed `FocusSession` record (`id`, `duration: 25`, `completedAt`).
- [ ] Persist completed sessions in `localStorage` under `taskora_focus_sessions`.
- [ ] Display session history for recent/today's sessions.
- [ ] Show total count of completed focus sessions.
- [ ] Add completion alert, sound chime, or visual notification.
- [ ] Test timer persistence and state across page refresh, pause, and reset.
- [ ] Expose sessions data to `App.tsx` for Dashboard consumption.

---

## 👤 Person 3 — Dashboard & UI (To be built by Teammate 3)

**Branch**: `feature/dashboard-ui`  
**Primary Files**:
- `src/components/dashboard/Dashboard.tsx`
- `src/components/dashboard/StatCard.tsx`
- `src/components/dashboard/ProgressChart.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Navigation.tsx`

### Detailed Checklist:
- [ ] Create application shell, header, and responsive navigation.
- [ ] Create reusable `StatCard` components with custom icons and color schemes.
- [ ] Compute real-time productivity metrics:
  - `totalTasks = tasks.length`
  - `completedTasks = tasks.filter(t => t.completed).length`
  - `pendingTasks = totalTasks - completedTasks`
  - `completionRate = Math.round((completedTasks / totalTasks) * 100)`
  - `focusSessions = sessions.length`
- [ ] Build visual progress bar or charts for task completion rate.
- [ ] Add dynamic motivational productivity quotes based on completion milestone (0%, 25%, 50%, 75%, 100%).
- [ ] Build clean empty states when no tasks or sessions exist.
- [ ] Ensure responsive layout for mobile, tablet, and desktop viewports.
- [ ] Optionally implement dark/light theme toggle.

---

## 🤝 Phase 4 — Integration & Merge Plan

- [ ] Merge `feature/task-manager` into `main` (Person 1 + Integrator)
- [ ] Merge `feature/focus-timer` into `main` (Person 2 + Integrator)
- [ ] Merge `feature/dashboard-ui` into `main` (Person 3 + Integrator)
- [ ] Wire shared state in `App.tsx`:
  - `tasks` from `loadTasks()` -> `TaskBoard` and `Dashboard`
  - `sessions` from `loadFocusSessions()` -> `FocusTimer` and `Dashboard`
- [ ] Verify no `localStorage` key collisions (`taskora_tasks` vs `taskora_focus_sessions`)
- [ ] End-to-end testing of all features together.

---

## 🎥 Phase 5 — Wispr Flow Video & Submission Plan

- [ ] Ensure all 3 teammates created accounts via [https://ref.wisprflow.ai/hhg](https://ref.wisprflow.ai/hhg)
- [ ] Record voice-driven coding footage:
  - **0:00–0:20**: Project intro & Wispr Flow overview
  - **0:20–1:30**: Person 1 voice-coding Task Manager
  - **1:30–2:40**: Person 2 voice-coding Focus Timer
  - **2:40–3:50**: Person 3 voice-coding Dashboard & UI
  - **3:50–4:30**: Module integration & running Taskora
  - **4:30–5:00**: Final product walkthrough
- [ ] Complete `README.md` with setup instructions and Wispr Flow workflow details.
- [ ] Submit official submission form before the deadline.
