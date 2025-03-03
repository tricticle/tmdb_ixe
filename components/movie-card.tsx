"use client"

import type React from "react"

import type { Movie } from "@/types/tmdb"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface MovieCardProps {
  movie: Movie
  isFavorite?: boolean
}

export function MovieCard({ movie, isFavorite = false }: MovieCardProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [favorite, setFavorite] = useState(isFavorite)

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add movies to your favorites",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const method = favorite ? "DELETE" : "POST"
      const response = await fetch("/api/favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId: movie.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to update favorites")
      }

      setFavorite(!favorite)

      toast({
        title: favorite ? "Removed from favorites" : "Added to favorites",
        description: favorite
          ? `${movie.title} has been removed from your favorites`
          : `${movie.title} has been added to your favorites`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="overflow-hidden h-full transition-transform hover:scale-[1.02] hover:shadow-lg">
        <div className="relative aspect-[2/3] bg-muted">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          {movie.vote_average > 0 && (
            <Badge className="absolute top-2 left-2 bg-black/70 hover:bg-black/70">
              ★ {movie.vote_average.toFixed(1)}
            </Badge>
          )}

          <button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
          >
            <Heart className={cn("h-5 w-5", favorite ? "fill-primary text-primary" : "text-white")} />
          </button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
          <p className="text-sm text-muted-foreground">{new Date(movie.release_date).getFullYear() || "Unknown"}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

