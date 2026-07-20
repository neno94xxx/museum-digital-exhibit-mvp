"use client";

import { FormEvent, useState } from "react";
import { ArrowUp, BookOpen, MessageCircle } from "lucide-react";
import { searchExhibit, type GuideAnswer } from "@/lib/search";

const suggestions = ["Što znaš o Saloni?", "Ispričaj mi nešto o amfori", "Kada je živio Dioklecijan?"];

export function DigitalGuide() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<GuideAnswer | "empty">(null);

  const ask = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setQuestion(clean);
    setAnswer(searchExhibit(clean) ?? "empty");
  };

  const submit = (event: FormEvent) => { event.preventDefault(); ask(question); };

  return (
    <div className="guide-card">
      <div className="guide-orb"><MessageCircle size={30} /></div>
      <div className="guide-copy">
        <p className="kicker">DIGITALNI VODIČ · DEMO</p>
        <h2>Pitajte zbirku.</h2>
        <p>Pretražite priče o predmetima, razdobljima i mjestima iz ove izložbe.</p>
        <form onSubmit={submit}>
          <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Npr. Što je pronađeno u Saloni?" aria-label="Pitanje za digitalnog vodiča" />
          <button aria-label="Pošalji pitanje"><ArrowUp size={20} /></button>
        </form>
        <div className="guide-suggestions">
          {suggestions.map((suggestion) => <button key={suggestion} onClick={() => ask(suggestion)}>{suggestion}</button>)}
        </div>
        {answer && (
          <div className="guide-answer" aria-live="polite">
            <BookOpen size={18} />
            <div>
              <p>{answer === "empty" ? "Nemam dovoljno podataka u ovoj demo verziji." : answer.text}</p>
              <small>Izvor: {answer === "empty" ? "demo podaci izložbe" : answer.source}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
