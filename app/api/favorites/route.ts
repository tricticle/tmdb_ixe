import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { addFavorite, removeFavorite, getUserFavorites } from "@/lib/favorites";

export async function GET() {
  const session = await getServerSession(authOptions);

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
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { movieId } = await request.json();

    if (!movieId) {
      return NextResponse.json(
          { error: "Movie ID is required" },
          { status: 400 }
      );
    }

    await addFavorite(session.user.id, movieId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return NextResponse.json(
        { error: "Failed to add favorite" },
        { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { movieId } = await request.json();

    if (!movieId) {
      return NextResponse.json(
          { error: "Movie ID is required" },
          { status: 400 }
      );
    }

    await removeFavorite(session.user.id, movieId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return NextResponse.json(
        { error: "Failed to remove favorite" },
        { status: 500 }
    );
  }
}
