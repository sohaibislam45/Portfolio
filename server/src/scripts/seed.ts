import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Project from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';

dotenv.config();

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
    liveUrl: 'https://example.com/ecommerce',
    repoUrl: 'https://github.com/example/ecommerce',
    thumbnail: 'https://via.placeholder.com/600x400',
    category: 'full-stack',
    order: 1,
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    techStack: ['React', 'TypeScript', 'Socket.io', 'MongoDB'],
    liveUrl: 'https://example.com/tasks',
    repoUrl: 'https://github.com/example/tasks',
    thumbnail: 'https://via.placeholder.com/600x400',
    category: 'full-stack',
    order: 2,
  },
  {
    title: 'Portfolio Website',
    description: 'A modern, animated portfolio website showcasing projects and skills with smooth scrolling and interactive animations.',
    techStack: ['React', 'GSAP', 'Tailwind CSS', 'Three.js'],
    liveUrl: 'https://example.com/portfolio',
    repoUrl: 'https://github.com/example/portfolio',
    thumbnail: 'https://via.placeholder.com/600x400',
    category: 'frontend',
    order: 3,
  },
  {
    title: 'REST API Service',
    description: 'A robust RESTful API service with authentication, rate limiting, and comprehensive documentation.',
    techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    liveUrl: 'https://api.example.com',
    repoUrl: 'https://github.com/example/api',
    thumbnail: 'https://via.placeholder.com/600x400',
    category: 'backend',
    order: 4,
  },
  {
    title: 'Social Media Dashboard',
    description: 'A comprehensive dashboard for managing social media accounts with analytics, scheduling, and engagement tracking.',
    techStack: ['React', 'Chart.js', 'Node.js', 'PostgreSQL'],
    liveUrl: 'https://example.com/dashboard',
    repoUrl: 'https://github.com/example/dashboard',
    thumbnail: 'https://via.placeholder.com/600x400',
    category: 'full-stack',
    order: 5,
  },
];

const blogPosts = [
  {
    title: 'Getting Started with GSAP Animations',
    slug: 'getting-started-with-gsap-animations',
    content: `
# Getting Started with GSAP Animations

GSAP (GreenSock Animation Platform) is a powerful JavaScript library for creating high-performance animations. In this post, we'll explore the basics of GSAP and how to integrate it into your React projects.

## Why GSAP?

GSAP offers several advantages over CSS animations:
- Better performance
- More control and flexibility
- Cross-browser compatibility
- Timeline-based animations
- ScrollTrigger for scroll-based animations

## Basic Usage

\`\`\`javascript
import { gsap } from 'gsap';

gsap.to('.element', {
  x: 100,
  duration: 1,
  ease: 'power2.out'
});
\`\`\`

## ScrollTrigger

ScrollTrigger is a powerful plugin that lets you trigger animations based on scroll position.

\`\`\`javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.from('.element', {
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
  },
  opacity: 0,
  y: 50,
  duration: 1
});
\`\`\`

## Conclusion

GSAP is an excellent choice for creating smooth, performant animations in modern web applications.
    `,
    excerpt: 'Learn how to create smooth, performant animations using GSAP in your React projects.',
    tags: ['GSAP', 'Animation', 'React', 'JavaScript'],
  },
  {
    title: 'Building a MERN Stack Application',
    slug: 'building-a-mern-stack-application',
    content: `
# Building a MERN Stack Application

The MERN stack (MongoDB, Express, React, Node.js) is a popular choice for building full-stack web applications. In this guide, we'll walk through building a complete application from scratch.

## What is MERN?

- **MongoDB**: NoSQL database
- **Express**: Web framework for Node.js
- **React**: Frontend library
- **Node.js**: JavaScript runtime

## Setting Up the Backend

First, let's set up our Express server:

\`\`\`javascript
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
\`\`\`

## Setting Up the Frontend

Create a React app and set up your API calls:

\`\`\`javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});
\`\`\`

## Conclusion

The MERN stack provides a complete solution for building modern web applications with JavaScript throughout the stack.
    `,
    excerpt: 'A comprehensive guide to building a full-stack application using MongoDB, Express, React, and Node.js.',
    tags: ['MERN', 'Full-Stack', 'MongoDB', 'React', 'Node.js'],
  },
  {
    title: 'Mastering TypeScript in React',
    slug: 'mastering-typescript-in-react',
    content: `
# Mastering TypeScript in React

TypeScript brings type safety to React development, helping catch errors early and improving code quality. Let's explore how to effectively use TypeScript in React projects.

## Why TypeScript?

- Type safety
- Better IDE support
- Improved refactoring
- Self-documenting code

## Basic Types

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
\`\`\`

## Hooks with TypeScript

\`\`\`typescript
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
\`\`\`

## Conclusion

TypeScript enhances React development by providing type safety and better developer experience.
    `,
    excerpt: 'Learn how to leverage TypeScript to build more robust and maintainable React applications.',
    tags: ['TypeScript', 'React', 'Type Safety'],
  },
];

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await Project.deleteMany({});
    await BlogPost.deleteMany({});

    // Insert projects
    const createdProjects = await Project.insertMany(projects);
    console.log(`Created ${createdProjects.length} projects`);

    // Insert blog posts
    const createdPosts = await BlogPost.insertMany(blogPosts);
    console.log(`Created ${createdPosts.length} blog posts`);

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

