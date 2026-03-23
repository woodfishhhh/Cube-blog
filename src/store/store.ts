import { create } from 'zustand'

export type ViewMode = 'home' | 'blog' | 'author' | 'friend' | 'reading' | 'focus';

interface State {
  mode: ViewMode;
  isFocusing: boolean; // True when user clicked cube to inspect it freely
  activePostId: string | null;

  setMode: (mode: ViewMode) => void;
  setFocusing: (focusing: boolean) => void;
  setActivePost: (id: string | null) => void;

  // Navigation actions
  goHome: () => void;
  goBlog: () => void;
  goAuthor: () => void;
  goFriend: () => void;
  enterReading: (postId: string) => void;
  enterFocus: () => void;
  exitFocus: () => void;

  cubeStep: number;
  triggerStep: () => void;
}

export const useStore = create<State>((set) => ({
  mode: 'home',
  isFocusing: false,
  activePostId: null,

  setMode: (mode) => set({ mode }),
  setFocusing: (focusing) => set({ isFocusing: focusing }),
  setActivePost: (id) => set({ activePostId: id }),

  goHome: () => set({ mode: 'home', isFocusing: false, activePostId: null }),
  goBlog: () => set({ mode: 'blog', isFocusing: false, activePostId: null }),
  goAuthor: () => set({ mode: 'author', isFocusing: false, activePostId: null }),
  goFriend: () => set({ mode: 'friend', isFocusing: false, activePostId: null }),

  enterReading: (postId) => set({ mode: 'reading', activePostId: postId, isFocusing: false }),

  enterFocus: () => set({ isFocusing: true }),
  exitFocus: () => set({ isFocusing: false }),

  cubeStep: 0,
  triggerStep: () => set((state) => ({ cubeStep: state.cubeStep + 1 })),
}))
