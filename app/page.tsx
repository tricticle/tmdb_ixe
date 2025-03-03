import { MovieGrid } from "@/components/movie-grid"
import { HeroSection } from "@/components/hero-section"
import { getPopularMovies } from "@/lib/tmdb"

export default async function Home() {
  const movies = await getPopularMovies(1)

  return (
    <div className="flex flex-col gap-8">
      <HeroSection />
      <div className="container py-8">
        <h2 className="text-3xl font-bold mb-6">Popular Movies</h2>
        <MovieGrid movies={movies.results} />
      </div>
    </div>
  )
}

