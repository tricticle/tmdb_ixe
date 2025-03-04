import { searchMovies } from "@/lib/tmdb"
import { MovieGrid } from "@/components/movie-grid"
import { SearchForm } from "@/components/search-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Movies - MovieDB",
  description: "Search for your favorite movies",
}

interface SearchPageProps {
  searchParams: { query?: string; page?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query || ""
  const page = Number.parseInt(searchParams.page || "1")

  let movies = { results: [], total_pages: 0, page: 1, total_results: 0 }

  if (query) {
    movies = await searchMovies(query, page)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Movies</h1>

      <div className="mb-8">
        <SearchForm defaultValue={query} />
      </div>

      {query ? (
        <>
          <p className="mb-6 text-muted-foreground">
            {movies.total_results} results for &quot;{query}&quot;
          </p>

          {movies.results.length > 0 ? (
            <MovieGrid movies={movies.results} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No movies found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you&lsquo;re looking for.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Enter a search term</h3>
          <p className="text-muted-foreground">Search for movies by title, actor, or director.</p>
        </div>
      )}
    </div>
  )
}

