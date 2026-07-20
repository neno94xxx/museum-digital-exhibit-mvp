# Tragovi kroz vrijeme — digitalna muzejska izložba

Funkcionalni MVP responzivne digitalne mini-izložbe namijenjen prezentaciji muzeju ili javnoj kulturnoj ustanovi. Sadržaj je demonstracijski i pohranjen lokalno; aplikacija nema bazu, prijavu ni vanjske AI servise.

## Što je uključeno

- premium responzivna naslovnica s jasnim ulazom u iskustvo
- virtualni 3D hodnik s podom, zidnim radovima i četiri klikabilna artefakta raspoređena lijevo i desno
- kretanje tipkama `WASD` / strelicama te promjena smjera gledanja povlačenjem mišem ili touchpadom
- granice kretanja uz sigurnosnu udaljenost od svakog predmeta i zidova
- zbirka od četiri artefakta s filtrom po razdoblju i detaljnim modalom
- interaktivna vremenska crta sa šest događaja
- stilizirana karta s tri lokacije i povezanim artefaktima
- lokalni digitalni vodič koji pretražuje demo sadržaj i navodi izvor

## Tehnologije

- Next.js App Router i TypeScript
- Tailwind CSS (učitan kroz PostCSS; vizualni sustav je definiran u globalnom CSS-u)
- React Three Fiber, Drei i Three.js
- Lucide ikone

## Pokretanje

Potrebni su Node.js 20+ i npm.

```bash
npm install
npm run dev
```

Otvorite [http://localhost:3000](http://localhost:3000).

Produkcijska provjera:

```bash
npm run lint
npm run build
npm start
```

## Struktura

```text
app/                 Next.js rute i globalni vizualni sustav
  artefakti/         zbirka, filteri i modal
  izlozba/           virtualna 3D soba
components/          zajedničke i interaktivne komponente
data/exhibit.ts      svi lokalni demo podaci
lib/search.ts        lokalno pretraživanje za digitalnog vodiča
```

## Napomene za demo

- Sva četiri predmeta u 3D sceni sada koriste vlastiti GLB model.
- Amfora, rimski novac, rimska stela i Terpsihora koriste lokalne modele; detalji izvora i licenci nalaze se u `THIRD_PARTY_ASSETS.md`.
- Digitalni vodič ne generira tekst i ne šalje podatke izvan aplikacije; rangira lokalne zapise prema riječima iz pitanja.
- Svi nazivi i opisi služe demonstraciji koncepta, a ne kao verificirani muzejski kataloški zapisi.

## TODO — sljedeća faza

- povezati pravi headless CMS za urednički sadržaj
- dodati Supabase za podatke, pohranu i administraciju
- zamijeniti lokalno pretraživanje pravim RAG chatbotom uz citirane muzejske izvore
- uvesti fotogrametrijske, optimizirane GLB modele i progresivno učitavanje
- mapirati eKultura metapodatke i relevantne interoperabilne standarde
- dodati višejezičnost, analitiku, pristupačne transkripte i uredničku provjeru sadržaja
