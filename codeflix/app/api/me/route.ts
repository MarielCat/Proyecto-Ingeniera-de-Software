import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("codeflix_token");

    if (!token) {
      return NextResponse.json(
        { message: "No autenticado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    return NextResponse.json({
      userId: decoded.userId,
      email: decoded.email,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Token inválido" },
      { status: 401 }
    );
  }
}