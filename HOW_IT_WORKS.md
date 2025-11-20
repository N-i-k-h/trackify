# How Taskify Works - Complete Technical Guide

## 📐 Architecture Overview

Taskify follows a **client-server architecture** with:

```
┌─────────────────┐         HTTP/REST API         ┌─────────────────┐
│                 │◄─────────────────────────────►│                 │
│   Frontend      │         JWT Tokens             │    Backend      │
│   (Next.js)     │                                │   (Express)     │
│   Port: 3000    │                                │   Port: 5000    │
└─────────────────┘                                └─────────────────┘
                                                           │
                                                           ▼
                                                    ┌─────────────────┐
                                                    │    MongoDB      │
                                                    │   (Database)    │
                                                    └─────────────────┘
```

---

## 🔄 Complete Application Flow

### 1. Initial Load & Authentication Flow

```
User Opens Browser
       │
       ▼
┌──────────────────────┐
│  http://localhost:3000 │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│   app/page.tsx       │  (Root page - checks auth)
│   - useAuth() hook   │
└──────────────────────┘
       │
       ├─► User NOT logged in ──► Redirect to /signin
       │
       └─► User logged in ──────► Redirect to /dashboard/tasks
```

**Code Flow:**
1. `app/page.tsx` uses `useAuth()` hook
2. `useAuth()` checks `localStorage` for JWT token
3. If token exists, validates with backend `/api/auth/me`
4. Redirects based on authentication status

---

### 2. Authentication System

#### Sign Up Flow

```
User fills Sign Up form
       │
       ▼
┌──────────────────────┐
│  app/(auth)/signup/  │
│  - Name, Email, Pwd  │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  lib/auth.tsx        │
│  signup() function   │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  POST /api/auth/signup│
│  (Backend)           │
└──────────────────────┘
       │
       ├─► Validates input
       ├─► Checks if email exists
       ├─► Hashes password (bcrypt)
       ├─► Creates user in MongoDB
       ├─► Generates JWT token
       │
       ▼
┌──────────────────────┐
│  Returns:            │
│  - JWT token         │
│  - User data         │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Frontend:           │
│  - Saves token to    │
│    localStorage      │
│  - Sets auth headers │
│  - Updates context   │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Redirect to         │
│  /dashboard/tasks    │
└──────────────────────┘
```

#### Sign In Flow

```
User fills Sign In form
       │
       ▼
┌──────────────────────┐
│  app/(auth)/signin/  │
│  - Email, Password   │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  POST /api/auth/login│
│  (Backend)           │
└──────────────────────┘
       │
       ├─► Finds user by email
       ├─► Compares password (bcrypt)
       ├─► Generates JWT token
       │
       ▼
┌──────────────────────┐
│  Frontend saves token│
│  and redirects       │
└──────────────────────┘
```

#### JWT Token Structure

```javascript
// Token payload
{
  userId: "507f1f77bcf86cd799439011",
  iat: 1234567890,  // Issued at
  exp: 1234567890   // Expires in 7 days
}
```

---

### 3. Protected Routes System

```
User tries to access /dashboard/tasks
       │
       ▼
┌──────────────────────┐
│  components/         │
│  ProtectedRoute.tsx  │
└──────────────────────┘
       │
       ├─► Checks useAuth()
       │
       ├─► No user? ──► Redirect to /signin
       │
       └─► User exists? ──► Render dashboard
```

**How it works:**
- `ProtectedRoute` wraps dashboard pages
- Checks `user` from `AuthContext`
- Redirects if not authenticated
- Shows loading state while checking

---

### 4. Dashboard & Navigation

```
User on Dashboard
       │
       ▼
┌──────────────────────┐
│  app/dashboard/      │
│  layout.tsx          │
│  - Sidebar           │
│  - Main content area │
└──────────────────────┘
       │
       ├─► Tasks ──────────► /dashboard/tasks
       ├─► Add Task ───────► /dashboard/add-task
       ├─► Task Status ────► /dashboard/task-status
       ├─► Profile ────────► /dashboard/profile
       └─► Logout ─────────► Clears token, redirects to /signin
```

---

### 5. Task Management Flow

#### Creating a Task

