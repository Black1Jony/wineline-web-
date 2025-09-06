import { create } from "zustand";

export const useFilterStore = create((set, get) => ({
  type: "wine",
  filters: {},
  sortBy: "default",

  setType: (type) => set({ type }),

  setFilter: (name, value) => {
    const currentFilters = get().filters;
    set({
      filters: {
        ...currentFilters,
        [name]: value,
      },
    });
  },

  setSortBy: (sortBy) => set({ sortBy }),

  resetFilters: () => set({ filters: {}, sortBy: "default" }),
}));
