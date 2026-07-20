import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="kicker">DIGITALNA BAŠTINA · DEMO</p>
        <h2>Prošlost nije nepomična.<br />Ona čeka da je ponovno otkrijemo.</h2>
      </div>
      <div className="footer-links">
        <Link href="/izlozba">Uđi u izložbu</Link>
        <Link href="/artefakti">Zbirka artefakata</Link>
        <Link href="/vremenska-crta">Vremenska crta</Link>
        <Link href="/#vodic">Digitalni vodič</Link>
        <span>© 2026 MVP prezentacija</span>
      </div>
    </footer>
  );
}
