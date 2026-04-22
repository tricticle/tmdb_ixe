import { getMovieDetails, getMovieCredits, getSimilarMovies, getMovieVideos, getRecommendedMovies } from "@/lib/tmdb"
import { MovieDetailsSection } from "@/components/movie-details-section"
import { MovieCredits } from "@/components/movie-credits"
import { MovieCarousel } from "@/components/movie-carousel"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const movie = await getMovieDetails(id)

    return {
      title: `${movie.title} - tmdb_ixe`,
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
  } catch {
    return {
      title: "Movie - tmdb_ixe",
      description: "View movie details",
    }
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  try {
    const [movie, credits, videos, similarMovies, recommendedMovies] = await Promise.all([
      getMovieDetails(id),
      getMovieCredits(id),
      getMovieVideos(id),
      getSimilarMovies(id),
      getRecommendedMovies(id),
    ])

    // Find official trailer
    const trailer = videos.results.find(
      (video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser")
    )

    return (
      <div className="flex flex-col gap-12 pb-12">
        <MovieDetailsSection movie={movie} trailer={trailer} />

        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Cast</h2>
          <MovieCredits credits={credits} />
        </div>

        {recommendedMovies.results.length > 0 && (
          <div className="container">
            <MovieCarousel 
              title="Recommended For You" 
              movies={recommendedMovies.results.slice(0, 10)} 
            />
          </div>
        )}

        {similarMovies.results.length > 0 && (
          <div className="container">
            <MovieCarousel 
              title="Similar Movies" 
              movies={similarMovies.results.slice(0, 10)} 
            />
          </div>
        )}
      </div>
    )
  } catch {
    notFound()
  }
}
