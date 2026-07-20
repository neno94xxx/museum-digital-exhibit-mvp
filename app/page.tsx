import Link from "next/link";
import { ArrowDown, ArrowRight, Compass, Layers3, MapPinned, ScanLine } from "lucide-react";
import { artifacts, exhibition } from "@/data/exhibit";
import { ArtifactVisual } from "@/components/artifact-visual";
import { ArtifactCard } from "@/components/artifact-card";
import { DigitalGuide } from "@/components/digital-guide";
import { ExhibitMap } from "@/components/exhibit-map";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-grain" />
        <div className="hero-copy">
          <p className="kicker">DIGITALNA MINI-IZLOŽBA · 2026</p>
          <h1>Tragovi<br /><em>kroz vrijeme</em></h1>
          <p className="hero-lead">{exhibition.subtitle}. Pet predmeta. Tri mjesta. Jedna priča koja traje gotovo dvije tisuće godina.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/izlozba">Uđi u izložbu <ArrowRight size={18} /></Link>
            <Link className="button button-ghost" href="/artefakti">Pogledaj artefakte</Link>
          </div>
        </div>
        <div className="hero-object">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" />
          <ArtifactVisual artifact={artifacts[0]} />
          <div className="object-caption"><span>01</span><p><strong>Jantarna amfora</strong>Narona · 1. stoljeće</p></div>
        </div>
        <a className="scroll-cue" href="#o-izlozbi"><ArrowDown size={17} /> OTKRIJ PRIČU</a>
      </section>

      <section className="intro-section" id="o-izlozbi">
        <div className="intro-number">MMXXVI</div>
        <div className="intro-copy">
          <p className="kicker">O IZLOŽBI</p>
          <h2>Predmeti šute.<br /><em>Dok ih ne pitamo.</em></h2>
          <p>{exhibition.description}</p>
        </div>
        <div className="intro-features">
          <div><ScanLine /><span><strong>5</strong> digitalnih predmeta</span></div>
          <div><MapPinned /><span><strong>3</strong> povijesne lokacije</span></div>
          <div><Layers3 /><span><strong>6</strong> ključnih trenutaka</span></div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-topline">
          <SectionHeading kicker="IZDVOJENI PREDMETI" title="Zbirka u fokusu" text="Od svakodnevne posude do simbola moći — svaki predmet otvara drugi pogled na prošlost." />
          <Link className="text-link" href="/artefakti">Svi artefakti <ArrowRight size={17} /></Link>
        </div>
        <div className="featured-grid">
          {artifacts.slice(0, 3).map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} />)}
        </div>
      </section>

      <section className="timeline-section" id="vrijeme">
        <SectionHeading kicker="VREMENSKA CRTA" title="Dvije i pol tisuće godina. Tri razine." text="Od velikih razdoblja do pojedinih vladavina — otvorite zasebnu kartu i zumirajte povijest istočnog Jadrana." />
        <Link className="timeline-route-teaser" href="/vremenska-crta">
          <span><small>600. pr. Kr.</small><i /></span>
          <strong>ANTIKA</strong>
          <span><small>476.</small><i /></span>
          <strong>SREDNJI VIJEK</strong>
          <span><small>1492.</small><i /></span>
          <strong>NOVI VIJEK</strong>
          <span><small>1918.</small><i /></span>
          <em>Otvori i zumiraj kartu <ArrowRight size={18} /></em>
        </Link>
      </section>

      <section className="map-section" id="lokacije">
        <div className="section-topline">
          <SectionHeading kicker="MJESTA PRIČE" title="Baština ima adresu" text="Tri lokacije povezuju predmete iz ove demo zbirke. Odaberite oznaku na stiliziranoj karti." />
          <Compass className="section-icon" size={46} strokeWidth={1} />
        </div>
        <ExhibitMap />
      </section>

      <section className="guide-section" id="vodic"><DigitalGuide /></section>
      <SiteFooter />
    </main>
  );
}
