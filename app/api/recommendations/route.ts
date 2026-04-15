import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { getPersonalizedRecommendations } from "@/lib/recommendations"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const recommendations = await getPersonalizedRecommendations(
      session.user.id,
      20
    )

    return NextResponse.json({ results: recommendations })
  } catch (error) {
    console.error("Failed to fetch recommendations:", error)
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    )
  }
}
