import "./globals.css";
import { Providers } from "@/components/providers";
import { SITE_META, SITE_URL } from "@/lib/site";

export default function RootLayout({ children }) {
  const miniAppEmbed = JSON.stringify({
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
  });

  return (
    <html lang="en">
      <head>
        <title>BaseQuest | Quest Protocol on Base</title>
        <meta
          name="description"
          content="Publish quests on Base, submit proof of work, and distribute rewards with an event-driven bounty flow."
        />
        <meta
          name="keywords"
          content="Base, Mini App, Quest Protocol, Bounty, Rewards, Onchain, BaseQuest"
        />
        <meta name="application-name" content="BaseQuest" />
        <meta name="apple-mobile-web-app-title" content="BaseQuest" />
        <meta name="theme-color" content="#ff6a3d" />
        <meta property="og:title" content="BaseQuest" />
        <meta
          property="og:description"
          content="Create quests, verify submissions, and track bounty rewards on Base."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://basequest-one.vercel.app" />
        <meta property="og:image" content={SITE_META.heroImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BaseQuest" />
        <meta
          name="twitter:description"
          content="A vivid Base mini app for quests, proofs, and reward distribution."
        />
        <meta name="twitter:image" content={SITE_META.heroImageUrl} />
        <meta name="fc:miniapp" content={miniAppEmbed} />
        <meta name="fc:frame" content={miniAppEmbed} />
        <meta name="base:app_id" content="69c49fdc06cd4778829de8a5" />
        <meta property="base:app_id" content="69c49fdc06cd4778829de8a5" />
        <meta
          name="talentapp:project_verification"
          content="7059f1b6309765eafe463a47b1c6f7ea893259279b69daafc9897c14474d3995de2484db8c8bf5c20570f44a368af249c91b2d895bb6f1f6bad65618c8a63752"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate" type="application/json" href="/.well-known/farcaster.json" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
