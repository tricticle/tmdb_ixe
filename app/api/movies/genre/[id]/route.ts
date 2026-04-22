import { NextRequest, NextResponse } from "next/server"
import { getMoviesByGenre } from "@/lib/tmdb"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const genreId = parseInt(id)
  
  try {
    const movies = await getMoviesByGenre(genreId, page)
    return NextResponse.json(movies)
  } catch (error) {
    console.error("Failed to fetch movies by genre:", error)
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    )
  }
}
