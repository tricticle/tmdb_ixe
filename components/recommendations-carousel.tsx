"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { MovieCarousel } from "./movie-carousel"
import type { Movie } from "@/types/tmdb"

export function RecommendationsCarousel() {
  const { data: session } = useSession()
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/recommendations")
        if (!response.ok) throw new Error("Failed to fetch recommendations")
        const data = await response.json()
        setRecommendations(data.movies || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [session?.user?.id])

  if (!session?.user?.id) {
    return null
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recommended For You</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 w-40 flex-shrink-0 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (error || recommendations.length === 0) {
    return null
  }

  return <MovieCarousel title="Recommended For You" movies={recommendations} />
}
