import { create } from 'zustand';

export type ViewMode = 'home' | 'blog' | 'author' | 'article' | 'focus';

interface AppState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activePostSlug: string | null;
  setActivePostSlug: (slug: string | null) => void;
  isFocusing: boolean;
  setIsFocusing: (focus: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  viewMode: 'home',
  setViewMode: (mode) => set({ viewMode: mode }),
  activePostSlug: null,
  setActivePostSlug: (slug) => set({ activePostSlug: slug }),
  isFocusing: false,
  setIsFocusing: (focus) => set({ isFocusing: focus }),
}));
