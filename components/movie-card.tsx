"use client"

import type React from "react"
import type { Movie } from "@/types/tmdb"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Bookmark, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface MovieCardProps {
  movie: Movie
  isFavorite?: boolean
  isInWatchlist?: boolean
  onQuickView?: (movie: Movie) => void
}

export function MovieCard({ 
  movie, 
  isFavorite = false, 
  isInWatchlist = false,
  onQuickView 
}: MovieCardProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [favorite, setFavorite] = useState(isFavorite)
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist)

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add movies to your favorites",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const method = favorite ? "DELETE" : "POST"
      const response = await fetch("/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      })

      if (!response.ok) throw new Error("Failed to update favorites")

      setFavorite(!favorite)
      toast({
        title: favorite ? "Removed from favorites" : "Added to favorites",
        description: `${movie.title} has been ${favorite ? "removed from" : "added to"} your favorites`,
      })
      router.refresh()
    } catch {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add movies to your watchlist",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const method = inWatchlist ? "DELETE" : "POST"
      const response = await fetch("/api/watchlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      })

      if (!response.ok) throw new Error("Failed to update watchlist")

      setInWatchlist(!inWatchlist)
      toast({
        title: inWatchlist ? "Removed from watchlist" : "Added to watchlist",
        description: `${movie.title} has been ${inWatchlist ? "removed from" : "added to"} your watchlist`,
      })
      router.refresh()
    } catch {
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(movie)
  }

  return (
    <Link href={`/movies/${movie.id}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="overflow-hidden h-full group relative">
          <div className="relative aspect-[2/3] bg-muted">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              {onQuickView && (
                <button
                  onClick={handleQuickView}
                  className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                </button>
              )}
            </div>

            {movie.vote_average > 0 && (
              <Badge className="absolute top-2 left-2 bg-black/70 hover:bg-black/70">
                ★ {movie.vote_average.toFixed(1)}
              </Badge>
            )}

            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <button
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className={cn(
                  "p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors",
                  isLoading && "opacity-50 cursor-not-allowed",
                )}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 transition-colors",
                    favorite ? "fill-primary text-primary" : "text-white"
                  )} 
                />
              </button>
              <button
                onClick={handleWatchlistToggle}
                disabled={isLoading}
                className={cn(
                  "p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors",
                  isLoading && "opacity-50 cursor-not-allowed",
                )}
              >
                <Bookmark 
                  className={cn(
                    "h-4 w-4 transition-colors",
                    inWatchlist ? "fill-primary text-primary" : "text-white"
                  )} 
                />
              </button>
            </div>
          </div>

          <CardContent className="p-3">
            <h3 className="font-semibold line-clamp-1 text-sm">{movie.title}</h3>
            <p className="text-xs text-muted-foreground">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
