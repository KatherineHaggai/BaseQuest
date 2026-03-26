import { NextResponse } from "next/server";
import { SITE_META, SITE_URL } from "@/lib/site";

function withValidProperties(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (value && typeof value === "object") return Object.keys(value).length > 0;
      return value !== undefined && value !== null && value !== "";
    })
  );
}

export function GET() {
  const accountAssociation = withValidProperties({
    header: process.env.FARCASTER_HEADER,
    payload: process.env.FARCASTER_PAYLOAD,
    signature: process.env.FARCASTER_SIGNATURE
  });

  return NextResponse.json(
    withValidProperties({
      ...(Object.keys(accountAssociation).length > 0 ? { accountAssociation } : {}),
      baseBuilder: {
        allowedAddresses: ["0x3035E8B39a5bBd98AE71E29672C6e0D47E121e59"]
      },
      miniapp: {
        version: "1",
        name: SITE_META.name,
        subtitle: SITE_META.subtitle,
        description: SITE_META.description,
        tagline: SITE_META.tagline,
        iconUrl: SITE_META.iconUrl,
        splashImageUrl: SITE_META.splashImageUrl,
        splashBackgroundColor: "#14081f",
        homeUrl: SITE_URL,
        heroImageUrl: SITE_META.heroImageUrl,
        screenshotUrls: SITE_META.screenshotUrls,
        primaryCategory: SITE_META.category,
        tags: SITE_META.tags,
        ogTitle: "BaseQuest | Quest Protocol on Base",
        ogDescription: SITE_META.description,
        ogImageUrl: SITE_META.heroImageUrl,
        canonicalDomain: "basequest-one.vercel.app"
      },
      frame: {
        version: "next",
        imageUrl: SITE_META.heroImageUrl,
        button: {
          title: "Launch BaseQuest",
          action: {
            type: "launch_frame",
            name: SITE_META.name,
            url: SITE_URL,
            splashImageUrl: SITE_META.splashImageUrl,
            splashBackgroundColor: "#14081f"
          }
        }
      }
    }),
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate"
      }
    }
  );
}
