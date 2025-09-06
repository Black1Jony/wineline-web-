import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCommentStore = create(
  persist(
    (set, get) => ({
      userData: null,
      userInteractions: {}, // { commentId: 'like' | 'dislike' | null }
      
      setUserData: (data) => set({ userData: data }),
      
      setUserInteraction: (commentId, interaction) => set((state) => ({
        userInteractions: {
          ...state.userInteractions,
          [commentId]: interaction
        }
      })),
      
      getUserInteraction: (commentId) => get().userInteractions[commentId] || null,
      
      clearUserInteraction: (commentId) => set((state) => {
        const newInteractions = { ...state.userInteractions };
        delete newInteractions[commentId];
        return { userInteractions: newInteractions };
      }),
      
      reset: () => set({ userData: null, userInteractions: {} })
    }),
    {
      name: 'comment-store',
      partialize: (state) => ({ userInteractions: state.userInteractions })
    }
  )
);

export default useCommentStore;
