import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMoviesByIds } from "@/lib/tmdb"
import { MovieGrid } from "@/components/movie-grid"

interface FavoriteMoviesProps {
  favorites: { id: string; userId: string; movieId: number }[]
}

export async function FavoriteMovies({ favorites }: FavoriteMoviesProps) {
  const movieIds = favorites.map((fav) => fav.movieId)
  const movies = movieIds.length > 0 ? await getMoviesByIds(movieIds) : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Favorite Movies</CardTitle>
      </CardHeader>
      <CardContent>
        {movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
            <p className="text-muted-foreground">Start adding movies to your favorites to see them here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

