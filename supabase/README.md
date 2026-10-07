# Supabase Integration Guide for Taskora

This guide outlines how to integrate **Supabase** as the persistent cloud backend for Taskora, replacing or augmenting `localStorage`.

---

## 1. Supabase Project Setup

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Open [`supabase/schema.sql`](./schema.sql), copy the entire file, paste it into the SQL Editor, and click **Run**.
   - This creates the `tasks` and `focus_sessions` tables.
   - Sets up indexes and Row Level Security (RLS) policies.
   - Creates automatic `updated_at` triggers.

---

## 2. Environment Configuration

Install the Supabase JS SDK:
```bash
npm install @supabase/supabase-js
```

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 3. Client Initialization (`src/lib/supabaseClient.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 4. Query Reference: TypeScript SDK vs SQL

### 4.1 Person 1 — Task Manager

| Operation | SQL Query | Supabase Client SDK Example |
| :--- | :--- | :--- |
| **Fetch All Tasks** | `SELECT * FROM tasks ORDER BY created_at DESC;` | `const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });` |
| **Insert Task** | `INSERT INTO tasks (id, title, description, priority, completed) VALUES (...);` | `const { data } = await supabase.from('tasks').insert([newTask]).select();` |
| **Update Task** | `UPDATE tasks SET title = $1, description = $2, priority = $3 WHERE id = $4;` | `await supabase.from('tasks').update({ title, description, priority }).eq('id', id);` |
| **Toggle Complete** | `UPDATE tasks SET completed = NOT completed WHERE id = $1;` | `await supabase.from('tasks').update({ completed: !isCompleted }).eq('id', id);` |
| **Delete Task** | `DELETE FROM tasks WHERE id = $1;` | `await supabase.from('tasks').delete().eq('id', id);` |
| **Clear Completed** | `DELETE FROM tasks WHERE completed = true;` | `await supabase.from('tasks').delete().eq('completed', true);` |

---

### 4.2 Person 2 — Focus Timer

| Operation | SQL Query | Supabase Client SDK Example |
| :--- | :--- | :--- |
| **Insert Session** | `INSERT INTO focus_sessions (id, duration) VALUES (...);` | `await supabase.from('focus_sessions').insert([{ id, duration: 25 }]);` |
| **Fetch Sessions** | `SELECT * FROM focus_sessions ORDER BY completed_at DESC LIMIT 10;` | `const { data } = await supabase.from('focus_sessions').select('*').order('completed_at', { ascending: false }).limit(10);` |

---

### 4.3 Person 3 — Dashboard Analytics

| Metric | SQL Aggregate |
| :--- | :--- |
| **Total Tasks** | `SELECT count(*) FROM tasks;` |
| **Completed Tasks** | `SELECT count(*) FROM tasks WHERE completed = true;` |
| **Pending Tasks** | `SELECT count(*) FROM tasks WHERE completed = false;` |
| **Focus Sessions** | `SELECT count(*) FROM focus_sessions;` |
