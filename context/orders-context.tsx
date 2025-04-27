"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useUser } from "@/context/user-context"
import { useCart } from "@/context/cart-context"

export interface TrackingEvent {
  status: string
  timestamp: string
  location: string
  description: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  userId: string
  date: string
  items: OrderItem[]
  total: number
  status: string
  trackingNumber?: string
  estimatedDelivery?: string
  trackingEvents?: TrackingEvent[]
}

interface OrdersContextType {
  orders: Order[]
  placeOrder: () => Promise<Order | null>
  cancelOrder: (orderId: string) => Promise<boolean>
  getOrder: (orderId: string) => Order | undefined
}

// Mock orders data
const MOCK_ORDERS: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "product-1",
        name: "Eco-Clean Detergent",
        price: 12.99,
        quantity: 2,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "product-4",
        name: "Natural Wool Dryer Balls",
        price: 14.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    total: 40.97,
    status: "delivered",
    trackingNumber: "TRK123456789",
    estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    trackingEvents: [
      {
        status: "Order Placed",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Online",
        description: "Your order has been placed successfully.",
      },
      {
        status: "Order Confirmed",
        timestamp: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Warehouse",
        description: "Your order has been confirmed and is being processed.",
      },
      {
        status: "Shipped",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Distribution Center",
        description: "Your order has been shipped and is on its way.",
      },
      {
        status: "Out for Delivery",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Local Delivery Center",
        description: "Your order is out for delivery and will arrive soon.",
      },
      {
        status: "Delivered",
        timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Your Address",
        description: "Your order has been delivered successfully.",
      },
    ],
  },
  {
    id: "order-2",
    userId: "user-1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "product-2",
        name: "Fresh Breeze Softener",
        price: 7.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    total: 7.99,
    status: "shipped",
    trackingNumber: "TRK987654321",
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    trackingEvents: [
      {
        status: "Order Placed",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Online",
        description: "Your order has been placed successfully.",
      },
      {
        status: "Order Confirmed",
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Warehouse",
        description: "Your order has been confirmed and is being processed.",
      },
      {
        status: "Shipped",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Distribution Center",
        description: "Your order has been shipped and is on its way.",
      },
    ],
  },
]

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  placeOrder: async () => null,
  cancelOrder: async () => false,
  getOrder: () => undefined,
})

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const { user } = useUser()
  const { items, totalPrice, clearCart } = useCart()

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem("auro_orders")
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    } else {
      setOrders(MOCK_ORDERS)
    }
  }, [])

  // Update localStorage when orders change
  useEffect(() => {
    // Only update localStorage if orders have actually changed and aren't empty
    if (orders.length > 0) {
      const storedOrdersString = localStorage.getItem("auro_orders")
      const currentOrdersString = JSON.stringify(orders)

      // Only update if the stringified orders are different
      if (storedOrdersString !== currentOrdersString) {
        localStorage.setItem("auro_orders", currentOrdersString)
      }
    }
  }, [orders])

  const placeOrder = async (): Promise<Order | null> => {
    if (!user) return null
    if (items.length === 0) return null

    // DEMO: Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
      })),
      total: totalPrice,
      status: "order_placed",
      trackingNumber: `TRK${Math.floor(Math.random() * 1000000000)}`,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      trackingEvents: [
        {
          status: "Order Placed",
          timestamp: new Date().toISOString(),
          location: "Online",
          description: "Your order has been placed successfully.",
        },
      ],
    }

    setOrders((prevOrders) => [newOrder, ...prevOrders])
    clearCart()

    return newOrder
  }

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    // DEMO: Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const order = orders.find((o) => o.id === orderId)
    if (!order) return false

    // Only allow cancellation for certain statuses
    if (["delivered", "cancelled"].includes(order.status)) {
      return false
    }

    setOrders((prevOrders) => prevOrders.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)))

    return true
  }

  const getOrder = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id === orderId)
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        placeOrder,
        cancelOrder,
        getOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)
