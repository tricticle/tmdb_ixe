import type { MovieDetail } from "@/types/tmdb"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Star } from "lucide-react"
import { FavoriteButton } from "@/components/favorite-button"

interface MovieDetailsProps {
  movie: MovieDetail
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="relative">
      {movie.backdrop_path && (
        <div className="absolute inset-0 h-[50vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background z-10" />
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="container relative z-20 pt-24 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg shadow-lg object-cover"
                priority
              />
            ) : (
              <div className="w-[300px] h-[450px] bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 py-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {movie.title}
              {movie.release_date && (
                <span className="text-white/70 font-normal"> ({new Date(movie.release_date).getFullYear()})</span>
              )}
            </h1>

            <div className="flex flex-wrap gap-2 items-center text-white/90">
              {movie.release_date && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
              )}

              {movie.runtime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}

              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}/10</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 my-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            {movie.tagline && <p className="text-lg italic text-white/80">{movie.tagline}</p>}

            <div className="mt-2">
              <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
              <p className="text-black dark:text-white">{movie.overview}</p>
            </div>

            <div className="mt-4">
              <FavoriteButton movieId={movie.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

