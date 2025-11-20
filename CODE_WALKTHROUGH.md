# Code Walkthrough - Understanding Each File

## 📁 Project Structure Deep Dive

### Frontend Files

#### `app/layout.tsx` - Root Layout
```typescript
// Wraps entire app
// Provides AuthProvider context
// Adds toast notifications
```
**Key Points:**
- Wraps all pages with `Providers` (AuthProvider)
- Adds `Toaster` for notifications
- Sets up global styles

---

#### `app/page.tsx` - Home Page
```typescript
// Checks authentication status
// Redirects to /signin or /dashboard/tasks
```
**Flow:**
1. Uses `useAuth()` hook
2. If loading → shows "Loading..."
3. If user exists → redirects to dashboard
4. If no user → redirects to signin

---

#### `lib/auth.tsx` - Authentication Context
```typescript
// Global authentication state
// Provides: user, login, signup, logout
```

**Key Functions:**

1. **checkAuth()** - On app load
   - Reads token from localStorage
   - Validates with `/api/auth/me`
   - Sets user if valid

2. **login(email, password)**
   - POST to `/api/auth/login`
   - Saves token to localStorage
   - Sets axios default headers
   - Updates context

3. **signup(name, email, password)**
   - POST to `/api/auth/signup`
   - Same flow as login

4. **logout()**
   - Removes token from localStorage
   - Clears axios headers
   - Resets user to null

---

#### `lib/api.ts` - API Client
```typescript
// Centralized HTTP client
// Auto-injects JWT tokens
```

**How it works:**
- Creates axios instance with base URL
- Interceptor adds token to every request
- Token read from localStorage
- Used by all components for API calls

---

#### `components/ProtectedRoute.tsx` - Route Guard
```typescript
// Protects routes from unauthorized access
```

**Logic:**
```typescript
if (loading) → Show loading
if (!user) → Redirect to /signin
if (user) → Render children
```

---

#### `app/(auth)/signin/page.tsx` - Sign In Page
```typescript
// Sign in form
// Toggle to sign up
```

**Features:**
- Email and password inputs
- Form validation
- Calls `login()` from auth context
- Shows loading state
- Toast notifications
- Redirects on success

---

#### `app/(auth)/signup/page.tsx` - Sign Up Page
```typescript
// Registration form
// Name, email, password
```

**Similar to signin but:**
- Additional name field
- Password length validation
- Calls `signup()` function

---

#### `app/dashboard/layout.tsx` - Dashboard Layout
```typescript
// Sidebar + main content
// Navigation menu
```

**Structure:**
- Left sidebar with navigation
- Main content area
- Logout button
- Active route highlighting
- Wrapped in `ProtectedRoute`

---

#### `app/dashboard/tasks/page.tsx` - Tasks List
```typescript
// Displays all tasks
// Search and filter
// CRUD operations
```

**Key Features:**

1. **State Management:**
   ```typescript
   const [tasks, setTasks] = useState([])
   const [search, setSearch] = useState('')
   const [statusFilter, setStatusFilter] = useState('')
   ```

2. **Data Fetching:**
   ```typescript
   useEffect(() => {
     fetchTasks()
   }, [statusFilter, search])
   ```
   - Fetches on mount
   - Refetches when filters change

3. **Search & Filter:**
   - Search input updates state
   - Status dropdown updates state
   - Both trigger useEffect → refetch

4. **Delete Function:**
   - Confirmation dialog
   - API call to delete
   - Refetch list after deletion

---

#### `app/dashboard/add-task/page.tsx` - Add/Edit Task
```typescript
// Form for creating/editing tasks
```

**Dual Purpose:**
- Create: No ID in URL
- Edit: ID in URL query params

**Flow:**
1. Checks `useSearchParams()` for ID
2. If ID exists → fetches task data
3. Populates form
4. On submit → POST or PUT based on ID

---

#### `app/dashboard/task-status/page.tsx` - Statistics
```typescript
// Task statistics and breakdown
```

**Features:**
- Fetches all tasks
- Calculates stats:
  - Total tasks
  - Pending count
  - In-progress count
  - Completed count
- Shows progress bar
- Groups tasks by status

---

#### `app/dashboard/profile/page.tsx` - User Profile
```typescript
// Display and edit user profile
```

**Features:**
- Fetches profile on mount
- Pre-fills form
- Updates profile via PUT request
- Updates auth context after save

---

### Backend Files

#### `server/index.js` - Server Entry Point
```javascript
// Express server setup
// MongoDB connection
// Route registration
```

**Key Sections:**

1. **Middleware:**
   ```javascript
   app.use(cors())           // Allow cross-origin
   app.use(express.json())   // Parse JSON bodies
   ```

2. **Database Connection:**
   ```javascript
   mongoose.connect(MONGODB_URI)
   // Connects to MongoDB
   // Uses connection string from .env
   ```

3. **Routes:**
   ```javascript
   app.use('/api/auth', authRoutes)
   app.use('/api/tasks', taskRoutes)
   app.use('/api/profile', profileRoutes)
   ```

4. **Error Handling:**
   ```javascript
   app.use((err, req, res, next) => {
     // Catches all errors
     // Returns formatted error response
   })
   ```

