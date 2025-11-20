# Taskify API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. User Sign Up

**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` - Validation error or user already exists
- `500` - Server error

---

### 2. User Sign In

**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

### 3. Get Current User

**GET** `/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `401` - Unauthorized (missing or invalid token)
- `500` - Server error

---

## Tasks

### 4. Get All Tasks

**GET** `/tasks`

Get all tasks for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional) - Filter by status: `pending`, `in-progress`, `completed`
- `search` (optional) - Search in title and description

**Example:**
```
GET /tasks?status=pending&search=important
```

**Response (200):**
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Complete project",
      "description": "Finish the task management app",
      "status": "in-progress",
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 5. Create Task

**POST** `/tasks`

Create a new task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Complete project",
    "description": "Finish the task management app",
    "status": "pending",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error (title required)
- `401` - Unauthorized
- `500` - Server error

---

### 6. Update Task

**PUT** `/tasks/:id`

Update an existing task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated title",
    "description": "Updated description",
    "status": "completed",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Task not found
- `401` - Unauthorized
- `500` - Server error

---

### 7. Delete Task

**DELETE** `/tasks/:id`

Delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Responses:**
- `404` - Task not found
- `401` - Unauthorized
- `500` - Server error

---

## Profile

### 8. Get User Profile

**GET** `/profile`

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "profile": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
}
```

---

### 9. Update User Profile

**PUT** `/profile`

Update the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "johnupdated@example.com",
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error or email already in use
- `401` - Unauthorized
- `500` - Server error

---

## Health Check

### 10. Health Check

**GET** `/health`

Check if the server is running.

**Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error message description"
}
```

In development mode, additional error details may be included.

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

