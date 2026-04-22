"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Movie } from "@/types/tmdb"

export function RecommendationDetail() {
  const { data: session } = useSession()
  const [topGenres, setTopGenres] = useState<Array<{ name: string; count: number }>>([])
  const [topActors, setTopActors] = useState<Array<{ name: string; count: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/recommendations")
        if (!response.ok) throw new Error("Failed to fetch recommendations")
        const data = await response.json()
        setTopGenres(data.topGenres || [])
        setTopActors(data.topActors || [])
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [session?.user?.id])

  if (!session?.user?.id || loading) {
    return <Skeleton className="h-64 w-full rounded-lg" />
  }

  if (topGenres.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Taste Profile</CardTitle>
        <CardDescription>Based on your favorite movies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topGenres.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Favorite Genres</h3>
            <div className="flex flex-wrap gap-2">
              {topGenres.slice(0, 5).map((genre) => (
                <Badge key={genre.name} variant="secondary">
                  {genre.name} ({genre.count})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {topActors.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Favorite Actors</h3>
            <div className="space-y-1">
              {topActors.slice(0, 5).map((actor) => (
                <div key={actor.name} className="text-sm text-muted-foreground">
                  {actor.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
