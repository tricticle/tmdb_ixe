import { searchMovies } from "@/lib/tmdb"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    const page = searchParams.get("page") || "1"

    if (!query || query.trim() === "") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const results = await searchMovies(query, Number.parseInt(page))
    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 })
  }
}