```
User clicks "Add Task"
       │
       ▼
┌──────────────────────┐
│  /dashboard/add-task  │
│  - Form with:        │
│    Title, Desc, Status│
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  User submits form   │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  lib/api.ts          │
│  api.post('/tasks')  │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  POST /api/tasks     │
│  Headers:            │
│  Authorization: Bearer <token>│
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  server/middleware/  │
│  auth.js             │
│  - Verifies JWT      │
│  - Extracts userId   │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  server/routes/      │
│  tasks.js            │
│  - Validates input   │
│  - Creates task      │
│  - Links to user     │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  MongoDB:            │
│  - Saves task        │
│  - Returns task data │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Frontend:           │
│  - Shows success msg │
│  - Redirects to tasks│
└──────────────────────┘
```

#### Reading Tasks

```
User visits /dashboard/tasks
       │
       ▼
┌──────────────────────┐
│  app/dashboard/tasks/ │
│  page.tsx            │
│  - useEffect()       │
│  - fetchTasks()      │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  GET /api/tasks      │
│  Query params:       │
│  - status (optional) │
│  - search (optional) │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Backend:            │
│  - Authenticates     │
│  - Filters by user   │
│  - Applies filters   │
│  - Returns tasks     │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Frontend:           │
│  - Updates state     │
│  - Renders task list │
└──────────────────────┘
```

#### Updating a Task

```
User clicks "Edit" on task
       │
       ▼
┌──────────────────────┐
│  Redirects to:       │
│  /dashboard/add-task │
│  ?id=task_id         │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  useSearchParams()   │
│  - Gets task ID      │
│  - Fetches task data │
│  - Populates form    │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  User edits & submits│
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  PUT /api/tasks/:id  │
│  - Updates task      │
│  - Validates user    │
│    ownership         │
└──────────────────────┘
```

#### Deleting a Task

```
User clicks "Delete"
       │
       ▼
┌──────────────────────┐
│  Confirmation dialog │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  DELETE /api/tasks/:id│
│  - Verifies ownership│
│  - Deletes from DB   │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Refetch tasks list  │
└──────────────────────┘
```

---

### 6. Search & Filter System

```
User types in search box
       │
       ▼
┌──────────────────────┐
│  State updates:      │
│  search = "text"     │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  useEffect() triggers│
│  - Debounced search  │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  GET /api/tasks      │
│  ?search=text        │
│  ?status=pending     │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Backend:            │
│  - MongoDB query:    │
│    $or: [            │
│      {title: /text/i}│
│      {desc: /text/i} │
│    ]                  │
└──────────────────────┘
```

---

### 7. Profile Management

```
User visits /dashboard/profile
       │
       ▼
┌──────────────────────┐
│  GET /api/profile    │
│  - Returns user data │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Form pre-filled     │
│  - Name              │
│  - Email             │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  User updates & saves│
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  PUT /api/profile    │
│  - Validates email   │
│  - Updates user      │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Updates AuthContext │
│  - Syncs UI          │
└──────────────────────┘
```

---

## 🔧 Key Components Explained

### 1. Authentication Context (`lib/auth.tsx`)

**Purpose:** Global state management for authentication

```typescript
AuthContext provides:
- user: Current user object
- loading: Auth check status
- login(): Sign in function
- signup(): Sign up function
- logout(): Sign out function
- updateUser(): Update user in context
```

**How it works:**
1. On app load, checks `localStorage` for token
2. If token exists, validates with backend
3. Sets user in context if valid
4. All components can access via `useAuth()` hook

---

### 2. API Client (`lib/api.ts`)

**Purpose:** Centralized HTTP client with automatic token injection

```typescript
Features:
- Base URL configuration
- Automatic JWT token injection
- Request/response interceptors
- Error handling
```

**How it works:**
- Every request automatically includes: `Authorization: Bearer <token>`
- Token read from `localStorage`
- Centralized error handling

---

### 3. Protected Route (`components/ProtectedRoute.tsx`)

**Purpose:** Route guard for authenticated pages

**How it works:**
1. Checks `useAuth()` for user
2. Shows loading while checking
3. Redirects to `/signin` if no user
4. Renders children if authenticated

