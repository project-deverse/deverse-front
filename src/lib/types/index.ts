export interface User {
    id: string;
    name: string;
    email: string;
    role: 'author' | 'user';
  }
  
  export interface BlogPost {
    id: string;
    title: string;
    content: string;
    thumbnail: string | null;
    authorId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BlogPostSummary {
    id: string;
    title: string;
    excerpt: string;
    thumbnail: string | null;
    authorId: string;
    createdAt: string;
  }
  
  export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    content: string;
    createdAt: string;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }