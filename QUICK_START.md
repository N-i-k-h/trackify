# Quick Start Guide - How to Run Taskify

## Step-by-Step Instructions

### Step 1: Install Dependencies

Open your terminal in the project root directory (`trackify`) and run:

```bash
npm install
```

This will install all required dependencies for both frontend and backend.

---

### Step 2: Create Environment File

Create a file named `.env.local` in the root directory (`trackify/.env.local`) with this content:

```env
MONGODB_URI=mongodb+srv://nikhilkashyapkn_db_user:track@cluster0.rug2i0s.mongodb.net/taskify?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
NEXT_PUBLIC_API_URL=http://localhost:5000
PORT=5000
```

**Note**: You can create this file manually or copy the content above.

---

### Step 3: Run the Application

You need **TWO terminal windows** open at the same time:

#### Terminal 1 - Backend Server

```bash
npm run dev:server
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

**Keep this terminal open!**

#### Terminal 2 - Frontend

```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

**Keep this terminal open too!**

---

### Step 4: Open in Browser

Open your web browser and go to:

**http://localhost:3000**

You should see the Taskify sign-in page!

---

## What You'll See

1. **Sign In Page** - You can toggle to "Sign Up" to create an account
2. **After Sign Up/In** - You'll be redirected to the Dashboard
3. **Dashboard** - You can:
   - View all your tasks
   - Add new tasks
   - Edit/Delete tasks
   - Search and filter tasks
   - View task statistics
   - Update your profile

---

## Troubleshooting

### If MongoDB connection fails:
- Make sure your internet connection is working
- The MongoDB Atlas cluster should be accessible
- Check if your IP is whitelisted in MongoDB Atlas (if required)

### If port 5000 is already in use:
- Change `PORT=5001` in `.env.local`
- Update `NEXT_PUBLIC_API_URL=http://localhost:5001` in `.env.local`
- Restart both servers

### If port 3000 is already in use:
- Next.js will automatically use the next available port (like 3001)
- Check the terminal output for the actual URL

### If you see "Module not found" errors:
- Make sure you ran `npm install` in the root directory
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

---

## Stopping the Application

To stop the servers:
- Press `Ctrl + C` in each terminal window
- Or close the terminal windows

---

## Summary

1. ✅ `npm install` (once)
2. ✅ Create `.env.local` file (once)
3. ✅ `npm run dev:server` (Terminal 1 - keep running)
4. ✅ `npm run dev` (Terminal 2 - keep running)
5. ✅ Open http://localhost:3000 in browser

That's it! 🎉

