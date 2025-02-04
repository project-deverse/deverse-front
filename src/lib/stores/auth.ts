import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  role: 'author' | 'user';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    isAuthenticated: false,
    user: null
  });

  return {
    subscribe,
    login: (user: User) => {
      set({ isAuthenticated: true, user });
      if (browser) {
        localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user }));
      }
    },
    logout: () => {
      set({ isAuthenticated: false, user: null });
      if (browser) {
        localStorage.removeItem('auth');
      }
    },
    updateUser: (updatedUser: Partial<User>) => {
      update(state => {
        if (state.user) {
          const newUser = { ...state.user, ...updatedUser };
          const newState = { ...state, user: newUser };
          if (browser) {
            localStorage.setItem('auth', JSON.stringify(newState));
          }
          return newState;
        }
        return state;
      });
    },
    checkAuth: () => {
      if (browser) {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          set(JSON.parse(storedAuth));
        }
      }
    },
    get: () => {
      let authState: AuthState = { isAuthenticated: false, user: null };
      subscribe(state => {
        authState = state;
      })();
      return authState;
    }
  };
}

export const auth = createAuthStore();