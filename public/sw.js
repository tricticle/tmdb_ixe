// MovieDB Service Worker for Push Notifications

self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim())
})

// Handle push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    
    const options = {
      body: data.body || data.message,
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
        movieId: data.movieId,
      },
      actions: data.movieId
        ? [
            { action: "view", title: "View Movie" },
            { action: "dismiss", title: "Dismiss" },
          ]
        : [{ action: "dismiss", title: "Dismiss" }],
      tag: data.tag || "moviedb-notification",
      renotify: true,
    }

    event.waitUntil(
      self.registration.showNotification(data.title || "MovieDB", options)
    )
  } catch (error) {
    console.error("Error showing notification:", error)
  }
})

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "dismiss") return

  const url = event.notification.data?.movieId
    ? `/movies/${event.notification.data.movieId}`
    : event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
