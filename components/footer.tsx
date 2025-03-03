import Link from "next/link"
import { Film } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MovieDB. All rights reserved.</p>
        </div>

        <nav className="flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/search" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            Search
          </Link>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:underline underline-offset-4"
          >
            TMDB API
          </a>
        </nav>
      </div>
    </footer>
  )
}

