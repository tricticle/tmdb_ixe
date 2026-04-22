"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

// Convert base64 to Uint8Array for push subscription
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Check if push notifications are supported
  const checkSupport = useCallback(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window
    setIsSupported(supported)
    return supported
  }, [])

  // Request permission and subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!checkSupport()) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in your browser.",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        })
        return null
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready

      // Get the VAPID public key from env
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

      if (!vapidPublicKey) {
        // If no VAPID key, just enable in-app notifications
        toast({
          title: "Notifications Enabled",
          description: "You will receive in-app notifications.",
        })
        return null
      }

      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      // Send subscription to server
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: pushSubscription.endpoint,
          keys: {
            p256dh: btoa(
              String.fromCharCode(...Array.from(new Uint8Array(pushSubscription.getKey("p256dh")!)))
            ),
            auth: btoa(
              String.fromCharCode(...Array.from(new Uint8Array(pushSubscription.getKey("auth")!)))
            ),
          },
        }),
      })

      if (response.ok) {
        setSubscription(pushSubscription)
        toast({
          title: "Push Notifications Enabled",
          description: "You will receive push notifications for new releases and recommendations.",
        })
        return pushSubscription
      }
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      toast({
        title: "Subscription Failed",
        description: "Failed to enable push notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }

    return null
  }, [checkSupport, toast])

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!subscription) return

    setIsLoading(true)

    try {
      await subscription.unsubscribe()

      // Remove subscription from server
      await fetch("/api/notifications/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      })

      setSubscription(null)
      toast({
        title: "Push Notifications Disabled",
        description: "You will no longer receive push notifications.",
      })
    } catch (error) {
      console.error("Failed to unsubscribe:", error)
      toast({
        title: "Error",
        description: "Failed to disable push notifications.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [subscription, toast])

  return {
    isSupported,
    subscription,
    isLoading,
    checkSupport,
    subscribe,
    unsubscribe,
  }
}
