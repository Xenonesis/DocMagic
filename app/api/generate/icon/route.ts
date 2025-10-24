import { NextResponse } from "next/server";
import { createRoute } from "@/lib/supabase/server";
import { generateIconWithOpenRouter } from "@/lib/openrouter";

export const runtime = "edge";
export const maxDuration = 60;

interface IconRequest {
  prompt: string;
  style: string;
  size: number;
  colorScheme: string;
}

export async function POST(request: Request) {
  try {
    const supabase = createRoute();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get request body
    const body: IconRequest = await request.json();
    const { prompt, style, size, colorScheme } = body;

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Icon description is required" },
        { status: 400 }
      );
    }

    // Check subscription limits for non-premium users
    if (user) {
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (subscription?.tier !== "premium") {
        // Check usage limits for free tier (10 icons per month)
        const { data: usage } = await supabase
          .from("usage_stats")
          .select("icons_generated")
          .eq("user_id", user.id)
          .single();

        if (usage && usage.icons_generated >= 10) {
          return NextResponse.json(
            {
              error: "Free tier limit reached. Upgrade to Premium for unlimited icons.",
              upgradeRequired: true,
            },
            { status: 403 }
          );
        }
      }
    }

    // Generate icons using OpenRouter
    const icons = await generateIconWithOpenRouter({
      prompt,
      style,
      size,
      colorScheme,
    });

    // Update usage stats if user is authenticated
    if (user) {
      await supabase.rpc("increment_icons_generated", {
        p_user_id: user.id,
      });
    }

    return NextResponse.json({
      success: true,
      icons,
      message: "Icons generated successfully",
    });
  } catch (error) {
    console.error("Error generating icon:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate icon",
      },
      { status: 500 }
    );
  }
}
