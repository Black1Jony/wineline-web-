import { create } from "zustand";

export const useCountStore = create(set =>({
    count: 0,
    decrement: () => set(state => ({ count: state.count - 1 })),
    setCount: (counter) => set({ count: counter })
}))