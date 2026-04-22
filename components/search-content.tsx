"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { MovieCard } from "@/components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"
import { QuickViewModal } from "@/components/quick-view-modal"
import type { Movie } from "@/types/tmdb"
import { motion } from "framer-motion"

interface SearchContentProps {
  query: string
}

export function SearchContent({ query }: SearchContentProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [quickViewMovie, setQuickViewMovie] = useState<Movie | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const searchMovies = useCallback(
    async (pageNum: number) => {
      if (!query || pageNum > totalPages) return

      try {
        setLoading(true)
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&page=${pageNum}`)
        if (!response.ok) throw new Error("Failed to search")
        const data = await response.json()

        if (pageNum === 1) {
          setMovies(data.results)
        } else {
          setMovies((prev) => [...prev, ...data.results])
        }

        setTotalPages(data.total_pages)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
        setInitialLoading(false)
      }
    },
    [query, totalPages]
  )

  useEffect(() => {
    if (!query) {
      setMovies([])
      setPage(1)
      setInitialLoading(false)
      return
    }

    setMovies([])
    setPage(1)
    searchMovies(1)
  }, [query, searchMovies])

  useEffect(() => {
    if (!observerTarget.current || !query || page > totalPages || initialLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [loading, page, totalPages, initialLoading, query])

  useEffect(() => {
    if (page > 1 && query) {
      searchMovies(page)
    }
  }, [page, query, searchMovies])

  if (initialLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
        ))}
      </div>
    )
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Enter a search term</h3>
        <p className="text-muted-foreground">Search for movies by title, actor, or director.</p>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No movies found</h3>
        <p className="text-muted-foreground">Try adjusting your search to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-muted-foreground">Found {movies.length} movies</p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onQuickView={() => {
            setQuickViewMovie(movie)
            setIsQuickViewOpen(true)
          }} />
        ))}
      </motion.div>

      {page < totalPages && <div ref={observerTarget} className="py-8" />}

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
          ))}
        </div>
      )}

      <QuickViewModal
        movie={quickViewMovie}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  )
}
