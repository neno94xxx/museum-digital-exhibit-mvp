import { artifacts, locations, timelineEvents } from "@/data/exhibit";

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("hr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const stopWords = new Set(["koji", "koja", "koje", "kada", "gdje", "kako", "sto", "je", "su", "se", "na", "u", "o", "i", "iz", "mi", "reci", "predmet"]);

export type GuideAnswer = { text: string; source: string } | null;

export function searchExhibit(question: string): GuideAnswer {
  const words = normalize(question)
    .split(/\W+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  if (!words.length) return null;

  const score = (text: string) => {
    const normalized = normalize(text);
    return words.reduce((total, word) => {
      const stem = word.length >= 5 ? word.slice(0, 5) : word;
      return total + (normalized.includes(word) || normalized.includes(stem) ? 1 : 0);
    }, 0);
  };

  const candidates = [
    ...artifacts.map((item) => ({
      score: score(`${item.name} ${item.description} ${item.period} ${item.category} ${item.location} ${item.fact}`),
      text: `${item.name} — ${item.description} Razdoblje: ${item.period}. Lokacija: ${item.location}. Zanimljivost: ${item.fact}`,
    })),
    ...timelineEvents.map((item) => ({
      score: score(`${item.year} ${item.title} ${item.description}`),
      text: `${item.title} (${item.year}) — ${item.description}`,
    })),
    ...locations.map((item) => ({
      score: score(`${item.name} ${item.label} ${item.description}`),
      text: `${item.name} (${item.label}) — ${item.description}`,
    })),
  ].sort((a, b) => b.score - a.score);

  if (!candidates[0]?.score) return null;
  return { text: candidates[0].text, source: "demo podaci izložbe" };
}
