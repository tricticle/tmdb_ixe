"use client"

import { useState } from "react"
import type { Movie } from "@/types/tmdb"
import { MovieCarousel } from "@/components/movie-carousel"
import { QuickViewModal } from "@/components/quick-view-modal"
import { motion } from "framer-motion"

interface HomeContentProps {
  trending: Movie[]
  nowPlaying: Movie[]
  topRated: Movie[]
  upcoming: Movie[]
  popular: Movie[]
}

export function HomeContent({ 
  trending, 
  nowPlaying, 
  topRated, 
  upcoming,
  popular 
}: HomeContentProps) {
  const [quickViewMovie, setQuickViewMovie] = useState<Movie | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  const handleQuickView = (movie: Movie) => {
    setQuickViewMovie(movie)
    setIsQuickViewOpen(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container py-8 flex flex-col gap-10"
      >
        <MovieCarousel 
          title="Trending Now" 
          movies={trending} 
          href="/trending"
          onQuickView={handleQuickView}
        />
        
        <MovieCarousel 
          title="Now Playing" 
          movies={nowPlaying} 
          href="/now-playing"
          onQuickView={handleQuickView}
        />
        
        <MovieCarousel 
          title="Top Rated" 
          movies={topRated} 
          href="/top-rated"
          onQuickView={handleQuickView}
        />
        
        <MovieCarousel 
          title="Coming Soon" 
          movies={upcoming} 
          href="/upcoming"
          onQuickView={handleQuickView}
        />

        <MovieCarousel 
          title="Popular Movies" 
          movies={popular} 
          href="/search"
          onQuickView={handleQuickView}
        />
      </motion.div>

      <QuickViewModal
        movie={quickViewMovie}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  )
}
