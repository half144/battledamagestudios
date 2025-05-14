import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-rnqhnainrwsbyeyvttcm-auth-token");

  const parsedToken = JSON.parse(token!.value);

  if (parsedToken) {
    return NextResponse.json({ token: parsedToken[0] });
  } else {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }
}
