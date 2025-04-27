"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { HealthPreference } from "@/context/user-context"

export interface ProductPrice {
  retailer: string
  price: number
  originalPrice?: number
  discount?: number
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  image: string
  rating: number
  healthTags: HealthPreference[]
  prices: ProductPrice[]
  bestValue?: boolean
}

export interface ProductFilters {
  category?: string
  healthTags?: HealthPreference[]
  priceRange?: [number, number]
  sortBy: "price" | "rating" | "discount"
  sortOrder: "asc" | "desc"
}

interface ProductsContextType {
  products: Product[]
  filteredProducts: Product[]
  filterProducts: (filters: ProductFilters) => void
  searchProducts: (query: string) => Product[]
}

// Mock products data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "product-1",
    name: "Eco-Clean Detergent",
    description: "Plant-based, biodegradable laundry detergent",
    category: "Detergent",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    healthTags: ["eco-friendly", "hypoallergenic"],
    prices: [
      { retailer: "GreenMart", price: 12.99, originalPrice: 15.99, discount: 19 },
      { retailer: "EcoStore", price: 13.49 },
      { retailer: "SuperValue", price: 14.99 },
    ],
    bestValue: true,
  },
  {
    id: "product-2",
    name: "Fresh Breeze Softener",
    description: "Long-lasting fabric softener with fresh scent",
    category: "Fabric Softener",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.2,
    healthTags: ["standard"],
    prices: [
      { retailer: "SuperValue", price: 8.99 },
      { retailer: "QuickMart", price: 7.99, originalPrice: 9.99, discount: 20 },
      { retailer: "HomeGoods", price: 9.49 },
    ],
  },
  {
    id: "product-3",
    name: "Stain-Away Spray",
    description: "Powerful stain remover for all fabric types",
    category: "Stain Remover",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    healthTags: ["standard"],
    prices: [
      { retailer: "CleanSupply", price: 6.99 },
      { retailer: "SuperValue", price: 6.49, originalPrice: 7.99, discount: 19 },
      { retailer: "HomeGoods", price: 7.49 },
    ],
  },
  {
    id: "product-4",
    name: "Natural Wool Dryer Balls",
    description: "Reusable wool dryer balls, reduces drying time",
    category: "Dryer Accessories",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    healthTags: ["eco-friendly", "natural"],
    prices: [
      { retailer: "EcoStore", price: 15.99 },
      { retailer: "GreenMart", price: 14.99, originalPrice: 19.99, discount: 25 },
      { retailer: "HomeGoods", price: 17.99 },
    ],
  },
  {
    id: "product-5",
    name: "Sensitive Skin Detergent",
    description: "Fragrance-free detergent for sensitive skin",
    category: "Detergent",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    healthTags: ["hypoallergenic", "fragrance-free"],
    prices: [
      { retailer: "HealthMart", price: 11.99 },
      { retailer: "SuperValue", price: 12.99 },
      { retailer: "QuickMart", price: 10.99, originalPrice: 13.99, discount: 21 },
    ],
  },
  {
    id: "product-6",
    name: "Color Protect Sheets",
    description: "Dryer sheets that prevent color fading",
    category: "Dryer Accessories",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    healthTags: ["standard"],
    prices: [
      { retailer: "HomeGoods", price: 5.99, originalPrice: 7.99, discount: 25 },
      { retailer: "SuperValue", price: 6.49 },
      { retailer: "QuickMart", price: 6.99 },
    ],
  },
]

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  filteredProducts: [],
  filterProducts: () => {},
  searchProducts: () => [],
})

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem("auro_products")
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts)
      setProducts(parsedProducts)
      setFilteredProducts(parsedProducts)
    } else {
      setProducts(MOCK_PRODUCTS)
      setFilteredProducts(MOCK_PRODUCTS)
    }
  }, [])

  // Update localStorage when products change
  useEffect(() => {
    localStorage.setItem("auro_products", JSON.stringify(products))
  }, [products])

  const filterProducts = (filters: ProductFilters) => {
    let filtered = [...products]

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category)
    }

    // Filter by health tags
    if (filters.healthTags && filters.healthTags.length > 0) {
      filtered = filtered.filter((product) => filters.healthTags!.some((tag) => product.healthTags.includes(tag)))
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      filtered = filtered.filter((product) => {
        // Get the lowest price for the product
        const lowestPrice = Math.min(...product.prices.map((p) => p.price))
        return lowestPrice >= min && lowestPrice <= max
      })
    }

    // Sort products
    if (filters.sortBy === "price") {
      filtered.sort((a, b) => {
        const aPrice = Math.min(...a.prices.map((p) => p.price))
        const bPrice = Math.min(...b.prices.map((p) => p.price))
        return filters.sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice
      })
    } else if (filters.sortBy === "rating") {
      filtered.sort((a, b) => (filters.sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating))
    } else if (filters.sortBy === "discount") {
      filtered.sort((a, b) => {
        const aDiscount = Math.max(...a.prices.map((p) => p.discount || 0))
        const bDiscount = Math.max(...b.prices.map((p) => p.discount || 0))
        return filters.sortOrder === "asc" ? aDiscount - bDiscount : bDiscount - aDiscount
      })
    }

    setFilteredProducts(filtered)
  }

  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return products

    const searchTerms = query.toLowerCase().split(" ")

    return products.filter((product) => {
      const searchableText = [product.name, product.description, product.category, ...product.healthTags]
        .join(" ")
        .toLowerCase()

      return searchTerms.every((term) => searchableText.includes(term))
    })
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        filterProducts,
        searchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)
