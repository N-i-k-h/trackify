# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   
   Create a `.env.local` file in the root directory with the following content:
   ```env
   MONGODB_URI=mongodb+srv://nikhilkashyapkn_db_user:track@cluster0.rug2i0s.mongodb.net/taskify?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
   NEXT_PUBLIC_API_URL=http://localhost:5000
   PORT=5000
   ```

3. **Start the Application**

   Open two terminal windows:

   **Terminal 1 - Backend Server:**
   ```bash
   npm run dev:server
   ```
   The backend will run on `http://localhost:5000`

   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

4. **Access the Application**
   
   Open your browser and navigate to:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

## Testing the API

You can use the provided Postman collection (`Taskify.postman_collection.json`) to test all API endpoints.

1. Import the collection into Postman
2. The collection includes automatic token management - sign up or sign in first, and the token will be saved automatically
3. Test all endpoints including tasks CRUD operations

## Project Structure

```
taskify/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   │   ├── signin/       # Sign in page
│   │   └── signup/       # Sign up page
│   ├── dashboard/         # Dashboard pages
│   │   ├── tasks/        # Tasks list page
│   │   ├── add-task/     # Add/Edit task page
│   │   ├── task-status/  # Task statistics page
│   │   └── profile/      # User profile page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── ProtectedRoute.tsx
├── lib/                  # Utility functions
│   ├── auth.tsx          # Authentication context
│   └── api.ts            # API client
├── server/               # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── index.js          # Server entry point
├── package.json
├── tailwind.config.js
└── README.md
```

## Features Implemented

✅ User Authentication (Sign Up, Sign In, Logout)
✅ JWT-based authentication
✅ Protected routes
✅ Task CRUD operations
✅ Search and filter tasks
✅ User profile management
✅ Task status tracking
✅ Responsive design with TailwindCSS
✅ Dark theme UI matching the design
✅ Form validation (client & server side)
✅ Error handling
✅ Password hashing with bcrypt

## Troubleshooting

### MongoDB Connection Issues
- Ensure your MongoDB connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas (if using Atlas)
- Verify network connectivity

### Port Already in Use
- Change the PORT in `.env.local` if 5000 is already in use
- Update `NEXT_PUBLIC_API_URL` accordingly

### CORS Errors
- Ensure backend is running before frontend
- Check that `NEXT_PUBLIC_API_URL` matches your backend URL

## Next Steps

1. Review the API documentation in `API_DOCUMENTATION.md`
2. Check scalability notes in `SCALABILITY_NOTES.md`
3. Import and test the Postman collection
4. Customize the application as needed

