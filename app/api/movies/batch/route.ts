import { NextRequest, NextResponse } from "next/server"
import { getMoviesByIds } from "@/lib/tmdb"

export async function POST(request: NextRequest) {
  try {
    const { movieIds } = await request.json()
    
    if (!movieIds || !Array.isArray(movieIds)) {
      return NextResponse.json(
        { error: "Invalid movie IDs" },
        { status: 400 }
      )
    }

    const movies = await getMoviesByIds(movieIds)
    return NextResponse.json(movies)
  } catch (error) {
    console.error("Failed to fetch movies:", error)
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    )
  }
}
