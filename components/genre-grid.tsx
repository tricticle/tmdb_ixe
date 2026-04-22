"use client"

import type { Genre } from "@/types/tmdb"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Sword, 
  Laugh, 
  Heart, 
  Film, 
  Ghost, 
  Music, 
  Sparkles, 
  Compass,
  Skull,
  Baby,
  Search,
  History,
  Clapperboard,
  Tv,
  Shield,
  Bomb,
  type LucideIcon
} from "lucide-react"

const genreIcons: Record<number, LucideIcon> = {
  28: Sword, // Action
  12: Compass, // Adventure
  16: Baby, // Animation
  35: Laugh, // Comedy
  80: Shield, // Crime
  99: Clapperboard, // Documentary
  18: Film, // Drama
  10751: Heart, // Family
  14: Sparkles, // Fantasy
  36: History, // History
  27: Ghost, // Horror
  10402: Music, // Music
  9648: Search, // Mystery
  10749: Heart, // Romance
  878: Sparkles, // Science Fiction
  10770: Tv, // TV Movie
  53: Skull, // Thriller
  10752: Bomb, // War
  37: Sword, // Western
}

const genreColors: Record<number, string> = {
  28: "from-red-500/20 to-orange-500/20 border-red-500/30",
  12: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  16: "from-pink-500/20 to-purple-500/20 border-pink-500/30",
  35: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
  80: "from-slate-500/20 to-zinc-500/20 border-slate-500/30",
  99: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  18: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30",
  10751: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  14: "from-violet-500/20 to-fuchsia-500/20 border-violet-500/30",
  36: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
  27: "from-gray-500/20 to-slate-500/20 border-gray-500/30",
  10402: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30",
  9648: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
  10749: "from-red-500/20 to-rose-500/20 border-red-500/30",
  878: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  10770: "from-teal-500/20 to-emerald-500/20 border-teal-500/30",
  53: "from-orange-500/20 to-red-500/20 border-orange-500/30",
  10752: "from-stone-500/20 to-zinc-500/20 border-stone-500/30",
  37: "from-amber-600/20 to-orange-500/20 border-amber-500/30",
}

interface GenreGridProps {
  genres: Genre[]
}

export function GenreGrid({ genres }: GenreGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {genres.map((genre, index) => {
        const Icon = genreIcons[genre.id] || Film
        const colorClass = genreColors[genre.id] || "from-primary/20 to-primary/10 border-primary/30"
        
        return (
          <motion.div
            key={genre.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/genres/${genre.id}`}>
              <div className={`
                relative overflow-hidden rounded-xl border p-6
                bg-gradient-to-br ${colorClass}
                hover:scale-105 transition-transform duration-300
                flex flex-col items-center justify-center gap-3
                min-h-[120px]
              `}>
                <Icon className="h-8 w-8 text-foreground/80" />
                <span className="font-medium text-center">{genre.name}</span>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
