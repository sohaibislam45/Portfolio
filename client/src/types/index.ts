export interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  thumbnail?: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  name: string;
  email: string;
  message: string;
}

export type Theme = 'light' | 'dark';

