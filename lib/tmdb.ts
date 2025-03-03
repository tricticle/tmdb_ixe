import type { Movie, MovieDetail, Credits } from "@/types/tmdb";

const TMDB_API_KEY = process.env.TMDB_API_KEY; ;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Helper function to make API requests
async function fetchFromTMDB(
  endpoint: string,
  params: Record<string, string> = {}
) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  // Add additional params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`, // Pass API key in header
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Get popular movies
export async function getPopularMovies(page = 1) {
  return fetchFromTMDB("/movie/popular", { page: page.toString() });
}

// Get movie details
export async function getMovieDetails(movieId: string): Promise<MovieDetail> {
  return fetchFromTMDB(`/movie/${movieId}`);
}

// Get movie credits
export async function getMovieCredits(movieId: string): Promise<Credits> {
  return fetchFromTMDB(`/movie/${movieId}/credits`);
}

// Get similar movies
export async function getSimilarMovies(movieId: string) {
  return fetchFromTMDB(`/movie/${movieId}/similar`);
}

// Search movies
export async function searchMovies(query: string, page = 1) {
  return fetchFromTMDB("/search/movie", {
    query,
    page: page.toString(),
    include_adult: "false",
  });
}

// Get multiple movies by IDs
export async function getMoviesByIds(movieIds: number[]): Promise<Movie[]> {
  if (movieIds.length === 0) return [];

  const promises = movieIds.map(async (id) => {
    try {
      return await fetchFromTMDB(`/movie/${id}`);
    } catch (error) {
      console.error(`Failed to fetch movie ID ${id}:`, error);
      return null;
    }
  });

  const movies = await Promise.all(promises);
  return movies.filter(Boolean) as Movie[];
}
