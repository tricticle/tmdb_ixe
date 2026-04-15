import { NextRequest, NextResponse } from "next/server"
import { getMovieDetails } from "@/lib/tmdb"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  
  try {
    const movie = await getMovieDetails(id)
    return NextResponse.json(movie)
  } catch (error) {
    console.error("Failed to fetch movie details:", error)
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    )
  }
}
