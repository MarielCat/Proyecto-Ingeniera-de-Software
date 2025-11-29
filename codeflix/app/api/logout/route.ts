import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Sesión cerrada" });

  res.cookies.set("codeflix_token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}
