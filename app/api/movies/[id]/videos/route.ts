import { NextRequest, NextResponse } from "next/server"
import { getMovieVideos } from "@/lib/tmdb"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  
  try {
    const videos = await getMovieVideos(id)
    return NextResponse.json(videos)
  } catch (error) {
    console.error("Failed to fetch movie videos:", error)
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    )
  }
}
