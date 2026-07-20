import type { Metadata } from "next";
import { VirtualGallery } from "@/components/virtual-gallery";

export const metadata: Metadata = { title: "Virtualna izložba" };

export default function ExhibitionPage() {
  return (
    <main className="exhibition-page">
      <div className="exhibition-heading">
        <p className="kicker">VIRTUALNI HODNIK 01</p>
        <h1>Prošećite kroz priču.</h1>
      </div>
      <VirtualGallery />
    </main>
  );
}
