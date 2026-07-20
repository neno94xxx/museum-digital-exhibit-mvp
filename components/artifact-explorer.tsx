"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Sparkles, Tag, X } from "lucide-react";
import { artifacts, type Artifact } from "@/data/exhibit";
import { ArtifactCard } from "@/components/artifact-card";
import { ArtifactVisual } from "@/components/artifact-visual";

type Filter = "sve" | Artifact["periodKey"];

const filters: { value: Filter; label: string }[] = [
  { value: "sve", label: "Sva razdoblja" },
  { value: "antika", label: "Antika" },
  { value: "srednji-vijek", label: "Srednji vijek" },
  { value: "novi-vijek", label: "Novi vijek" },
];

export function ArtifactExplorer() {
  const [filter, setFilter] = useState<Filter>("sve");
  const [selected, setSelected] = useState<Artifact | null>(null);
  const visible = useMemo(() => artifacts.filter((item) => filter === "sve" || item.periodKey === filter), [filter]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [selected]);

  return (
    <>
      <div className="filter-bar" aria-label="Filtriraj artefakte">
        {filters.map((item) => (
          <button key={item.value} onClick={() => setFilter(item.value)} className={filter === item.value ? "active" : ""}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="result-count">Prikazano {visible.length} od {artifacts.length} predmeta</p>
      <div className="artifact-grid">
        {visible.map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} onOpen={setSelected} />)}
      </div>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="artifact-modal" role="dialog" aria-modal="true" aria-labelledby="artifact-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Zatvori detalje"><X /></button>
            <div className="modal-visual"><ArtifactVisual artifact={selected} interactive /></div>
            <div className="modal-copy">
              <p className="kicker">{selected.eyebrow}</p>
              <h2 id="artifact-title">{selected.name}</h2>
              <p className="modal-description">{selected.description}</p>
              <dl className="artifact-meta">
                <div><dt><CalendarDays size={16} /> Razdoblje</dt><dd>{selected.period}</dd></div>
                <div><dt><MapPin size={16} /> Lokacija</dt><dd>{selected.location}</dd></div>
                <div><dt><Tag size={16} /> Kategorija</dt><dd>{selected.category}</dd></div>
              </dl>
              <div className="fact-box"><Sparkles size={18} /><p><strong>Jeste li znali?</strong>{selected.fact}</p></div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
