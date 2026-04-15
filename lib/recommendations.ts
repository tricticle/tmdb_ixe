import { getMoviesByIds, getRecommendedMovies, getMoviesByGenre } from "./tmdb"
import { getUserFavorites } from "./favorites"
import type { Movie } from "@/types/tmdb"

interface GenreScore {
  genreId: number
  count: number
}

// Get personalized recommendations based on user's favorites
export async function getPersonalizedRecommendations(
  userId: string,
  limit = 20
): Promise<Movie[]> {
  // Get user's favorite movies
  const favorites = await getUserFavorites(userId)

  if (favorites.length === 0) {
    return []
  }

  // Get movie details for favorites
  const movieIds = favorites.map((f) => f.movieId)
  const movies = await getMoviesByIds(movieIds)

  if (movies.length === 0) {
    return []
  }

  // Analyze genres from favorites
  const genreScores: Map<number, number> = new Map()
  movies.forEach((movie) => {
    movie.genre_ids?.forEach((genreId) => {
      genreScores.set(genreId, (genreScores.get(genreId) || 0) + 1)
    })
  })

  // Sort genres by frequency
  const sortedGenres: GenreScore[] = Array.from(genreScores.entries())
    .map(([genreId, count]) => ({ genreId, count }))
    .sort((a, b) => b.count - a.count)

  // Get recommendations from top 3 genres and similar movies
  const recommendationPromises: Promise<Movie[]>[] = []

  // Get recommendations based on first 3 favorite movies
  for (let i = 0; i < Math.min(3, movies.length); i++) {
    recommendationPromises.push(
      getRecommendedMovies(movies[i].id.toString()).then((res) => res.results)
    )
  }

  // Get movies from top 2 genres
  for (let i = 0; i < Math.min(2, sortedGenres.length); i++) {
    recommendationPromises.push(
      getMoviesByGenre(sortedGenres[i].genreId).then((res) => res.results)
    )
  }

  const allRecommendations = await Promise.all(recommendationPromises)

  // Flatten and deduplicate recommendations
  const seenIds = new Set(movieIds) // Exclude movies already in favorites
  const uniqueRecommendations: Movie[] = []

  allRecommendations.flat().forEach((movie) => {
    if (!seenIds.has(movie.id)) {
      seenIds.add(movie.id)
      uniqueRecommendations.push(movie)
    }
  })

  // Sort by popularity and rating
  uniqueRecommendations.sort((a, b) => {
    const scoreA = a.vote_average * 0.7 + a.popularity * 0.3
    const scoreB = b.vote_average * 0.7 + b.popularity * 0.3
    return scoreB - scoreA
  })

  return uniqueRecommendations.slice(0, limit)
}

// Get user's top genres based on favorites
export async function getUserTopGenres(userId: string): Promise<number[]> {
  const favorites = await getUserFavorites(userId)

  if (favorites.length === 0) {
    return []
  }

  const movieIds = favorites.map((f) => f.movieId)
  const movies = await getMoviesByIds(movieIds)

  const genreScores: Map<number, number> = new Map()
  movies.forEach((movie) => {
    movie.genre_ids?.forEach((genreId) => {
      genreScores.set(genreId, (genreScores.get(genreId) || 0) + 1)
    })
  })

  return Array.from(genreScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genreId]) => genreId)
}
