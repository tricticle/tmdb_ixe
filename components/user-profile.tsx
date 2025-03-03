import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "next-auth"
import Image from "next/image"

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        {user.image ? (
          <Image
            src={user.image || "/placeholder.svg"}
            alt={user.name || "User"}
            width={96}
            height={96}
            className="rounded-full mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-muted-foreground">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </span>
          </div>
        )}

        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-muted-foreground">{user.email}</p>
      </CardContent>
    </Card>
  )
}

