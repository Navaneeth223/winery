import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* ————————————————— UI state (not persisted) ————————————————— */

interface UIState {
  ready: boolean // preloader finished
  chapter: string
  navTheme: 'dark' | 'light' // 'light' = page bg is light → nav uses dark text
  navSolid: boolean
  menuOpen: boolean
  cartOpen: boolean
  detailId: string | null
  toast: { id: number; msg: string } | null
  setReady: (b: boolean) => void
  setChapter: (c: string) => void
  setNavTheme: (t: 'dark' | 'light') => void
  setNavSolid: (b: boolean) => void
  setMenuOpen: (b: boolean) => void
  openCart: () => void
  closeCart: () => void
  openDetail: (id: string) => void
  closeDetail: () => void
  showToast: (msg: string) => void
  clearToast: (id: number) => void
}

let toastId = 0

export const useUI = create<UIState>((set) => ({
  ready: false,
  chapter: '01 · The Land',
  navTheme: 'dark',
  navSolid: false,
  menuOpen: false,
  cartOpen: false,
  detailId: null,
  toast: null,
  setReady: (b) => set({ ready: b }),
  setChapter: (c) => set({ chapter: c }),
  setNavTheme: (t) => set({ navTheme: t }),
  setNavSolid: (b) => set({ navSolid: b }),
  setMenuOpen: (b) => set({ menuOpen: b }),
  openCart: () => set({ cartOpen: true, menuOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openDetail: (id) => set({ detailId: id }),
  closeDetail: () => set({ detailId: null }),
  showToast: (msg) => set({ toast: { id: ++toastId, msg } }),
  clearToast: (id) => set((s) => (s.toast?.id === id ? { toast: null } : {})),
}))

/* ————————————————— commerce state (persisted) ————————————————— */

export interface CartItem {
  id: string
  qty: number
}

interface CartState {
  items: CartItem[]
  wishlist: string[]
  add: (id: string, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  toggleWish: (id: string) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      wishlist: [],
      add: (id, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === id)
          const items = existing
            ? s.items.map((i) => (i.id === id ? { ...i, qty: Math.min(12, i.qty + qty) } : i))
            : [...s.items, { id, qty }]
          return { items }
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty: Math.min(12, qty) } : i)),
        })),
      toggleWish: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'oree-cart-v1' },
  ),
)
