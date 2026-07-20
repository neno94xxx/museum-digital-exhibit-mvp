import type { Metadata } from "next";
import { AdvancedTimeline } from "@/components/advanced-timeline";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Vremenska crta",
  description: "Zumabilna vremenska karta povijesti istočnog Jadrana i predmeta digitalne zbirke.",
};

export default function TimelinePage() {
  return (
    <main className="timeline-page">
      <section className="timeline-page-hero">
        <div>
          <p className="kicker">INTERAKTIVNA KRONOLOGIJA · 600. PR. KR. – 1918.</p>
          <h1>Vrijeme<br /><em>ima dubinu.</em></h1>
        </div>
        <div className="timeline-hero-copy">
          <span>01 — 03</span>
          <p>Krenite od velikih razdoblja, zatim zumirajte sve do pojedinih vladavina i događaja. Svaka razina otkriva predmete koji joj pripadaju.</p>
        </div>
      </section>
      <section className="timeline-page-content">
        <AdvancedTimeline />
      </section>
      <SiteFooter />
    </main>
  );
}
