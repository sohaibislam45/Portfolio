# MERN Portfolio Website

A modern, animated portfolio website built with the MERN stack, featuring GSAP animations, ScrollTrigger, optional Three.js backgrounds, and smooth scrolling.

## Tech Stack

### Frontend
- React + TypeScript + Vite
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis (Smooth Scroll)
- Three.js (optional)
- Framer Motion
- React Router

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Express Validator

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
   - The `.env` file has been created with MongoDB Atlas connection
   - MongoDB Atlas connection string is configured:
     ```
     MONGODB_URI=mongodb+srv://sohaibislam45_db_user:RDotRMYtek6V03Tp@cluster0.qhmatus.mongodb.net/portfolio?appName=Cluster0
     PORT=5000
     ```
   - For local MongoDB, update `server/.env` with:
     ```
     MONGODB_URI=mongodb://localhost:27017/portfolio
     PORT=5000
     ```

4. Seed the database (optional):
```bash
cd server
npm run seed
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
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── sections/    # Page sections
│   │   ├── hooks/       # Custom hooks
│   │   ├── animations/  # GSAP utilities
│   │   ├── routes/      # React Router pages
│   │   ├── context/     # React contexts
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript types
│   └── ...
├── server/          # Express backend
│   ├── src/
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── config/      # Configuration
│   │   └── scripts/     # Seed scripts
│   └── ...
└── package.json     # Root package.json
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

- ✨ GSAP timeline-based animations
- 🎯 Scroll-triggered section reveals
- 📝 Text split/distortion heading animations
- 🖱️ Custom cursor with hover reactions
- 🌓 Light/Dark mode toggle
- 🎨 Smooth scrolling between sections
- 🎭 Strong hover animations on cards and buttons
- 🎪 Optional Three.js animated background
- 📱 Fully responsive design

## To run this project:
npm run install:all

