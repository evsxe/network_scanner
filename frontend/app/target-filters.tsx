"use client"

import type React from "react"

import { useState } from "react"
import { Search, SortAsc, SortDesc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export type SortOption = {
  label: string
  value: string
  direction: "asc" | "desc"
}

interface TargetFiltersProps {
  onSearchChange: (search: string) => void
  onSortChange: (sort: SortOption) => void
  activeSort: SortOption | null
}

export default function TargetFilters({ onSearchChange, onSortChange, activeSort }: TargetFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const sortOptions: SortOption[] = [
    { label: "URI (A-Z)", value: "uri", direction: "asc" },
    { label: "URI (Z-A)", value: "uri", direction: "desc" },
    { label: "Date Added (Newest)", value: "created_at", direction: "desc" },
    { label: "Date Added (Oldest)", value: "created_at", direction: "asc" },
  ]

  const handleSearch = () => {
    onSearchChange(searchQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    onSearchChange("")
  }

  const handleSortSelect = (option: SortOption) => {
    onSortChange(option)
  }

  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search targets by URI or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-200"
              onClick={handleClearSearch}
            >
              ×
            </Button>
          )}
        </div>
        <Button onClick={handleSearch} className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
          Search
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
              {activeSort ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-700 border-gray-600 text-gray-200">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-600" />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={`${option.value}-${option.direction}`}
                onClick={() => handleSortSelect(option)}
                className={
                  activeSort?.value === option.value && activeSort?.direction === option.direction ? "bg-gray-600" : ""
                }
              >
                {option.label}
                {activeSort?.value === option.value && activeSort?.direction === option.direction && (
                  <span className="ml-2">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filters display */}
      <div className="flex flex-wrap gap-2">
        {searchQuery && (
          <Badge variant="outline" className="bg-gray-700 text-gray-200 border-gray-600 flex items-center gap-1">
            Search: {searchQuery}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 text-gray-400 hover:text-gray-200 ml-1"
              onClick={handleClearSearch}
            >
              ×
            </Button>
          </Badge>
        )}
        {activeSort && (
          <Badge variant="outline" className="bg-gray-700 text-gray-200 border-gray-600 flex items-center gap-1">
            Sort: {activeSort.label}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 text-gray-400 hover:text-gray-200 ml-1"
              onClick={() => onSortChange(null)}
            >
              ×
            </Button>
          </Badge>
        )}
      </div>
    </div>
  )
}
