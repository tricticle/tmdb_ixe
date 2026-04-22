"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Play, Info, Star, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import type { Movie } from "@/types/tmdb"

interface HeroSectionProps {
  movies: Movie[]
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const featuredMovies = movies.slice(0, 5)
  const currentMovie = featuredMovies[currentIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [featuredMovies.length])

  return (
    <div className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {currentMovie.backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
              alt={currentMovie.title}
              fill
              priority
              className="object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

      <div className="relative z-20 container flex flex-col justify-end h-full pb-24 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Featured
              </Badge>
              {currentMovie.vote_average > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {currentMovie.vote_average.toFixed(1)}
                </Badge>
              )}
              {currentMovie.release_date && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(currentMovie.release_date).getFullYear()}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
              {currentMovie.title}
            </h1>
            
            <p className="text-muted-foreground text-lg mb-6 line-clamp-3 text-pretty">
              {currentMovie.overview}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href={`/movies/${currentMovie.id}`}>
                  <Play className="h-5 w-5" />
                  Watch Trailer
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
              >
                <Link href={`/movies/${currentMovie.id}`}>
                  <Info className="h-5 w-5" />
                  More Info
                </Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicator dots */}
        <div className="flex gap-2 mt-8">
          {featuredMovies.map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-4 bg-muted-foreground/40 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
