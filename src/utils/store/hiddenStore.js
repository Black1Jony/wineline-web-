import { create } from "zustand";

export const hiddenStore = create((set) => ({
  hiddenProduct: [],
  hideAProduct: (id) =>
    set((state) => ({
      hiddenProduct: [...state.hiddenProduct, id],
    })),
}));
