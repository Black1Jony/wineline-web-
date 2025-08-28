import { create } from "zustand";
import { persist } from "zustand/middleware";

export const favoriteStore = create(
    persist(
        (set) =>({
            favorites: [],
            addFavorite: (item) => set((state) => ({ favorites: [...state.favorites, item] })),
            removeFavorite: (item) => set((state) => ({ favorites: state.favorites.filter(i => i !== item) })),
            clearFavorite: ()=> set({favorites: []}),
            setFavorite: (item) => set({favorites: item})
        }), 
        {
            name: "favorite-storage",
            getStorage: () => localStorage,
        }
    )
)
