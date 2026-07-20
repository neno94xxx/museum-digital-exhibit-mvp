import Link from "next/link";
import { Landmark } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Tragovi kroz vrijeme — naslovnica">
        <span className="brand-mark"><Landmark size={18} strokeWidth={1.6} /></span>
        <span><strong>TRAGOVI</strong><small>digitalna izložba</small></span>
      </Link>
      <nav aria-label="Glavna navigacija">
        <Link href="/izlozba">Virtualna izložba</Link>
        <Link href="/artefakti">Artefakti</Link>
        <Link href="/vremenska-crta">Vremenska crta</Link>
        <Link className="nav-cta" href="/#vodic">Pitaj vodiča</Link>
      </nav>
    </header>
  );
}
