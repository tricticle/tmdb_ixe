"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Bell, BellRing, Film, Sparkles, TrendingUp, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

interface NotificationPreferences {
  pushEnabled: boolean
  newReleases: boolean
  recommendations: boolean
  trending: boolean
}

export function NotificationSettings() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushEnabled: false,
    newReleases: true,
    recommendations: true,
    trending: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pushSupported, setPushSupported] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    if ("Notification" in window && "serviceWorker" in navigator) {
      setPushSupported(true)
    }

    if (session) {
      fetchPreferences()
    }
  }, [session])

  async function fetchPreferences() {
    try {
      const response = await fetch("/api/notifications/preferences")
      const data = await response.json()
      if (data.preferences) {
        setPreferences(data.preferences)
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updatePreference(key: keyof NotificationPreferences, value: boolean) {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)

    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPreferences),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved.",
      })
    } catch {
      // Revert on error
      setPreferences(preferences)
      toast({
        title: "Error",
        description: "Failed to update preferences.",
        variant: "destructive",
      })
    }
  }

  async function enablePushNotifications() {
    if (!pushSupported) return

    setSaving(true)
    try {
      const permission = await Notification.requestPermission()
      
      if (permission === "granted") {
        // Register service worker if not already
        const registration = await navigator.serviceWorker.register("/sw.js")
        
        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        })

        // Save subscription to server
        await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription }),
        })

        updatePreference("pushEnabled", true)
        toast({
          title: "Push notifications enabled",
          description: "You will now receive push notifications.",
        })
      } else {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to enable push notifications:", error)
      toast({
        title: "Error",
        description: "Failed to enable push notifications.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Please sign in to manage notification settings.
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Push Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="push">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications even when not on the site
              </p>
            </div>
          </div>
          {preferences.pushEnabled ? (
            <Switch
              id="push"
              checked={preferences.pushEnabled}
              onCheckedChange={(checked) => updatePreference("pushEnabled", checked)}
            />
          ) : (
            <Button
              size="sm"
              onClick={enablePushNotifications}
              disabled={!pushSupported || saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enable"}
            </Button>
          )}
        </div>

        <div className="border-t pt-6 space-y-4">
          <h4 className="text-sm font-medium">Notification Types</h4>

          {/* New Releases */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="h-5 w-5 text-blue-500" />
              <div>
                <Label htmlFor="newReleases">New Releases</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new movie releases
                </p>
              </div>
            </div>
            <Switch
              id="newReleases"
              checked={preferences.newReleases}
              onCheckedChange={(checked) => updatePreference("newReleases", checked)}
            />
          </div>

          {/* Recommendations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <div>
                <Label htmlFor="recommendations">Recommendations</Label>
                <p className="text-sm text-muted-foreground">
                  Personalized movie suggestions based on your taste
                </p>
              </div>
            </div>
            <Switch
              id="recommendations"
              checked={preferences.recommendations}
              onCheckedChange={(checked) => updatePreference("recommendations", checked)}
            />
          </div>

          {/* Trending */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <Label htmlFor="trending">Trending Movies</Label>
                <p className="text-sm text-muted-foreground">
                  Updates about trending and popular movies
                </p>
              </div>
            </div>
            <Switch
              id="trending"
              checked={preferences.trending}
              onCheckedChange={(checked) => updatePreference("trending", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
