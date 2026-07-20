export type ArtifactShape = "vase" | "coin" | "tablet" | "sculpture";

export type Artifact = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  period: string;
  periodKey: "antika" | "srednji-vijek" | "novi-vijek";
  category: string;
  categoryKey: "keramika" | "numizmatika" | "epigrafija" | "skulptura";
  location: string;
  locationId: string;
  fact: string;
  accent: string;
  shape: ArtifactShape;
  year: string;
};

export const artifacts: Artifact[] = [
  {
    id: "jantarna-amfora",
    name: "Jantarna amfora",
    eyebrow: "Tragovi trgovine Jadranom",
    description:
      "Elegantna transportna posuda nadahnuta nalazima s istočnojadranske obale. Njezin oblik govori o pomorskim rutama kojima su putovali vino, ulje i ideje.",
    period: "Rimsko doba, 1. st.",
    periodKey: "antika",
    category: "Keramika",
    categoryKey: "keramika",
    location: "Narona",
    locationId: "narona",
    fact: "Amfore su često imale žig radionice — svojevrsnu antičku oznaku podrijetla.",
    accent: "#d9a85b",
    shape: "vase",
    year: "oko 70.",
  },
  {
    id: "novac-dioklecijana",
    name: "Novac cara Dioklecijana",
    eyebrow: "Mali predmet, velika poruka",
    description:
      "Rekonstrukcija srebrnog novca iz vremena cara Dioklecijana. Portret vladara i simboli na reversu bili su najrašireniji medij carske moći.",
    period: "Kasna antika, 3.–4. st.",
    periodKey: "antika",
    category: "Numizmatika",
    categoryKey: "numizmatika",
    location: "Salona",
    locationId: "salona",
    fact: "Novac je u Rimskom Carstvu prenosio službene poruke mnogo prije masovnih medija.",
    accent: "#98a3a0",
    shape: "coin",
    year: "oko 300.",
  },
  {
    id: "kameni-natpis",
    name: "Kameni natpis graditelja",
    eyebrow: "Glas uklesan u kamen",
    description:
      "Ulomak počasnog natpisa koji bilježi obnovu javne građevine. Slova, raspored i kamen otkrivaju kulturu urbanog života.",
    period: "Rimsko doba, 2. st.",
    periodKey: "antika",
    category: "Epigrafija",
    categoryKey: "epigrafija",
    location: "Salona",
    locationId: "salona",
    fact: "Klesari su prije rezanja često tankim crtama označavali visinu i položaj slova.",
    accent: "#b7aa90",
    shape: "tablet",
    year: "oko 160.",
  },
  {
    id: "mramorna-muza",
    name: "Mramorna muza",
    eyebrow: "Ideal ljepote kroz stoljeća",
    description:
      "Galerijska interpretacija fragmenta ženske figure. Mirno držanje i draperija podsjećaju na trajni utjecaj antičke skulpture.",
    period: "Novi vijek, 18. st.",
    periodKey: "novi-vijek",
    category: "Skulptura",
    categoryKey: "skulptura",
    location: "Trogir",
    locationId: "trogir",
    fact: "Mramor blago propušta svjetlost, zbog čega skulptura može djelovati mekše od samoga kamena.",
    accent: "#d8d1bd",
    shape: "sculpture",
    year: "oko 1770.",
  },
];

export type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  description: string;
};

export const timelineEvents: TimelineEvent[] = [
  { id: "e1", year: "1. st.", title: "Luka u Naroni", description: "Narona je važno trgovačko središte u dolini Neretve i povezuje unutrašnjost s Jadranom." },
  { id: "e2", year: "oko 160.", title: "Gradnja u Saloni", description: "Javne građevine i kameni natpisi svjedoče o razvijenom urbanom životu glavnog grada provincije." },
  { id: "e3", year: "oko 300.", title: "Dioklecijanovo doba", description: "Reforme mijenjaju Carstvo, a carski novac prenosi novu sliku vlasti cijelim Mediteranom." },
  { id: "e4", year: "7. st.", title: "Preobrazba gradova", description: "Kasnoantička središta se mijenjaju, a stanovništvo, predmeti i znanja nalaze nove putove." },
  { id: "e5", year: "1350.", title: "Grad iza zidina", description: "Dalmatinski gradovi razvijaju komune, obranu i intenzivnu pomorsku trgovinu." },
  { id: "e6", year: "1770.", title: "Povratak antici", description: "Europski kolekcionari i umjetnici iznova otkrivaju klasične ideale i lokalnu baštinu." },
];

export type ExhibitLocation = {
  id: string;
  name: string;
  label: string;
  x: number;
  y: number;
  description: string;
  artifactIds: string[];
};

export const locations: ExhibitLocation[] = [
  { id: "salona", name: "Salona", label: "Solin", x: 55, y: 42, description: "Metropola rimske Dalmacije i najvažnije arheološko nalazište u okolici Splita.", artifactIds: ["novac-dioklecijana", "kameni-natpis"] },
  { id: "trogir", name: "Tragurium", label: "Trogir", x: 38, y: 51, description: "Povijesni grad na otočiću, obilježen kontinuitetom života od antike do danas.", artifactIds: ["mramorna-muza"] },
  { id: "narona", name: "Narona", label: "Vid kod Metkovića", x: 82, y: 75, description: "Antičko trgovačko središte uz Neretvu, mjesto susreta obale i zaleđa.", artifactIds: ["jantarna-amfora"] },
];

export const exhibition = {
  title: "Tragovi kroz vrijeme",
  subtitle: "Priče predmeta s istočne obale Jadrana",
  description:
    "Digitalna mini-izložba o predmetima, ljudima i mjestima koji povezuju antičke luke, srednjovjekovne gradove i današnji pogled na baštinu.",
};