---

### 4. Backend Middleware (`server/middleware/auth.js`)

**Purpose:** Verify JWT tokens on protected routes

**How it works:**
1. Extracts token from `Authorization` header
2. Verifies token with JWT_SECRET
3. Finds user in database
4. Attaches user to `req.user`
5. Calls `next()` to continue

**If invalid:**
- Returns 401 Unauthorized
- Request stops here

---

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: "pending" | "in-progress" | "completed",
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ user: 1, createdAt: -1 }` - Fast user task queries

---

## 🔐 Security Implementation

### Password Hashing

```javascript
// On signup
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// On login
const isMatch = await bcrypt.compare(password, user.password);
```

### JWT Token

```javascript
// Generation
const token = jwt.sign(
  { userId: user._id },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Verification
const decoded = jwt.verify(token, JWT_SECRET);
```

### Protected Routes

**Frontend:**
- `ProtectedRoute` component checks auth
- Redirects if not authenticated

**Backend:**
- `authenticate` middleware on all protected routes
- Verifies JWT on every request
- Returns 401 if invalid

---

## 📊 State Management Flow

```
┌─────────────────────────────────────┐
│  AuthContext (Global State)        │
│  - user                            │
│  - loading                         │
└─────────────────────────────────────┘
              │
              ├─► Used by ProtectedRoute
              ├─► Used by Dashboard Layout
              ├─► Used by Profile Page
              └─► Used by all pages
```

**Local State:**
- Each page manages its own local state
- Tasks list, form inputs, etc.
- Fetches data on mount/update

---

## 🔄 Data Flow Example: Creating a Task

```
1. User fills form (React state)
   └─► title, description, status

2. User clicks "Create Task"
   └─► handleSubmit() called

3. Frontend validation
   └─► Checks if title exists

4. API call
   └─► POST /api/tasks
   └─► Headers: Authorization: Bearer <token>
   └─► Body: { title, description, status }

5. Backend middleware
   └─► Verifies JWT token
   └─► Extracts userId
   └─► Attaches to req.user

6. Route handler
   └─► Validates input
   └─► Creates Task model
   └─► Links to req.user._id
   └─► Saves to MongoDB

7. Response
   └─► Returns created task

8. Frontend receives response
   └─► Shows success toast
   └─► Redirects to /dashboard/tasks

9. Tasks page refetches
   └─► GET /api/tasks
   └─► Displays updated list
```

---

## 🎨 UI Component Hierarchy

```
app/layout.tsx (Root)
├── Providers (AuthProvider)
│   └── Toaster (Notifications)
│       └── {children}
│           │
│           ├── app/(auth)/layout.tsx
│           │   └── Sign In/Sign Up pages
│           │
│           └── app/dashboard/layout.tsx
│               ├── Sidebar Navigation
│               └── ProtectedRoute
│                   └── Dashboard Pages
│                       ├── Tasks Page
│                       ├── Add Task Page
│                       ├── Task Status Page
│                       └── Profile Page
```

---

## 🚀 Performance Optimizations

1. **Client-side routing** - No page reloads
2. **Token caching** - Stored in localStorage
3. **Conditional rendering** - Only loads what's needed
4. **Database indexes** - Fast queries
5. **Debounced search** - Reduces API calls

---

## 🐛 Error Handling

### Frontend
- Try-catch blocks in async functions
- Toast notifications for errors
- Loading states during requests
- Form validation before submission

### Backend
- Input validation
- Error middleware catches all errors
- Returns user-friendly messages
- Logs errors for debugging

---

## 📝 Summary

**Frontend:**
- React components with hooks
- Context API for global state
- Protected routes with guards
- API integration via Axios

**Backend:**
- Express REST API
- JWT authentication
- MongoDB for data storage
- Middleware for security

**Flow:**
1. User authenticates → Gets JWT token
2. Token stored in localStorage
3. All requests include token
4. Backend validates token
5. Data flows between frontend ↔ backend ↔ database

This architecture ensures:
- ✅ Security (JWT, password hashing)
- ✅ Scalability (modular structure)
- ✅ Maintainability (clean code)
- ✅ User experience (smooth interactions)


