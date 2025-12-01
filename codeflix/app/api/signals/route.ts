import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

function getUserIdFromRequest(request: NextRequest): number | null {
  const token = request.cookies.get("codeflix_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

type SignalBody =
  | { type: "click"; movieId: number }
  | { type: "search"; query: string };

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SignalBody>;
    const { type } = body;

    if (type === "click" && typeof body.movieId === "number") {
      await prisma.userClick.create({
        data: { userId, movieId: body.movieId },
      });
      return NextResponse.json({ success: true });
    }

    if (type === "search" && typeof body.query === "string" && body.query.trim().length > 0) {
      await prisma.userSearch.create({
        data: { userId, query: body.query.trim() },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  } catch (error) {
    console.error("Error guardando señal:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
