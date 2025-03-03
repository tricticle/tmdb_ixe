import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get user favorites
export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: {
      userId,
    },
  })
}

// Add a movie to favorites
export async function addFavorite(userId: string, movieId: number) {
  // Check if already exists
  const existing = await prisma.favorite.findFirst({
    where: {
      userId,
      movieId,
    },
  })

  if (existing) {
    return existing
  }

  return prisma.favorite.create({
    data: {
      userId,
      movieId,
    },
  })
}

// Remove a movie from favorites
export async function removeFavorite(userId: string, movieId: number) {
  return prisma.favorite.deleteMany({
    where: {
      userId,
      movieId,
    },
  })
}

// Check if a movie is in user's favorites
export async function isFavorite(userId: string, movieId: number) {
  const favorite = await prisma.favorite.findFirst({
    where: {
      userId,
      movieId,
    },
  })

  return !!favorite
}

