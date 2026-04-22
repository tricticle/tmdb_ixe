import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserProfile } from "@/components/user-profile"
import { DashboardContent } from "@/components/dashboard-content"
import type { Metadata } from "next"
import { getUserFavorites } from "@/lib/favorites"
import { getUserWatchlist } from "@/lib/watchlist"

export const metadata: Metadata = {
  title: "Dashboard - tmdb_ixe",
  description: "View your profile, favorites, and watchlist",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/api/auth/signin")
    return null
  }

  const [favorites, watchlist] = await Promise.all([
    getUserFavorites(session.user.id),
    getUserWatchlist(session.user.id),
  ])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <UserProfile user={session.user} />
        <DashboardContent favorites={favorites} watchlist={watchlist} />
      </div>
    </div>
  )
}
