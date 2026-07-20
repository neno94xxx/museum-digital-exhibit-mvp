"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { artifacts, locations } from "@/data/exhibit";

export function ExhibitMap() {
  const [activeId, setActiveId] = useState(locations[0].id);
  const active = locations.find((item) => item.id === activeId) ?? locations[0];
  const related = artifacts.filter((item) => active.artifactIds.includes(item.id));

  return (
    <div className="map-shell">
      <div className="stylized-map" aria-label="Stilizirana karta srednje i južne Dalmacije">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path className="map-sea-lines" d="M2 25 C20 33 24 51 40 62 S72 81 98 88 M1 14 C21 23 33 35 46 49 S72 69 99 76" />
          <path className="map-land" d="M7 0 L100 0 L100 100 C91 94 88 85 77 80 C68 76 67 67 58 63 C48 59 50 51 40 48 C27 44 29 34 19 31 C10 28 12 17 7 0Z" />
          <path className="map-coast" d="M7 0 C12 17 10 28 19 31 C29 34 27 44 40 48 C50 51 48 59 58 63 C67 67 68 76 77 80 C88 85 91 94 100 100" />
          <path className="map-islands" d="M11 42 l8 3 -5 3 -8 -2z M22 57 l12 5 -5 4 -13 -5z M42 70 l15 6 -6 4 -14 -6z" />
        </svg>
        {locations.map((location) => (
          <button
            key={location.id}
            className={`map-marker ${activeId === location.id ? "active" : ""}`}
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            onClick={() => setActiveId(location.id)}
            aria-label={`Prikaži lokaciju ${location.name}`}
          >
            <span><MapPin size={17} /></span><strong>{location.name}</strong>
          </button>
        ))}
      </div>
      <aside className="map-panel" key={active.id}>
        <p className="kicker">LOKACIJA · {active.label}</p>
        <h3>{active.name}</h3>
        <p>{active.description}</p>
        <div className="map-related">
          <span>Povezani predmeti</span>
          {related.map((artifact) => (
            <div key={artifact.id}><i style={{ background: artifact.accent }} /><p><strong>{artifact.name}</strong><small>{artifact.period}</small></p></div>
          ))}
        </div>
      </aside>
    </div>
  );
}
