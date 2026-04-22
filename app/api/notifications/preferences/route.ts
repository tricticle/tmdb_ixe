import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/notifications"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const preferences = await getNotificationPreferences(session.user.id)
    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Failed to fetch preferences:", error)
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const preferences = await request.json()

    const updated = await updateNotificationPreferences(
      session.user.id,
      preferences
    )

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update preferences:", error)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}
