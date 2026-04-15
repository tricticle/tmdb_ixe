"use client"

import type { MovieDetail, Video } from "@/types/tmdb"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, Star, Play, Heart, Bookmark, Share2 } from "lucide-react"
import { FavoriteButton } from "@/components/favorite-button"
import { WatchlistButton } from "@/components/watchlist-button"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import Link from "next/link"

interface MovieDetailsSectionProps {
  movie: MovieDetail
  trailer?: Video
}

export function MovieDetailsSection({ movie, trailer }: MovieDetailsSectionProps) {
  const [trailerOpen, setTrailerOpen] = useState(false)

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="relative">
      {movie.backdrop_path && (
        <div className="absolute inset-0 h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background z-10" />
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="container relative z-20 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-8"
        >
          <div className="shrink-0">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg shadow-2xl object-cover"
                priority
              />
            ) : (
              <div className="w-[300px] h-[450px] bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 py-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">
              {movie.title}
              {movie.release_date && (
                <span className="text-white/70 font-normal"> ({new Date(movie.release_date).getFullYear()})</span>
              )}
            </h1>

            <div className="flex flex-wrap gap-4 items-center text-white/90">
              {movie.release_date && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
              )}

              {movie.runtime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}

              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-white/60">/10</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 my-2">
              {movie.genres.map((genre) => (
                <Link key={genre.id} href={`/genres/${genre.id}`}>
                  <Badge 
                    variant="secondary" 
                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {genre.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {movie.tagline && (
              <p className="text-lg italic text-white/80">&quot;{movie.tagline}&quot;</p>
            )}

            <div className="mt-2">
              <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
              <p className="text-white/80 leading-relaxed text-pretty">{movie.overview}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {trailer && (
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={() => setTrailerOpen(true)}
                >
                  <Play className="h-5 w-5" />
                  Watch Trailer
                </Button>
              )}
              <FavoriteButton movieId={movie.id} />
              <WatchlistButton movieId={movie.id} />
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Share2 className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trailer Modal */}
      {trailer && (
        <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
            <DialogTitle className="sr-only">{movie.title} - Trailer</DialogTitle>
            <DialogDescription className="sr-only">
              Watch the official trailer for {movie.title}
            </DialogDescription>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
