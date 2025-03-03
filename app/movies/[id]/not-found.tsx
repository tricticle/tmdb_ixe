import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[50vh] py-12 text-center">
      <h2 className="text-3xl font-bold mb-4">Movie Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find the movie you're looking for. It may have been removed or you might have followed a broken
        link.
      </p>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}

