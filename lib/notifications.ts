import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type NotificationType = 'new_release' | 'recommendation' | 'trending' | 'favorite_update' | 'watchlist_reminder'

// Get user notifications
export async function getUserNotifications(userId: string, limit = 20) {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  })
}

// Get unread notification count
export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  })
}

// Create a notification
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  movieId?: number
) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      movieId,
    },
  })
}

// Mark notification as read
export async function markAsRead(notificationId: string) {
  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  })
}

// Mark all notifications as read
export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  })
}

// Delete a notification
export async function deleteNotification(notificationId: string) {
  return prisma.notification.delete({
    where: {
      id: notificationId,
    },
  })
}

// Get notification preferences
export async function getNotificationPreferences(userId: string) {
  let prefs = await prisma.notificationPreference.findUnique({
    where: {
      userId,
    },
  })

  // Create default preferences if they don't exist
  if (!prefs) {
    prefs = await prisma.notificationPreference.create({
      data: {
        userId,
        pushEnabled: false,
        newReleases: true,
        recommendations: true,
        trending: true,
      },
    })
  }

  return prefs
}

// Update notification preferences
export async function updateNotificationPreferences(
  userId: string,
  preferences: {
    pushEnabled?: boolean
    newReleases?: boolean
    recommendations?: boolean
    trending?: boolean
  }
) {
  return prisma.notificationPreference.upsert({
    where: {
      userId,
    },
    update: preferences,
    create: {
      userId,
      ...preferences,
    },
  })
}

// Save push subscription
export async function savePushSubscription(
  userId: string,
  endpoint: string,
  p256dh: string,
  auth: string
) {
  return prisma.pushSubscription.upsert({
    where: {
      endpoint,
    },
    update: {
      p256dh,
      auth,
    },
    create: {
      userId,
      endpoint,
      p256dh,
      auth,
    },
  })
}

// Get user push subscriptions
export async function getUserPushSubscriptions(userId: string) {
  return prisma.pushSubscription.findMany({
    where: {
      userId,
    },
  })
}

// Delete push subscription
export async function deletePushSubscription(endpoint: string) {
  return prisma.pushSubscription.delete({
    where: {
      endpoint,
    },
  })
}
