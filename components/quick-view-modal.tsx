"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Calendar, Heart, Bookmark, Play, X, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Movie, MovieDetail } from "@/types/tmdb"
import { motion, AnimatePresence } from "framer-motion"

interface QuickViewModalProps {
  movie: Movie | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ movie, isOpen, onClose }: QuickViewModalProps) {
  const [details, setDetails] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (movie && isOpen) {
      setLoading(true)
      fetch(`/api/movies/${movie.id}`)
        .then((res) => res.json())
        .then((data) => setDetails(data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [movie, isOpen])

  if (!movie) return null

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">{movie.title} - Quick View</DialogTitle>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div className="relative h-48 md:h-64">
              {movie.backdrop_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 -mt-20 relative">
              <div className="flex gap-4">
                {/* Poster */}
                <div className="flex-shrink-0 hidden sm:block">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      width={120}
                      height={180}
                      className="rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-[120px] h-[180px] bg-muted rounded-lg" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-balance">{movie.title}</h2>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    {movie.vote_average > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                    )}
                    {movie.release_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    )}
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : details?.runtime ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatRuntime(details.runtime)}
                      </span>
                    ) : null}
                  </div>

                  {/* Genres */}
                  {details?.genres && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {details.genres.slice(0, 4).map((genre) => (
                        <Badge key={genre.id} variant="secondary" className="text-xs">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Overview */}
                  <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                    {movie.overview || "No overview available."}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button asChild>
                      <Link href={`/movies/${movie.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
