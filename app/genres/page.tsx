import { getGenres } from "@/lib/tmdb"
import { GenreGrid } from "@/components/genre-grid"

export const metadata = {
  title: "Genres - tmdb_ixe",
  description: "Browse movies by genre",
}

export default async function GenresPage() {
  const genres = await getGenres()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Genres</h1>
        <p className="text-muted-foreground">Discover movies by your favorite genre</p>
      </div>
      <GenreGrid genres={genres} />
    </div>
  )
}
