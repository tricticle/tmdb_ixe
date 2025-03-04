import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { addFavorite, removeFavorite, getUserFavorites } from "@/lib/favorites"

export async function GET() {
  const session = await getServerSession(authOptions)

<<<<<<< HEAD
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favorites = await getUserFavorites(session.user.id);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    return NextResponse.json(
        { error: "Failed to fetch favorites" },
        { status: 500 }
    );
  }
=======
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const favorites = await getUserFavorites(session.user.id)

  return NextResponse.json(favorites)
>>>>>>> parent of fa2f36e (all issues fixed)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

<<<<<<< HEAD
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
=======
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
>>>>>>> parent of fa2f36e (all issues fixed)
  }

  try {
    const { movieId } = await request.json()

    if (!movieId) {
<<<<<<< HEAD
      return NextResponse.json(
          { error: "Movie ID is required" },
          { status: 400 }
      );
=======
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
>>>>>>> parent of fa2f36e (all issues fixed)
    }

    await addFavorite(session.user.id, movieId)

    return NextResponse.json({ success: true })
  } catch (error) {
<<<<<<< HEAD
    console.error("Failed to add favorite:", error);
    return NextResponse.json(
        { error: "Failed to add favorite" },
        { status: 500 }
    );
=======
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
>>>>>>> parent of fa2f36e (all issues fixed)
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

<<<<<<< HEAD
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
=======
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
>>>>>>> parent of fa2f36e (all issues fixed)
  }

  try {
    const { movieId } = await request.json()

    if (!movieId) {
<<<<<<< HEAD
      return NextResponse.json(
          { error: "Movie ID is required" },
          { status: 400 }
      );
=======
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
>>>>>>> parent of fa2f36e (all issues fixed)
    }

    await removeFavorite(session.user.id, movieId)

    return NextResponse.json({ success: true })
  } catch (error) {
<<<<<<< HEAD
    console.error("Failed to remove favorite:", error);
    return NextResponse.json(
        { error: "Failed to remove favorite" },
        { status: 500 }
    );
=======
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
>>>>>>> parent of fa2f36e (all issues fixed)
  }
}

