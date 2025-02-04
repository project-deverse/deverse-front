import { writable } from 'svelte/store';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

function createBlogPostStore() {
  const { subscribe, set, update } = writable<BlogPost | null>(null);

  return {
    subscribe,
    setPost: (post: BlogPost) => set(post),
    updatePost: (updates: Partial<BlogPost>) => update(post => {
      if (post) {
        return { ...post, ...updates };
      }
      return post;
    }),
    clearPost: () => set(null),
  };
}

export const blogPostStore = createBlogPostStore();