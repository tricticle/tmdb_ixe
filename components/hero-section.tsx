import { getPopularMovies } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export async function HeroSection() {
  const movies = await getPopularMovies(1)
  const featuredMovie = movies.results[0]

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 z-10" />

      {featuredMovie.backdrop_path && (
        <Image
          src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
          alt={featuredMovie.title}
          fill
          priority
          className="object-cover"
        />
      )}

      <div className="relative z-20 container flex flex-col justify-center h-full pt-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{featuredMovie.title}</h1>
          <p className="text-white/90 text-lg mb-6 line-clamp-3">{featuredMovie.overview}</p>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href={`/movies/${featuredMovie.id}`}>View Details</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-background/20 hover:bg-background/40 text-white border-white/20"
            >
              <Link href="/search">Explore More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

