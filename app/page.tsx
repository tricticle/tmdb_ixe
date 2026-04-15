import { HeroSection } from "@/components/hero-section"
import { HomeContent } from "@/components/home-content"
import { 
  getTrendingMovies, 
  getNowPlayingMovies, 
  getTopRatedMovies, 
  getUpcomingMovies,
  getPopularMovies 
} from "@/lib/tmdb"

export default async function Home() {
  const [trending, nowPlaying, topRated, upcoming, popular] = await Promise.all([
    getTrendingMovies("day"),
    getNowPlayingMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getPopularMovies(1),
  ])

  return (
    <div className="flex flex-col">
      <HeroSection movies={trending.results} />
      <HomeContent 
        trending={trending.results}
        nowPlaying={nowPlaying.results}
        topRated={topRated.results}
        upcoming={upcoming.results}
        popular={popular.results}
      />
    </div>
  )
}
