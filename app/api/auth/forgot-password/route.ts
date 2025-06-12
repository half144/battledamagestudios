import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Hardcode the redirect URL to always point to the production site.
    const redirectTo = "https://battledamagestudios.vercel.app/reset-password";

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error("Supabase password reset error:", error.message);

      return NextResponse.json(
        {
          message:
            "If an account for this email exists, a reset link has been sent.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message:
          "If an account for this email exists, a reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password internal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
