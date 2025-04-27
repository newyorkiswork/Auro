"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useUser } from "@/context/user-context"

export interface Machine {
  id: string
  type: "washer" | "dryer"
  number: string
  status: "available" | "in_use" | "out_of_order"
  timeRemaining?: number // in minutes
  price: number
  capacity: "small" | "medium" | "large"
}

export interface Laundromat {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  distance: number // in miles
  rating: number
  hours: string
  machines: Machine[]
  amenities: string[]
  payment_systems: string[]
  image: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Booking {
  id: string
  userId: string
  laundromatId: string
  laundromatName: string
  machineId: string
  machineType: "washer" | "dryer"
  machineNumber: string
  startTime: string
  endTime: string
  status: "upcoming" | "active" | "completed" | "cancelled"
}

interface BookingContextType {
  laundromats: Laundromat[]
  bookings: Booking[]
  filteredLaundromats: Laundromat[]
  selectedLaundromat: Laundromat | null
  payrangeStatus: Record<string, "Available" | "Busy" | "Status Check Unavailable - Demo">
  setSelectedLaundromat: (laundromat: Laundromat | null) => void
  filterLaundromats: (filters: Partial<LaundryFilters>) => void
  checkPayrangeStatus: (laundromatId: string) => Promise<void>
  bookMachine: (laundromatId: string, machineId: string) => Promise<Booking>
  cancelBooking: (bookingId: string) => Promise<boolean>
}

export interface LaundryFilters {
  paymentSystem: string[]
  machineType: ("washer" | "dryer")[]
  distance: number
  amenities: string[]
}

// Mock laundromats data
const MOCK_LAUNDROMATS: Laundromat[] = [
  {
    id: "laundromat-1",
    name: "Clean & Fresh Laundry",
    address: "123 Main St",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11201",
    distance: 0.5,
    rating: 4.5,
    hours: "6:00 AM - 10:00 PM",
    machines: [
      {
        id: "machine-1",
        type: "washer",
        number: "W1",
        status: "available",
        price: 2.5,
        capacity: "medium",
      },
      {
        id: "machine-2",
        type: "washer",
        number: "W2",
        status: "in_use",
        timeRemaining: 15,
        price: 2.5,
        capacity: "medium",
      },
      {
        id: "machine-3",
        type: "washer",
        number: "W3",
        status: "available",
        price: 3.0,
        capacity: "large",
      },
      {
        id: "machine-4",
        type: "washer",
        number: "W4",
        status: "available",
        price: 2.0,
        capacity: "small",
      },
      {
        id: "machine-5",
        type: "dryer",
        number: "D1",
        status: "available",
        price: 1.75,
        capacity: "large",
      },
      {
        id: "machine-6",
        type: "dryer",
        number: "D2",
        status: "available",
        price: 1.75,
        capacity: "large",
      },
      {
        id: "machine-7",
        type: "dryer",
        number: "D3",
        status: "in_use",
        timeRemaining: 25,
        price: 1.75,
        capacity: "large",
      },
    ],
    amenities: ["WiFi", "Seating", "Vending Machines", "Restroom", "Folding Tables"],
    payment_systems: ["PayRange", "Coin"],
    image: "/bright-laundromat.png",
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    id: "laundromat-2",
    name: "Spin Cycle Laundromat",
    address: "456 Market St",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11215",
    distance: 1.2,
    rating: 4.2,
    hours: "24 hours",
    machines: [
      {
        id: "machine-8",
        type: "washer",
        number: "W1",
        status: "available",
        price: 3.0,
        capacity: "large",
      },
      {
        id: "machine-9",
        type: "washer",
        number: "W2",
        status: "available",
        price: 2.25,
        capacity: "small",
      },
      {
        id: "machine-10",
        type: "washer",
        number: "W3",
        status: "in_use",
        timeRemaining: 18,
        price: 3.0,
        capacity: "large",
      },
      {
        id: "machine-11",
        type: "washer",
        number: "W4",
        status: "available",
        price: 2.25,
        capacity: "small",
      },
      {
        id: "machine-12",
        type: "dryer",
        number: "D1",
        status: "out_of_order",
        price: 2.0,
        capacity: "medium",
      },
      {
        id: "machine-13",
        type: "dryer",
        number: "D2",
        status: "available",
        price: 2.0,
        capacity: "medium",
      },
      {
        id: "machine-14",
        type: "dryer",
        number: "D3",
        status: "available",
        price: 2.0,
        capacity: "medium",
      },
    ],
    amenities: ["WiFi", "Folding Tables", "Attendant", "Air Conditioning", "TV"],
    payment_systems: ["Coin", "Credit Card"],
    image: "/bright-laundromat.png",
    coordinates: {
      lat: 37.7899,
      lng: -122.4014,
    },
  },
  {
    id: "laundromat-3",
    name: "Bubble Wash",
    address: "789 Howard St",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11231",
    distance: 0.8,
    rating: 4.8,
    hours: "7:00 AM - 11:00 PM",
    machines: [
      {
        id: "machine-15",
        type: "washer",
        number: "W1",
        status: "available",
        price: 2.75,
        capacity: "medium",
      },
      {
        id: "machine-16",
        type: "washer",
        number: "W2",
        status: "in_use",
        timeRemaining: 25,
        price: 3.5,
        capacity: "large",
      },
      {
        id: "machine-17",
        type: "washer",
        number: "W3",
        status: "available",
        price: 2.75,
        capacity: "medium",
      },
      {
        id: "machine-18",
        type: "washer",
        number: "W4",
        status: "available",
        price: 3.5,
        capacity: "large",
      },
      {
        id: "machine-19",
        type: "washer",
        number: "W5",
        status: "in_use",
        timeRemaining: 12,
        price: 2.75,
        capacity: "medium",
      },
      {
        id: "machine-20",
        type: "dryer",
        number: "D1",
        status: "available",
        price: 2.0,
        capacity: "large",
      },
      {
        id: "machine-21",
        type: "dryer",
        number: "D2",
        status: "available",
        price: 2.0,
        capacity: "large",
      },
      {
        id: "machine-22",
        type: "dryer",
        number: "D3",
        status: "available",
        price: 2.0,
        capacity: "large",
      },
    ],
    amenities: ["WiFi", "Seating", "Detergent Vending", "Snack Machines", "Charging Stations"],
    payment_systems: ["PayRange", "Credit Card"],
    image: "/modern-wash-day.png",
    coordinates: {
      lat: 37.7829,
      lng: -122.4074,
    },
  },
  {
    id: "laundromat-4",
    name: "Laundry Express",
    address: "321 Pine St",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11222",
    distance: 1.5,
    rating: 3.9,
    hours: "6:00 AM - 10:00 PM",
    machines: [
      {
        id: "machine-23",
        type: "washer",
        number: "W1",
        status: "available",
        price: 2.25,
        capacity: "medium",
      },
      {
        id: "machine-24",
        type: "washer",
        number: "W2",
        status: "available",
        price: 2.25,
        capacity: "medium",
      },
      {
        id: "machine-25",
        type: "washer",
        number: "W3",
        status: "out_of_order",
        price: 2.25,
        capacity: "medium",
      },
      {
        id: "machine-26",
        type: "dryer",
        number: "D1",
        status: "available",
        price: 1.5,
        capacity: "medium",
      },
      {
        id: "machine-27",
        type: "dryer",
        number: "D2",
        status: "available",
        price: 1.5,
        capacity: "medium",
      },
      {
        id: "machine-28",
        type: "dryer",
        number: "D3",
        status: "in_use",
        timeRemaining: 35,
        price: 1.5,
        capacity: "medium",
      },
    ],
    amenities: ["WiFi", "Vending Machines", "Folding Tables"],
    payment_systems: ["Coin", "Credit Card"],
    image: "/sunny-wash-day.png",
    coordinates: {
      lat: 37.7929,
      lng: -122.4094,
    },
  },
  {
    id: "laundromat-5",
    name: "Wash & Fold Center",
    address: "555 Mission St",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11205",
    distance: 1.8,
    rating: 4.7,
    hours: "5:00 AM - 12:00 AM",
    machines: [
      {
        id: "machine-29",
        type: "washer",
        number: "W1",
        status: "available",
        price: 3.0,
        capacity: "large",
      },
      {
        id: "machine-30",
        type: "washer",
        number: "W2",
        status: "available",
        price: 3.0,
        capacity: "large",
      },
      {
        id: "machine-31",
        type: "washer",
        number: "W3",
        status: "in_use",
        timeRemaining: 22,
        price: 3.0,
        capacity: "large",
      },
      {
        id: "machine-32",
        type: "washer",
        number: "W4",
        status: "available",
        price: 2.5,
        capacity: "medium",
      },
      {
        id: "machine-33",
        type: "washer",
        number: "W5",
        status: "available",
        price: 2.5,
        capacity: "medium",
      },
      {
        id: "machine-34",
        type: "dryer",
        number: "D1",
        status: "available",
        price: 2.25,
        capacity: "large",
      },
      {
        id: "machine-35",
        type: "dryer",
        number: "D2",
        status: "available",
        price: 2.25,
        capacity: "large",
      },
      {
        id: "machine-36",
        type: "dryer",
        number: "D3",
        status: "available",
        price: 2.25,
        capacity: "large",
      },
      {
        id: "machine-37",
        type: "dryer",
        number: "D4",
        status: "in_use",
        timeRemaining: 15,
        price: 2.25,
        capacity: "large",
      },
    ],
    amenities: ["WiFi", "Seating", "Attendant", "Folding Service", "Dry Cleaning", "Restroom", "Coffee Machine"],
    payment_systems: ["PayRange", "Coin", "Credit Card"],
    image: "/modern-laundromat-interior.png",
    coordinates: {
      lat: 37.7879,
      lng: -122.3984,
    },
  },
]

// Mock bookings data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    laundromatId: "laundromat-1",
    laundromatName: "Clean & Fresh Laundry",
    machineId: "machine-1",
    machineType: "washer",
    machineNumber: "W1",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    status: "upcoming",
  },
  {
    id: "booking-2",
    userId: "user-1",
    laundromatId: "laundromat-3",
    laundromatName: "Bubble Wash",
    machineId: "machine-20",
    machineType: "dryer",
    machineNumber: "D1",
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "booking-3",
    userId: "user-1",
    laundromatId: "laundromat-2",
    laundromatName: "Spin Cycle Laundromat",
    machineId: "machine-8",
    machineType: "washer",
    machineNumber: "W1",
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
]

