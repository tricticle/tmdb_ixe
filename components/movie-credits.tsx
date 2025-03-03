import type { Credits } from "@/types/tmdb"
import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

interface MovieCreditsProps {
  credits: Credits
}

export function MovieCredits({ credits }: MovieCreditsProps) {
  // Get top cast members (limit to 10)
  const cast = credits.cast.slice(0, 10)

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-4 p-1">
        {cast.map((person) => (
          <Card key={person.id} className="w-[150px] shrink-0">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-lg">
              {person.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <span className="text-xs text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h4 className="font-medium line-clamp-1">{person.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

