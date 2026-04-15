"use client"

import { useEffect, useState } from "react"
import { MovieCard } from "@/components/movie-card"
import type { Movie } from "@/types/tmdb"
import { Loader2, Bookmark } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface WatchlistMoviesProps {
  watchlist: { id: string; movieId: number; createdAt: Date }[]
}

export function WatchlistMovies({ watchlist }: WatchlistMoviesProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMovies() {
      if (watchlist.length === 0) {
        setLoading(false)
        return
      }

      try {
        const movieIds = watchlist.map((item) => item.movieId)
        const response = await fetch("/api/movies/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieIds }),
        })

        if (response.ok) {
          const data = await response.json()
          setMovies(data)
        }
      } catch (error) {
        console.error("Failed to fetch watchlist movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [watchlist])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Your watchlist is empty</p>
        <p className="text-sm mt-2">Start adding movies you want to watch later</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <AnimatePresence>
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <MovieCard movie={movie} isInWatchlist />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
