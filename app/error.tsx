'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background px-4">
      <div className="bg-card shadow rounded-md p-6 text-center">
        <h2 className="text-3xl font-bold mb-4 text-card-foreground">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-dark transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  )
}