const BookingContext = createContext<BookingContextType>({
  laundromats: [],
  bookings: [],
  filteredLaundromats: [],
  selectedLaundromat: null,
  payrangeStatus: {},
  setSelectedLaundromat: () => {},
  filterLaundromats: () => {},
  checkPayrangeStatus: async () => {},
  bookMachine: async () => ({
    id: "",
    userId: "",
    laundromatId: "",
    laundromatName: "",
    machineId: "",
    machineType: "washer",
    machineNumber: "",
    startTime: "",
    endTime: "",
    status: "upcoming",
  }),
  cancelBooking: async () => false,
})

export function BookingProvider({ children }: { children: ReactNode }) {
  const [laundromats, setLaundromats] = useState<Laundromat[]>([])
  const [filteredLaundromats, setFilteredLaundromats] = useState<Laundromat[]>([])
  const [selectedLaundromat, setSelectedLaundromat] = useState<Laundromat | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payrangeStatus, setPayrangeStatus] = useState<
    Record<string, "Available" | "Busy" | "Status Check Unavailable - Demo">
  >({})
  const { user } = useUser()

  // Load data from localStorage on mount
  useEffect(() => {
    const storedLaundromats = localStorage.getItem("auro_laundromats")
    const storedBookings = localStorage.getItem("auro_bookings")

    if (storedLaundromats) {
      try {
        const parsedLaundromats = JSON.parse(storedLaundromats)
        setLaundromats(parsedLaundromats)
        setFilteredLaundromats(parsedLaundromats)
      } catch (error) {
        console.error("Error parsing stored laundromats:", error)
        setLaundromats(MOCK_LAUNDROMATS)
        setFilteredLaundromats(MOCK_LAUNDROMATS)
      }
    } else {
      setLaundromats(MOCK_LAUNDROMATS)
      setFilteredLaundromats(MOCK_LAUNDROMATS)
    }

    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings))
      } catch (error) {
        console.error("Error parsing stored bookings:", error)
        setBookings(MOCK_BOOKINGS)
      }
    } else {
      setBookings(MOCK_BOOKINGS)
    }
  }, [])

  // Update localStorage when data changes, but only if it's different
  useEffect(() => {
    if (laundromats.length === 0) return // Skip if data isn't loaded yet

    const storedLaundromats = localStorage.getItem("auro_laundromats")
    const currentLaundromatsString = JSON.stringify(laundromats)

    // Only update if the data has actually changed
    if (!storedLaundromats || storedLaundromats !== currentLaundromatsString) {
      localStorage.setItem("auro_laundromats", currentLaundromatsString)
    }
  }, [laundromats])

  useEffect(() => {
    if (bookings.length === 0) return // Skip if data isn't loaded yet

    const storedBookings = localStorage.getItem("auro_bookings")
    const currentBookingsString = JSON.stringify(bookings)

    // Only update if the data has actually changed
    if (!storedBookings || storedBookings !== currentBookingsString) {
      localStorage.setItem("auro_bookings", currentBookingsString)
    }
  }, [bookings])

  // Memoize the filterLaundromats function to prevent it from being recreated on every render
  const filterLaundromats = useCallback(
    (filters: Partial<LaundryFilters>) => {
      let filtered = [...laundromats]

      if (filters.paymentSystem && filters.paymentSystem.length > 0) {
        filtered = filtered.filter((laundromat) =>
          filters.paymentSystem!.some((system) => laundromat.payment_systems.includes(system)),
        )
      }

      if (filters.machineType && filters.machineType.length > 0) {
        filtered = filtered.filter((laundromat) =>
          laundromat.machines.some((machine) => filters.machineType!.includes(machine.type)),
        )
      }

      if (filters.distance) {
        filtered = filtered.filter((laundromat) => laundromat.distance <= filters.distance!)
      }

      if (filters.amenities && filters.amenities.length > 0) {
        filtered = filtered.filter((laundromat) =>
          filters.amenities!.every((amenity) => laundromat.amenities.includes(amenity)),
        )
      }

      setFilteredLaundromats(filtered)
    },
    [laundromats],
  )

  const checkPayrangeStatus = useCallback(async (laundromatId: string): Promise<void> => {
    // DEMO: Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // DEMO: Randomly choose a status
    const statuses: ("Available" | "Busy" | "Status Check Unavailable - Demo")[] = [
      "Available",
      "Busy",
      "Status Check Unavailable - Demo",
    ]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    setPayrangeStatus((prev) => ({
      ...prev,
      [laundromatId]: randomStatus,
    }))
  }, [])

  const bookMachine = useCallback(
    async (laundromatId: string, machineId: string): Promise<Booking> => {
      if (!user) {
        throw new Error("User must be logged in to book a machine")
      }

      // DEMO: Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const laundromat = laundromats.find((l) => l.id === laundromatId)
      if (!laundromat) {
        throw new Error("Laundromat not found")
      }

      const machine = laundromat.machines.find((m) => m.id === machineId)
      if (!machine) {
        throw new Error("Machine not found")
      }

      if (machine.status !== "available") {
        throw new Error("Machine is not available")
      }

      // DEMO: Update machine status
      setLaundromats((prevLaundromats) =>
        prevLaundromats.map((l) =>
          l.id === laundromatId
            ? {
                ...l,
                machines: l.machines.map((m) =>
                  m.id === machineId ? { ...m, status: "in_use", timeRemaining: 30 } : m,
                ),
              }
            : l,
        ),
      )

      // DEMO: Create booking
      const startTime = new Date()
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000) // 30 minutes later

      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        userId: user.id,
        laundromatId,
        laundromatName: laundromat.name,
        machineId,
        machineType: machine.type,
        machineNumber: machine.number,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: "upcoming",
      }

      setBookings((prevBookings) => [newBooking, ...prevBookings])

      return newBooking
    },
    [laundromats, user],
  )

  const cancelBooking = useCallback(
    async (bookingId: string): Promise<boolean> => {
      // DEMO: Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const booking = bookings.find((b) => b.id === bookingId)
      if (!booking) {
        return false
      }

      // DEMO: Update booking status
      setBookings((prevBookings) => prevBookings.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b)))

      // DEMO: Update machine status if it was for an upcoming booking
      if (booking.status === "upcoming") {
        setLaundromats((prevLaundromats) =>
          prevLaundromats.map((l) =>
            l.id === booking.laundromatId
              ? {
                  ...l,
                  machines: l.machines.map((m) =>
                    m.id === booking.machineId ? { ...m, status: "available", timeRemaining: undefined } : m,
                  ),
                }
              : l,
          ),
        )
      }

      return true
    },
    [bookings],
  )

  return (
    <BookingContext.Provider
      value={{
        laundromats,
        bookings,
        filteredLaundromats,
        selectedLaundromat,
        payrangeStatus,
        setSelectedLaundromat,
        filterLaundromats,
        checkPayrangeStatus,
        bookMachine,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
