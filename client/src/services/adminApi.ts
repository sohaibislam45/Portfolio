import axios from 'axios';
import { getIdToken } from 'firebase/auth';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance for admin API
const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminApi.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await getIdToken(user, true); // Force refresh if needed
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting ID token:', error);
        // Redirect to login if token fetch fails
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    } else {
      // No user, redirect to login
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401/403
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Redirect to login
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard
export const getDashboardStats = () => adminApi.get('/dashboard/stats');

// Projects
export const getProjects = (page = 1, limit = 10) =>
  adminApi.get(`/projects?page=${page}&limit=${limit}`);

export const getProject = (id: string) => adminApi.get(`/projects/${id}`);

export const createProject = (data: FormData) =>
  adminApi.post('/projects', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProject = (id: string, data: FormData) =>
  adminApi.put(`/projects/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProject = (id: string) => adminApi.delete(`/projects/${id}`);

export const reorderProjects = (projects: { id: string; order: number }[]) =>
  adminApi.post('/projects/reorder', { projects });

// Blog
export const getBlogPosts = (page = 1, limit = 10, search?: string) => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) params.append('search', search);
  return adminApi.get(`/blog?${params.toString()}`);
};

export const getBlogPost = (id: string) => adminApi.get(`/blog/${id}`);

export const createBlogPost = (data: any) => adminApi.post('/blog', data);

export const updateBlogPost = (id: string, data: any) => adminApi.put(`/blog/${id}`, data);

export const deleteBlogPost = (id: string) => adminApi.delete(`/blog/${id}`);

// Messages
export const getMessages = (page = 1, limit = 10, read?: boolean) => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (read !== undefined) params.append('read', read.toString());
  return adminApi.get(`/messages?${params.toString()}`);
};

export const getMessage = (id: string) => adminApi.get(`/messages/${id}`);

export const markMessageRead = (id: string, read: boolean) =>
  adminApi.patch(`/messages/${id}/read`, { read });

export const deleteMessage = (id: string) => adminApi.delete(`/messages/${id}`);

// Testimonials
export const getTestimonials = () => adminApi.get('/testimonials');

export const getTestimonial = (id: string) => adminApi.get(`/testimonials/${id}`);

export const createTestimonial = (data: FormData) =>
  adminApi.post('/testimonials', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateTestimonial = (id: string, data: FormData) =>
  adminApi.put(`/testimonials/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteTestimonial = (id: string) => adminApi.delete(`/testimonials/${id}`);

// Users
export const getUsers = () => adminApi.get('/users');

export const getUser = (id: string) => adminApi.get(`/users/${id}`);

export const updateUserRole = (id: string, role: 'admin' | 'user') =>
  adminApi.patch(`/users/${id}/role`, { role });

export const deleteUser = (id: string) => adminApi.delete(`/users/${id}`);

