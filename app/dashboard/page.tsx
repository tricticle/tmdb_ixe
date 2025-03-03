import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserProfile } from "@/components/user-profile"
import { FavoriteMovies } from "@/components/favorite-movies"
import type { Metadata } from "next"
import { getUserFavorites } from "@/lib/favorites"

export const metadata: Metadata = {
  title: "Dashboard - MovieDB",
  description: "View your profile and favorite movies",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  const favorites = await getUserFavorites(session.user.id)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <UserProfile user={session.user} />
        <FavoriteMovies favorites={favorites} />
      </div>
    </div>
  )
}

