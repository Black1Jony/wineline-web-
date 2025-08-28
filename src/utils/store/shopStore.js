import { create } from "zustand";
import { persist } from "zustand/middleware";

export const shopStore = create(
  persist(
    (set) => ({
      products: [],

      addProduct: (product) =>
        set((state) => {
          const existing = state.products.find(
            (p) => p.product === product.product
          );
          if (existing) {
            return {
              products: state.products.map((p) =>
                p.product === product.product
                  ? { ...p, count: (p.count || 0) + (product.count || 1) }
                  : p
              ),
            };
          }
          return {
            products: [
              ...state.products,
              { ...product, count: product.count || 1, price: product.price }, // по умолчанию 1
            ],
          };
        }),

      productPlus: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.product === id ? { ...p, count: (p.count || 0) + 1 } : p
          ),
        })),

      productMinus: (id) =>
        set((state) => ({
          products: state.products
            .filter((p) => {
              if (p.product === id) {
                return p.count > 1; 
              }
              return true;
            })
            .map((p) => (p.product === id ? { ...p, count: p.count - 1 } : p)),
        })),

      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.product !== id),
        })),

      clearProducts: () => set({ products: [] }),
      setProduct: (item)=> set({products: item})
    }),
    {
      name: "shop-storage",
      getStorage: () => localStorage,
    }
  )
);
