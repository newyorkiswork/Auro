"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity?: number
  image?: string
  retailer?: string
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalPrice: number
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  totalPrice: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("auro_cart")
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  // Update localStorage and derived state when items change
  useEffect(() => {
    localStorage.setItem("auro_cart", JSON.stringify(items))

    const count = items.reduce((total, item) => total + (item.quantity || 1), 0)
    setItemCount(count)

    const price = items.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
    setTotalPrice(price)
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        return prevItems.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: (i.quantity || 1) + 1 } : i,
        )
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
