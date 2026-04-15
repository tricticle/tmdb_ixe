"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Play, X, Loader2 } from "lucide-react"
import type { Video } from "@/types/tmdb"

interface MovieTrailerProps {
  movieId: string
  movieTitle: string
}

export function MovieTrailer({ movieId, movieTitle }: MovieTrailerProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true)
      try {
        const response = await fetch(`/api/movies/${movieId}/videos`)
        const data = await response.json()
        if (data.results) {
          // Filter for YouTube trailers
          const trailers = data.results.filter(
            (video: Video) => 
              video.site === "YouTube" && 
              (video.type === "Trailer" || video.type === "Teaser")
          )
          setVideos(trailers)
          if (trailers.length > 0) {
            setSelectedVideo(trailers[0])
          }
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen && videos.length === 0) {
      fetchVideos()
    }
  }, [movieId, isOpen, videos.length])

  if (loading) {
    return (
      <Button disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Play className="h-4 w-4" />
        Watch Trailer
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <DialogTitle className="sr-only">{movieTitle} - Trailer</DialogTitle>
          <DialogDescription className="sr-only">
            Watch the official trailer for {movieTitle}
          </DialogDescription>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {selectedVideo ? (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0`}
                  title={selectedVideo.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">No trailer available</p>
              </div>
            )}

            {videos.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto bg-black">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded text-sm transition-colors ${
                      selectedVideo?.id === video.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    }`}
                  >
                    {video.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
