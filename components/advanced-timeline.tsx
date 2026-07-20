"use client";

import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, WheelEvent } from "react";
import { ChevronRight, Focus, Layers3, MousePointer2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { ArtifactVisual } from "@/components/artifact-visual";
import { artifacts } from "@/data/exhibit";
import { historicalPeriods, type HistoricalPeriod } from "@/data/historical-timeline";

const levelLabels = ["Velika razdoblja", "Povijesne epohe", "Vladavine i događaji"];
const zoomLabels = ["1×", "2×", "4×"];

function formatYear(year: number) {
  if (year < 0) return `${Math.abs(year)}. pr. Kr.`;
  return `${year}.`;
}

function getTicks(nodes: HistoricalPeriod[], start: number, end: number) {
  return Array.from(new Set([start, ...nodes.map((node) => node.start), end])).sort((a, b) => a - b);
}

export function AdvancedTimeline() {
  const [trail, setTrail] = useState<HistoricalPeriod[]>([]);
  const [focusedId, setFocusedId] = useState(historicalPeriods[0].id);
  const lastWheelAction = useRef(0);
  const parent = trail.at(-1);
  const nodes = parent?.children ?? historicalPeriods;
  const focused = nodes.find((node) => node.id === focusedId) ?? nodes[0];
  const rangeStart = parent?.start ?? historicalPeriods[0].start;
  const rangeEnd = parent?.end ?? historicalPeriods.at(-1)!.end;
  const rangeLength = rangeEnd - rangeStart || 1;
  const level = trail.length;
  const ticks = getTicks(nodes, rangeStart, rangeEnd);
  const relatedArtifacts = artifacts.filter((artifact) => focused.artifactIds.includes(artifact.id));

  function focusRelative(direction: number) {
    const currentIndex = nodes.findIndex((node) => node.id === focused.id);
    const nextIndex = (currentIndex + direction + nodes.length) % nodes.length;
    setFocusedId(nodes[nextIndex].id);
  }

  function zoomInto(period = focused) {
    if (!period.children?.length) return;
    setTrail((current) => [...current, period]);
    setFocusedId(period.children[0].id);
  }

  function zoomOutOneLevel() {
    if (!trail.length) return;
    const previousParent = trail.at(-1)!;
    setTrail((current) => current.slice(0, -1));
    setFocusedId(previousParent.id);
  }

  function resetTimeline() {
    setTrail([]);
    setFocusedId(historicalPeriods[0].id);
  }

  function navigateToBreadcrumb(index: number) {
    if (index < 0) {
      setFocusedId(trail[0]?.id ?? historicalPeriods[0].id);
      setTrail([]);
      return;
    }

    if (index === trail.length - 1) return;
    const nextFocused = trail[index + 1];
    setTrail(trail.slice(0, index + 1));
    setFocusedId(nextFocused?.id ?? trail[index].children?.[0].id ?? trail[index].id);
  }

  function handleKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusRelative(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusRelative(-1);
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomInto();
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      zoomOutOneLevel();
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const now = Date.now();
    if (now - lastWheelAction.current < 450) return;
    lastWheelAction.current = now;
    if (event.deltaY < 0) zoomInto();
    else zoomOutOneLevel();
  }

  return (
    <div className="advanced-timeline">
      <div className="timeline-toolbar">
        <nav className="timeline-breadcrumbs" aria-label="Razine vremenske crte">
          <button onClick={() => navigateToBreadcrumb(-1)} aria-current={level === 0 ? "page" : undefined}>Pregled</button>
          {trail.map((period, index) => (
            <span key={period.id}>
              <ChevronRight size={13} />
              <button
                onClick={() => navigateToBreadcrumb(index)}
                aria-current={index === trail.length - 1 ? "page" : undefined}
              >
                {period.title}
              </button>
            </span>
          ))}
        </nav>

        <div className="timeline-zoom-controls" aria-label="Kontrole zumiranja">
          <button onClick={zoomOutOneLevel} disabled={level === 0} aria-label="Umanji vremensku crtu"><ZoomOut size={17} /></button>
          <span><small>{levelLabels[level]}</small><strong>{zoomLabels[level]}</strong></span>
          <button onClick={() => zoomInto()} disabled={!focused.children?.length} aria-label="Povećaj odabrano razdoblje"><ZoomIn size={17} /></button>
          <button onClick={resetTimeline} disabled={level === 0 && focused.id === historicalPeriods[0].id} aria-label="Vrati početni prikaz"><RotateCcw size={16} /></button>
        </div>
      </div>

      <div className="timeline-instructions">
        <span><MousePointer2 size={15} /> Odaberi razdoblje</span>
        <span><ZoomIn size={15} /> Dvaput klikni za zumiranje</span>
        <span><Layers3 size={15} /> Ctrl + kotačić mijenja razinu</span>
      </div>

      <div className="timeline-stage-scroll">
        <div
          className="advanced-timeline-stage"
          tabIndex={0}
          onKeyDown={handleKeyboard}
          onWheel={handleWheel}
          aria-label={`${levelLabels[level]}. Strelicama odaberite razdoblje, tipkama plus i minus zumirajte.`}
        >
          <div className="timeline-stage-level"><span>0{level + 1}</span>{levelLabels[level]}</div>
          <div className="timeline-plot">
            <div className="timeline-axis" />
            {nodes.map((node, index) => {
              const left = ((node.start - rangeStart) / rangeLength) * 100;
              const rawWidth = ((node.end - node.start) / rangeLength) * 100;
              const width = Math.max(rawWidth, 0.45);
              const midpoint = Math.min(95, Math.max(5, left + width / 2));
              const active = focused.id === node.id;

              return (
                <div className={`timeline-node ${active ? "active" : ""}`} key={node.id}>
                  <span
                    className="timeline-node-range"
                    style={{ left: `${left}%`, width: `${width}%` } as CSSProperties}
                    aria-hidden="true"
                  />
                  <span className="timeline-node-marker" style={{ left: `${midpoint}%` } as CSSProperties} aria-hidden="true" />
                  <button
                    className={index % 2 === 0 ? "timeline-node-card upper" : "timeline-node-card lower"}
                    style={{ left: `${midpoint}%` } as CSSProperties}
                    onClick={() => setFocusedId(node.id)}
                    onDoubleClick={() => zoomInto(node)}
                    aria-pressed={active}
                    aria-label={`${node.title}, ${node.dateLabel}`}
                  >
                    <small>{node.dateLabel}</small>
                    <strong>{node.title}</strong>
                    {node.children?.length ? <span><ZoomIn size={12} /> dublja razina</span> : <span><Focus size={12} /> događaj</span>}
                  </button>
                </div>
              );
            })}
            <div className="timeline-ticks" aria-hidden="true">
              {ticks.map((tick) => {
                const left = ((tick - rangeStart) / rangeLength) * 100;
                return <span key={tick} style={{ left: `${left}%` } as CSSProperties}><i />{formatYear(tick)}</span>;
              })}
            </div>
          </div>
        </div>
      </div>

      <section className="timeline-focus" key={focused.id} aria-live="polite">
        <div className="timeline-focus-index"><span>FOKUS</span><strong>{String(nodes.indexOf(focused) + 1).padStart(2, "0")}</strong><small>/ {String(nodes.length).padStart(2, "0")}</small></div>
        <div className="timeline-focus-copy">
          <p className="kicker">{focused.dateLabel}</p>
          <h2>{focused.title}</h2>
          <p>{focused.description}</p>
        </div>
        <div className="timeline-focus-context">
          <span>Povijesni kontekst</span>
          <p>{focused.context}</p>
          {focused.children?.length && (
            <button onClick={() => zoomInto()}>
              Zumiraj u razdoblje <ZoomIn size={16} />
            </button>
          )}
        </div>
      </section>

      <section className="timeline-related-artifacts" aria-labelledby="timeline-artifacts-title">
        <div className="timeline-artifacts-heading">
          <div>
            <p className="kicker">PREDMETI U VREMENU</p>
            <h2 id="timeline-artifacts-title">Artefakti ove razine</h2>
          </div>
          <span>{relatedArtifacts.length} {relatedArtifacts.length === 1 ? "predmet" : "predmeta"}</span>
        </div>

        {relatedArtifacts.length ? (
          <div className="timeline-artifact-grid">
            {relatedArtifacts.map((artifact) => (
              <article className="timeline-artifact" key={artifact.id}>
                <ArtifactVisual artifact={artifact} compact />
                <div>
                  <span>{artifact.category} · {artifact.year}</span>
                  <h3>{artifact.name}</h3>
                  <p>{artifact.location} · {artifact.period}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="timeline-artifact-empty">
            <span aria-hidden="true">—</span>
            <div><strong>Nema povezanog predmeta na ovoj razini</strong><p>Zumirajte drugo razdoblje ili se vratite razinu više kako biste pronašli predmete iz digitalne zbirke.</p></div>
          </div>
        )}
      </section>
    </div>
  );
}
