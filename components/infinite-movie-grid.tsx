"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import type { Movie } from "@/types/tmdb"
import { MovieCard } from "@/components/movie-card"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface InfiniteMovieGridProps {
  initialMovies: Movie[]
  totalPages: number
  fetchUrl: string
}

export function InfiniteMovieGrid({ 
  initialMovies, 
  totalPages, 
  fetchUrl 
}: InfiniteMovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(totalPages > 1)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    const nextPage = page + 1
    
    try {
      const response = await fetch(`${fetchUrl}?page=${nextPage}`)
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        setMovies(prev => [...prev, ...data.results])
        setPage(nextPage)
        setHasMore(nextPage < totalPages)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Failed to load more movies:", error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, fetchUrl, totalPages])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, loadMore])

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AnimatePresence>
          {movies.map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more movies...</span>
          </div>
        )}
        {!hasMore && movies.length > 0 && (
          <p className="text-muted-foreground">No more movies to load</p>
        )}
      </div>
    </div>
  )
}
