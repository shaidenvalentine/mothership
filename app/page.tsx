import { ConfiguratorTeaser } from "@/components/sections/ConfiguratorTeaser";
import { FeatureReveals } from "@/components/sections/FeatureReveals";
import { FinalCta } from "@/components/sections/FinalCta";
import { Founders } from "@/components/sections/Founders";
import { HeroScroll } from "@/components/sections/HeroScroll";
import { Numbers } from "@/components/sections/Numbers";
import { OpeningClaim } from "@/components/sections/OpeningClaim";
import { PastBuilds } from "@/components/sections/PastBuilds";
import { Technology } from "@/components/sections/Technology";

export default function HomePage() {
  return (
    <main>
      <HeroScroll />
      <OpeningClaim />
      <FeatureReveals />
      <Technology />
      <Numbers />
      <ConfiguratorTeaser />
      <PastBuilds />
      <Founders />
      <FinalCta />
    </main>
  );
}
