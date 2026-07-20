"use client";

import { useState } from "react";
import { timelineEvents } from "@/data/exhibit";

export function Timeline() {
  const [active, setActive] = useState(2);
  const current = timelineEvents[active];

  return (
    <div className="timeline-wrap">
      <div className="timeline-track" role="tablist" aria-label="Događaji kroz vrijeme">
        {timelineEvents.map((event, index) => (
          <button
            key={event.id}
            role="tab"
            aria-selected={active === index}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
          >
            <span className="timeline-dot" />
            <span className="timeline-year">{event.year}</span>
            <span className="timeline-title">{event.title}</span>
          </button>
        ))}
      </div>
      <div className="timeline-detail" role="tabpanel" key={current.id}>
        <span>{String(active + 1).padStart(2, "0")} / {String(timelineEvents.length).padStart(2, "0")}</span>
        <div><p className="kicker">{current.year}</p><h3>{current.title}</h3></div>
        <p>{current.description}</p>
      </div>
    </div>
  );
}
