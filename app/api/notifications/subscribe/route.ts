import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import {
  savePushSubscription,
  deletePushSubscription,
  updateNotificationPreferences,
} from "@/lib/notifications"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { subscription } = await request.json()

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Valid subscription is required" },
        { status: 400 }
      )
    }

    const keys = subscription.keys || {}

    await savePushSubscription(
      session.user.id,
      subscription.endpoint,
      keys.p256dh || "",
      keys.auth || ""
    )

    // Enable push notifications in preferences
    await updateNotificationPreferences(session.user.id, {
      pushEnabled: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save push subscription:", error)
    return NextResponse.json(
      { error: "Failed to save subscription" },
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
    const { endpoint } = await request.json()

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      )
    }

    await deletePushSubscription(endpoint)

    // Update preferences
    await updateNotificationPreferences(session.user.id, {
      pushEnabled: false,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete push subscription:", error)
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    )
  }
}
