import { ArrowUpRight } from "lucide-react";
import type { Artifact } from "@/data/exhibit";
import { ArtifactVisual } from "@/components/artifact-visual";

export function ArtifactCard({ artifact, onOpen }: { artifact: Artifact; onOpen?: (artifact: Artifact) => void }) {
  const content = (
    <>
      <ArtifactVisual artifact={artifact} compact />
      <div className="artifact-card-copy">
        <span>{artifact.category} · {artifact.year}</span>
        <h3>{artifact.name}</h3>
        <p>{artifact.location}</p>
      </div>
      <ArrowUpRight className="artifact-arrow" size={19} />
    </>
  );

  return onOpen ? (
    <button className="artifact-card" onClick={() => onOpen(artifact)} aria-label={`Otvori detalje: ${artifact.name}`}>
      {content}
    </button>
  ) : (
    <div className="artifact-card">{content}</div>
  );
}
