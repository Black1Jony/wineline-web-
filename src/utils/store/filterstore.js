import { create } from "zustand";

export const useFilterStore = create((set, get) => ({
  type: "wine",
  filters: {},

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

  resetFilters: () => set({ filters: {} }),
}));
