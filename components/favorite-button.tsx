"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  movieId: number
}

export function FavoriteButton({ movieId }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session) {
      checkFavoriteStatus()
    } else {
      setIsLoading(false)
    }
  }, [session])

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch("/api/favorites")
      if (response.ok) {
        const favorites = await response.json()
        setIsFavorite(favorites.some((fav: any) => fav.movieId === movieId))
      }
    } catch (error) {
      console.error("Failed to check favorite status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
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
      const method = isFavorite ? "DELETE" : "POST"
      const response = await fetch("/api/favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      })

      if (!response.ok) {
        throw new Error("Failed to update favorites")
      }

      setIsFavorite(!isFavorite)

      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite
          ? "This movie has been removed from your favorites"
          : "This movie has been added to your favorites",
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

  if (isLoading) {
    return (
      <Button disabled variant="outline" size="lg">
        <Heart className="mr-2 h-5 w-5" />
        Loading...
      </Button>
    )
  }

  return (
    <Button
      onClick={handleToggleFavorite}
      variant={isFavorite ? "default" : "outline"}
      size="lg"
      className={cn(isFavorite && "bg-primary hover:bg-primary/90")}
    >
      <Heart className={cn("mr-2 h-5 w-5", isFavorite && "fill-primary-foreground")} />
      {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    </Button>
  )
}

