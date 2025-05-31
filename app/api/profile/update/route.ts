import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_API_KEY } from "@/lib/supabaseApi";

export async function PATCH(request: NextRequest) {
  try {
    const authCookie = request.cookies.get(
      "sb-rnqhnainrwsbyeyvttcm-auth-token"
    );

    if (!authCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      const tokenData = JSON.parse(decodeURIComponent(authCookie.value));
      const accessToken = tokenData[0];

      if (!accessToken) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      const userData = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: SUPABASE_API_KEY || "",
        },
      });

      if (!userData.ok) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }

      const user = await userData.json();
      const body = await request.json();

      const { full_name, avatar_url } = body;

      if (!full_name && !avatar_url) {
        return NextResponse.json(
          { error: "No data to update" },
          { status: 400 }
        );
      }

      const updateData: any = {};
      if (full_name) updateData.full_name = full_name;
      if (avatar_url) updateData.avatar_url = avatar_url;

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            apikey: SUPABASE_API_KEY || "",
            Prefer: "return=representation",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Supabase error:", errorText);
        return NextResponse.json(
          { error: "Failed to update profile" },
          { status: 500 }
        );
      }

      const updatedProfile = await response.json();

      return NextResponse.json({
        success: true,
        profile: updatedProfile[0],
      });
    } catch (error) {
      console.error("Error processing token:", error);
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
