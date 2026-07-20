import type { Metadata } from "next";
import { ArtifactExplorer } from "@/components/artifact-explorer";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "Artefakti" };

export default function ArtifactsPage() {
  return (
    <main className="subpage">
      <section className="page-hero">
        <p className="kicker">DIGITALNA ZBIRKA · 4 PREDMETA</p>
        <h1>Artefakti</h1>
        <p>Odaberite razdoblje, istražite zbirku i otvorite predmet kako biste pročitali njegovu priču.</p>
      </section>
      <section className="collection-section"><ArtifactExplorer /></section>
      <SiteFooter />
    </main>
  );
}
