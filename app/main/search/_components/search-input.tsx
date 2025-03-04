"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import qs from "query-string"
import { useDebounce } from "@/hooks/useDebounce"
import { Search } from "lucide-react"

export const SearchInput = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the initial title from the URL query parameters.
  const currentTitle = searchParams.get("title") || ""
  const [value, setValue] = useState(currentTitle)

  // Debounce the value with a 300ms delay.
  const debouncedValue = useDebounce(value, 300)

  // Update the local state if the URL changes externally.
  useEffect(() => {
    setValue(currentTitle)
  }, [currentTitle])

  // Update the router when the debounced value changes.
  useEffect(() => {
    const currentQuery = Object.fromEntries(searchParams.entries())
    const updatedQuery = {
      ...currentQuery,
      title: debouncedValue || undefined, // Remove "title" if input is empty.
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.pathname,
        query: updatedQuery,
      },
      { skipNull: true, skipEmptyString: true }
    )

    router.push(url)
  }, [debouncedValue, router, searchParams])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className="relative w-full">
      <Search
        size={20}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder="Search for a course"
        aria-label="Search for a course"
        value={value}
        onChange={onChange}
        className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1"
      />
    </div>
  )
} 