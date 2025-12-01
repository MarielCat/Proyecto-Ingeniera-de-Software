import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

function getUserIdFromRequest(request: Request): number | null {
  const token = request.cookies.get("codeflix_token")?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const userId = getUserIdFromRequest(request);
  
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { type, movieId, query } = await request.json();

    if (type === "click" && movieId) {
      await prisma.userClick.create({
        data: { userId, movieId }
      });
      return NextResponse.json({ success: true });
    } 
    
    if (type === "search" && query) {
      await prisma.userSearch.create({
        data: { userId, query }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  } catch (error) {
    console.error("Error guardando señal:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}