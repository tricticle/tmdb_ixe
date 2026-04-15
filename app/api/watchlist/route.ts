import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { addToWatchlist, removeFromWatchlist, getUserWatchlist } from "@/lib/watchlist"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const watchlist = await getUserWatchlist(session.user.id)
    return NextResponse.json(watchlist)
  } catch (error) {
    console.error("Failed to fetch watchlist:", error)
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { movieId } = await request.json()

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      )
    }

    await addToWatchlist(session.user.id, movieId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to add to watchlist:", error)
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { movieId } = await request.json()

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      )
    }

    await removeFromWatchlist(session.user.id, movieId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to remove from watchlist:", error)
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    )
  }
}
