"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface WatchlistButtonProps {
  movieId: number
  variant?: "default" | "outline" | "ghost"
}

export function WatchlistButton({ movieId, variant = "outline" }: WatchlistButtonProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkWatchlist() {
      if (!session) {
        setIsChecking(false)
        return
      }

      try {
        const response = await fetch(`/api/watchlist/check?movieId=${movieId}`)
        const data = await response.json()
        setIsInWatchlist(data.isInWatchlist)
      } catch (error) {
        console.error("Failed to check watchlist status:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkWatchlist()
  }, [movieId, session])

  const handleToggle = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add movies to your watchlist",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const method = isInWatchlist ? "DELETE" : "POST"
      const response = await fetch("/api/watchlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      })

      if (!response.ok) throw new Error("Failed to update watchlist")

      setIsInWatchlist(!isInWatchlist)
      toast({
        title: isInWatchlist ? "Removed from watchlist" : "Added to watchlist",
        description: isInWatchlist
          ? "Movie has been removed from your watchlist"
          : "Movie has been added to your watchlist",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <Button variant={variant} size="lg" disabled className="gap-2 bg-white/10 border-white/20">
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size="lg"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "gap-2 bg-white/10 border-white/20 hover:bg-white/20",
        isInWatchlist && "bg-primary/20 border-primary/30 hover:bg-primary/30"
      )}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-white" />
      ) : (
        <Bookmark className={cn("h-5 w-5", isInWatchlist ? "fill-primary text-primary" : "text-white")} />
      )}
      <span className="text-white">{isInWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
    </Button>
  )
}
