import { getMovieDetails, getMovieCredits, getSimilarMovies } from "@/lib/tmdb"
import { MovieDetails } from "@/components/movie-details"
import { MovieCredits } from "@/components/movie-credits"
import { MovieGrid } from "@/components/movie-grid"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface MoviePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(params.id)

    return {
      title: `${movie.title} - MovieDB`,
      description: movie.overview.substring(0, 160),
      openGraph: {
        images: [
          {
            url: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
            width: 1280,
            height: 720,
          },
        ],
      },
    }
  } catch (error) {
    return {
      title: "Movie - MovieDB",
      description: "View movie details",
    }
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  try {
    const [movie, credits, similarMovies] = await Promise.all([
      getMovieDetails(params.id),
      getMovieCredits(params.id),
      getSimilarMovies(params.id),
    ])

    return (
      <div className="flex flex-col gap-12 pb-12">
        <MovieDetails movie={movie} />

        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Cast</h2>
          <MovieCredits credits={credits} />
        </div>

        {similarMovies.results.length > 0 && (
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
            <MovieGrid movies={similarMovies.results.slice(0, 4)} />
          </div>
        )}
      </div>
    )
  } catch (error) {
    notFound()
  }
}