---

#### `server/models/User.js` - User Model
```javascript
// MongoDB schema for users
```

**Schema:**
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)

**Pre-save Hook:**
- Hashes password before saving
- Uses bcrypt with salt rounds

**Methods:**
- `comparePassword()` - Compares plain text with hash

---

#### `server/models/Task.js` - Task Model
```javascript
// MongoDB schema for tasks
```

**Schema:**
- title: String (required)
- description: String (optional)
- status: Enum ['pending', 'in-progress', 'completed']
- user: ObjectId (reference to User)

**Indexes:**
- `{ user: 1, createdAt: -1 }` - For fast user queries

---

#### `server/middleware/auth.js` - Authentication Middleware
```javascript
// Verifies JWT tokens
// Protects routes
```

**Flow:**
1. Extracts token from header
2. Verifies with JWT_SECRET
3. Finds user by ID from token
4. Attaches user to `req.user`
5. Calls `next()` to continue

**If fails:**
- Returns 401 Unauthorized
- Request stops

---

#### `server/routes/auth.js` - Authentication Routes
```javascript
// Sign up, sign in, get current user
```

**POST /signup:**
1. Validates input
2. Checks if email exists
3. Hashes password
4. Creates user
5. Generates JWT
6. Returns token + user

**POST /login:**
1. Validates input
2. Finds user by email
3. Compares password
4. Generates JWT
5. Returns token + user

**GET /me:**
1. Uses auth middleware
2. Returns current user from `req.user`

---

#### `server/routes/tasks.js` - Task Routes
```javascript
// CRUD operations for tasks
```

**GET /tasks:**
- Protected route (uses auth middleware)
- Filters by user (req.user._id)
- Optional: status filter
- Optional: search in title/description
- Returns tasks array

**POST /tasks:**
- Validates title required
- Creates task linked to user
- Returns created task

**PUT /tasks/:id:**
- Finds task by ID and user
- Updates provided fields
- Returns updated task

**DELETE /tasks/:id:**
- Finds task by ID and user
- Deletes task
- Returns success message

---

#### `server/routes/profile.js` - Profile Routes
```javascript
// User profile management
```

**GET /profile:**
- Returns current user profile
- Excludes password

**PUT /profile:**
- Validates input
- Checks email uniqueness
- Updates user
- Returns updated profile

---

## 🔄 Complete Request Flow Example

### Example: Creating a Task

**1. User Action:**
```typescript
// User fills form and clicks "Create Task"
// app/dashboard/add-task/page.tsx
handleSubmit() called
```

**2. Frontend Validation:**
```typescript
if (!title.trim()) {
  toast.error('Task title is required')
  return
}
```

**3. API Call:**
```typescript
// lib/api.ts
await api.post('/api/tasks', { title, description, status })

// Automatically adds:
// Authorization: Bearer <token>
```

**4. Backend Receives:**
```javascript
// server/index.js
// Express receives POST /api/tasks
// Routes to server/routes/tasks.js
```

**5. Authentication Check:**
```javascript
// server/routes/tasks.js
router.post('/', authenticate, async (req, res) => {
  // authenticate middleware runs first
  // Verifies JWT token
  // Sets req.user
})
```

**6. Route Handler:**
```javascript
// Validates input
if (!title) return res.status(400).json(...)

// Creates task
const task = new Task({
  title,
  description,
  status,
  user: req.user._id  // From middleware
})

await task.save()
```

**7. Database:**
```javascript
// MongoDB saves task
// Returns saved document
```

**8. Response:**
```javascript
res.status(201).json({ message: '...', task })
```

**9. Frontend Receives:**
```typescript
// Response received
toast.success('Task created successfully!')
router.push('/dashboard/tasks')
```

**10. Tasks Page Refetches:**
```typescript
// useEffect triggers
fetchTasks()
// GET /api/tasks
// Displays updated list
```

---

## 🎯 Key Concepts

### 1. Context API
- Global state for authentication
- Accessible from any component
- Updates trigger re-renders

### 2. Protected Routes
- Client-side: `ProtectedRoute` component
- Server-side: `authenticate` middleware
- Both must pass for access

### 3. JWT Tokens
- Stateless authentication
- Contains user ID
- Signed with secret
- Expires in 7 days

### 4. Password Security
- Never stored in plain text
- Hashed with bcrypt
- Salt rounds: 10
- Comparison on login

### 5. API Integration
- Centralized client (lib/api.ts)
- Automatic token injection
- Error handling
- Loading states

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Next.js    │
│  Frontend   │
│  (Port 3000)│
└──────┬──────┘
       │ HTTP Requests
       │ JWT Token
       ▼
┌─────────────┐
│  Express    │
│  Backend    │
│  (Port 5000)│
└──────┬──────┘
       │
       ├─► Auth Middleware
       │   └─► Verify JWT
       │
       ├─► Route Handler
       │   └─► Process Request
       │
       ▼
┌─────────────┐
│  MongoDB    │
│  Database   │
└─────────────┘
```

---

This walkthrough covers how every part of the application works together to create a complete, secure, and functional task management system!


