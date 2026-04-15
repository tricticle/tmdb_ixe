"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FavoriteMovies } from "@/components/favorite-movies"
import { WatchlistMovies } from "@/components/watchlist-movies"
import { Heart, Bookmark, Bell } from "lucide-react"
import type { Favorite } from "@prisma/client"

interface DashboardContentProps {
  favorites: Favorite[]
  watchlist: { id: string; movieId: number; createdAt: Date }[]
}

export function DashboardContent({ favorites, watchlist }: DashboardContentProps) {
  return (
    <Tabs defaultValue="favorites" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="favorites" className="gap-2">
          <Heart className="h-4 w-4" />
          Favorites ({favorites.length})
        </TabsTrigger>
        <TabsTrigger value="watchlist" className="gap-2">
          <Bookmark className="h-4 w-4" />
          Watchlist ({watchlist.length})
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="favorites">
        <FavoriteMovies favorites={favorites} />
      </TabsContent>
      
      <TabsContent value="watchlist">
        <WatchlistMovies watchlist={watchlist} />
      </TabsContent>
      
      <TabsContent value="notifications">
        <div className="text-center py-12 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No notifications yet</p>
          <p className="text-sm mt-2">We&apos;ll notify you about new releases and recommendations</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
