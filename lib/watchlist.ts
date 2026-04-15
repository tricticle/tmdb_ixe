import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get user watchlist
export async function getUserWatchlist(userId: string) {
  return prisma.watchlist.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Add a movie to watchlist
export async function addToWatchlist(userId: string, movieId: number) {
  const existing = await prisma.watchlist.findFirst({
    where: {
      userId,
      movieId,
    },
  })

  if (existing) {
    return existing
  }

  return prisma.watchlist.create({
    data: {
      userId,
      movieId,
    },
  })
}

// Remove a movie from watchlist
export async function removeFromWatchlist(userId: string, movieId: number) {
  return prisma.watchlist.deleteMany({
    where: {
      userId,
      movieId,
    },
  })
}

// Check if a movie is in user's watchlist
export async function isInWatchlist(userId: string, movieId: number) {
  const item = await prisma.watchlist.findFirst({
    where: {
      userId,
      movieId,
    },
  })

  return !!item
}
