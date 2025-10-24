import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Proxy endpoint to download icons from external URLs
 * This bypasses CORS restrictions by fetching server-side
 */
export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Validate URL is from allowed domains
    const allowedDomains = [
      'image.pollinations.ai',
      'pollinations.ai',
    ];
    
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const isAllowed = allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );

    if (!isAllowed && !url.startsWith('data:')) {
      return NextResponse.json(
        { error: "URL domain not allowed" },
        { status: 403 }
      );
    }

    // For data URLs, return as-is
    if (url.startsWith('data:')) {
      return NextResponse.json({ url });
    }

    // Fetch the image from the external URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image data
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return the image with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/png',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error("Error downloading icon:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to download icon",
      },
      { status: 500 }
    );
  }
}
