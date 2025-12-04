# MERN Portfolio Website

A modern, animated portfolio website built with the MERN stack, featuring GSAP animations, ScrollTrigger, optional Three.js backgrounds, smooth scrolling, and a complete admin dashboard with Firebase Authentication.

## Tech Stack

### Frontend
- React + TypeScript + Vite
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis (Smooth Scroll)
- Three.js (optional)
- Framer Motion
- React Router
- Firebase Authentication (Email/Password)
- React Hot Toast

### Backend
- Node.js + Express + TypeScript
- MongoDB Atlas + Mongoose
- Express Validator
- Firebase Admin SDK
- Multer (File Uploads)

## Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install all dependencies (client + server):
```bash
npm run install:all
```

3. Set up environment variables:

   **Server (`server/.env`):**
   ```env
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   
   # Server Configuration
   PORT=5000
   CLIENT_URL=http://localhost:5173
   
   # Firebase Admin SDK Configuration
   # Get these from Firebase Console > Project Settings > Service Accounts
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   
   # Optional: Demo Admin UID for seed script
   DEMO_ADMIN_UID=your-firebase-uid-here
   ```

   **Client (`client/.env`):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Configure Firebase:

   a. Go to [Firebase Console](https://console.firebase.google.com/)
   
   b. Create a new project or select existing one
   
   c. Enable Authentication:
      - Go to Authentication > Sign-in method
      - Enable "Email/Password" provider
   
   d. Get Service Account Credentials:
      - Go to Project Settings > Service Accounts
      - Click "Generate new private key"
      - Download the JSON file
      - Extract these values:
        - `project_id` → `FIREBASE_PROJECT_ID`
        - `client_email` → `FIREBASE_CLIENT_EMAIL`
        - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters or replace with actual newlines)

5. Seed the database (optional):
```bash
cd server
npm run seed
```

6. Bootstrap Admin User:

   a. Sign up through the admin login page at `/admin/login`
   
   b. Get your Firebase UID from Firebase Console > Authentication > Users
   
   c. Set admin claim:
   ```bash
   cd server
   npm run set-admin-claim <your-firebase-uid>
   ```
   
   Example:
   ```bash
   npm run set-admin-claim abc123xyz456
   ```

## Running the Application

### Development Mode (runs both client and server)
```bash
npm run dev
```

### Run separately
```bash
# Client only (port 5173)
npm run dev:client

# Server only (port 5000)
npm run dev:server
```

## Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── sections/          # Page sections
│   │   ├── hooks/             # Custom hooks
│   │   ├── animations/        # GSAP utilities
│   │   ├── routes/            # React Router pages
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   └── AdminLogin.tsx # Admin login page
│   │   ├── context/           # React contexts (AuthContext, ThemeContext)
│   │   ├── services/          # API services
│   │   │   ├── api.ts         # Public API
│   │   │   └── adminApi.ts    # Admin API with auth
│   │   ├── config/            # Configuration (Firebase)
│   │   └── types/             # TypeScript types
│   └── ...
├── server/                    # Express backend
│   ├── src/
│   │   ├── models/            # Mongoose models
│   │   │   ├── Project.ts
│   │   │   ├── BlogPost.ts
│   │   │   ├── Message.ts
│   │   │   ├── Testimonial.ts
│   │   │   └── User.ts
│   │   ├── routes/            # API routes
│   │   │   ├── admin/         # Admin routes (protected)
│   │   │   │   ├── dashboard.ts
│   │   │   │   ├── projects.ts
│   │   │   │   ├── blog.ts
│   │   │   │   ├── messages.ts
│   │   │   │   ├── testimonials.ts
│   │   │   │   └── users.ts
│   │   │   ├── projects.ts    # Public project routes
│   │   │   ├── blog.ts        # Public blog routes
│   │   │   └── contact.ts     # Contact form route
│   │   ├── middleware/        # Express middleware
│   │   │   └── auth.ts        # Firebase token verification
│   │   ├── config/            # Configuration
│   │   │   ├── database.ts
│   │   │   └── firebase.ts
│   │   ├── utils/             # Utilities
│   │   │   └── upload.ts      # File upload (multer)
│   │   └── scripts/           # Seed scripts
│   │       ├── seed.ts
│   │       └── set-admin-claim.ts
│   └── ...
└── package.json               # Root package.json
```

## Customization

### Personal Information
- Edit `client/src/sections/Hero.tsx` for hero content
- Edit `client/src/sections/About.tsx` for bio and skills

### Projects Data
- Edit `server/src/scripts/seed.ts` or add directly to MongoDB
- API endpoint: `GET /api/projects`

### Colors & Fonts
- Edit `client/tailwind.config.js` for theme customization

### Three.js Background
- Toggle in `client/src/sections/Hero.tsx` by setting `enableThreeJS` prop

### API Base URL
- Configure in `client/src/services/api.ts` using `VITE_API_URL` environment variable

## Features

### Public Features
- ✨ GSAP timeline-based animations
- 🎯 Scroll-triggered section reveals
- 📝 Text split/distortion heading animations
- 🖱️ Custom cursor with hover reactions
- 🌓 Light/Dark mode toggle
- 🎨 Smooth scrolling between sections
- 🎭 Strong hover animations on cards and buttons
- 🎪 Optional Three.js animated background
- 📱 Fully responsive design

### Admin Features
- 🔐 Firebase Authentication (Email/Password)
- 📊 Dashboard with statistics overview
- 💼 Projects management (CRUD, image upload, reordering)
- 📝 Blog management (CRUD with Markdown support)
- ✉️ Messages management (view, mark read/unread, delete)
- ⭐ Testimonials management (CRUD, image upload, featured toggle)
- 👥 Users management (view, role management)
- 🔒 Role-based access control
- 📤 File upload support (images)
- 🎨 Modern admin UI with Tailwind CSS

## API Endpoints

### Public Endpoints
- `GET /api/projects` - Get all projects
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Require Authentication)
All admin endpoints require a Bearer token in the Authorization header.

**Dashboard:**
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

**Projects:**
- `GET /api/admin/projects` - Get all projects (paginated)
- `GET /api/admin/projects/:id` - Get single project
- `POST /api/admin/projects` - Create project (multipart/form-data)
- `PUT /api/admin/projects/:id` - Update project (multipart/form-data)
- `DELETE /api/admin/projects/:id` - Delete project
- `POST /api/admin/projects/reorder` - Reorder projects

**Blog:**
- `GET /api/admin/blog` - Get all blog posts (paginated, searchable)
- `GET /api/admin/blog/:id` - Get single blog post
- `POST /api/admin/blog` - Create blog post
- `PUT /api/admin/blog/:id` - Update blog post
- `DELETE /api/admin/blog/:id` - Delete blog post

**Messages:**
- `GET /api/admin/messages` - Get all messages (paginated, filterable by read status)
- `GET /api/admin/messages/:id` - Get single message
- `PATCH /api/admin/messages/:id/read` - Mark message as read/unread
- `DELETE /api/admin/messages/:id` - Delete message

**Testimonials:**
- `GET /api/admin/testimonials` - Get all testimonials
- `GET /api/admin/testimonials/:id` - Get single testimonial
- `POST /api/admin/testimonials` - Create testimonial (multipart/form-data)
- `PUT /api/admin/testimonials/:id` - Update testimonial (multipart/form-data)
- `DELETE /api/admin/testimonials/:id` - Delete testimonial

**Users:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PATCH /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## Mongoose Models

### Project
- `title` (String, required)
- `description` (String, required)
- `techStack` (Array of Strings, required)
- `liveUrl` (String, optional)
- `repoUrl` (String, optional)
- `thumbnail` (String, optional)
- `category` (String, required, default: 'full-stack')
- `order` (Number, default: 0)
- `createdAt`, `updatedAt` (timestamps)

### BlogPost
- `title` (String, required)
- `slug` (String, required, unique)
- `content` (String, required)
- `excerpt` (String, optional)
- `tags` (Array of Strings, default: [])
- `createdAt`, `updatedAt` (timestamps)

### Message
- `name` (String, required)
- `email` (String, required)
- `message` (String, required)
- `read` (Boolean, default: false)
- `createdAt`, `updatedAt` (timestamps)

### Testimonial
- `name` (String, required)
- `role` (String, required)
- `company` (String, optional)
- `content` (String, required)
- `avatar` (String, optional)
- `rating` (Number, 1-5, optional)
- `featured` (Boolean, default: false)
- `order` (Number, default: 0)
- `createdAt`, `updatedAt` (timestamps)

### User
- `uid` (String, required, unique) - Firebase UID
- `email` (String, required)
- `role` (String, enum: ['admin', 'user'], default: 'user')
- `createdAt`, `updatedAt` (timestamps)

## Security Checklist for Production

- [ ] Use HTTPS for all API calls
- [ ] Set up proper CORS origins (limit to your domain)
- [ ] Rotate Firebase service account keys regularly
- [ ] Use environment variables for all sensitive data
- [ ] Enable Firebase App Check for additional security
- [ ] Set up rate limiting on API endpoints
- [ ] Validate file uploads (size, type, content)
- [ ] Use secure headers (Helmet is already configured)
- [ ] Regularly update dependencies
- [ ] Set up monitoring and logging
- [ ] Use MongoDB Atlas IP whitelist
- [ ] Enable MongoDB authentication
- [ ] Use strong passwords for admin accounts
- [ ] Implement backup strategy for database

## Testing Checklist

- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Token verification on server
- [ ] Admin access denied for non-admin users
- [ ] Admin access granted for admin users
- [ ] Projects CRUD operations
- [ ] Blog posts CRUD operations
- [ ] Messages read/unread toggle
- [ ] Testimonials CRUD operations
- [ ] User role management
- [ ] File uploads (images)
- [ ] Image validation (size, type)
- [ ] Pagination on list endpoints
- [ ] Search/filter functionality
- [ ] Error handling and toast notifications

## To run this project:
```bash
npm run install:all
```

