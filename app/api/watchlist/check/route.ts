import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isInWatchlist } from "@/lib/watchlist"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ isInWatchlist: false })
  }

  const { searchParams } = new URL(request.url)
  const movieId = searchParams.get("movieId")

  if (!movieId) {
    return NextResponse.json(
      { error: "Movie ID is required" },
      { status: 400 }
    )
  }

  try {
    const inWatchlist = await isInWatchlist(session.user.id, parseInt(movieId))
    return NextResponse.json({ isInWatchlist: inWatchlist })
  } catch (error) {
    console.error("Failed to check watchlist:", error)
    return NextResponse.json(
      { error: "Failed to check watchlist" },
      { status: 500 }
    )
  }
}
