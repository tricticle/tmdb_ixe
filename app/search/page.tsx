import { SearchForm } from "@/components/search-form"
import { SearchContent } from "@/components/search-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Movies - MovieDB",
  description: "Search for your favorite movies",
}

interface SearchPageProps {
  searchParams: { query?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query || ""

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Movies</h1>

      <div className="mb-8">
        <SearchForm defaultValue={query} />
      </div>

      <SearchContent query={query} />
    </div>
  )
}

