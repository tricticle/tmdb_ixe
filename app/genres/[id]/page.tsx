import { getMoviesByGenre, getGenres } from "@/lib/tmdb"
import { InfiniteMovieGrid } from "@/components/infinite-movie-grid"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface GenrePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { id } = await params
  const genres = await getGenres()
  const genre = genres.find((g) => g.id === parseInt(id))
  
  return {
    title: genre ? `${genre.name} Movies - tmdb_ixe` : "Genre - tmdb_ixe",
    description: genre ? `Browse ${genre.name} movies` : "Browse movies by genre",
  }
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { id } = await params
  const genreId = parseInt(id)
  
  const [genres, initialMovies] = await Promise.all([
    getGenres(),
    getMoviesByGenre(genreId, 1),
  ])
  
  const genre = genres.find((g) => g.id === genreId)
  
  if (!genre) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{genre.name} Movies</h1>
        <p className="text-muted-foreground">
          {initialMovies.total_results.toLocaleString()} movies found
        </p>
      </div>
      
      <InfiniteMovieGrid 
        initialMovies={initialMovies.results}
        totalPages={initialMovies.total_pages}
        fetchUrl={`/api/movies/genre/${genreId}`}
      />
    </div>
  )
}
