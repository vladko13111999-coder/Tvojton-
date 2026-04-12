<<<<<<< HEAD
# Tvojton.online - Brand Twin AI Frontend

## Rýchly Prehľad

**Projekt:** Brand Twin AI asistent pre tvojton.online
**Účel:** AI chat bot pre e-shopy a malé firmy
**Jazyky:** Slovenčina, Čeština, Chorvatčina, Angličtina

## Architektúra

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   API Backend   │────▶│     Ollama      │
│  (Vercel)       │     │  (Lightning.ai) │     │  (gemma3:12b)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Dôležité URL

| Služba | URL |
|--------|-----|
| **Frontend** | https://tvojton.online/agent |
| **API Backend** | https://7777-01km8p7wqj629zs2hpb8sc2bya.cloudspaces.litng.ai |
| **Backend repo** | https://github.com/vladko13111999-coder/agenticseek |

## Inštalácia

```bash
cd Tvojton-
npm install
npm run dev
```

## Build pre Vercel

```bash
npm run build
```

## Environment Variables

Pre Vercel sú nastavené:
- `VITE_API_URL` = https://7777-01km8p7wqj629zs2hpb8sc2bya.cloudspaces.litng.ai

Pre lokálny vývoj vytvor `.env.local`:
```bash
VITE_API_URL=http://localhost:7777
```

## Zmena API URL

1. Uprav `client/src/lib/agentApi.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'TVOJA_NOVA_URL';
```

2. Pushni na GitHub - Vercel automaticky predeployuje

## API Endpoints

### /health
```bash
curl https://7777-01km8p7wqj629zs2hpb8sc2bya.cloudspaces.litng.ai/health
```

### /query
```bash
curl -X POST https://7777-01km8p7wqj629zs2hpb8sc2bya.cloudspaces.litng.ai/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Ahoj!"}'
```

## Štruktúra

```
Tvojton-/
├── client/                 # Vite + React frontend
│   ├── src/
│   │   ├── lib/
│   │   │   └── agentApi.ts  # API klient
│   │   ├── components/
│   │   │   └── BrandTwinChat.tsx
│   │   └── pages/
│   │       └── Agent.tsx
│   └── .env.production     # Production env
├── server/                 # Server-side kód (ak treba)
└── vercel.json             # Vercel konfigurácia
```

## Stack

- **Framework:** Next.js/Vite
- **Jazyk:** TypeScript
- **Styling:** TailwindCSS
- **Hosting:** Vercel

## License

MIT
=======
# Tvojton-

Landing page a AI agent pre tvojton.online

## 🌐 Webstránky

| Prostredie | URL | Vetva |
|------------|-----|-------|
| Produkcia | https://tvojton.online | `main` |
| Preview (developer) | https://tvojton-git-developer-...vercel.app | `developer` |

## 📁 Štruktúra projektu

```
Tvojton-/
├── client/                 # React frontend (Vite + React)
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx      # Landing page
│       │   ├── Agent.tsx     # AI Chat stránka
│       │   ├── Blog.tsx      # Blog zoznam
│       │   └── Admin.tsx     # Admin panel
│       ├── lib/
│       │   └── agentApi.ts   # API helper pre AI agenta
│       └── App.tsx           # Router (wouter)
├── server/                 # Backend (Express + tRPC)
├── drizzle/                # Database migrations
└── vercel.json            # Vercel konfigurácia
```

## 🤖 AI Agent Integrácia

Agent beží na: `https://i5nrun-ci2ahz-7777.proxy.runpod.net`

### API Endpoints

| Endpoint | Metóda | Popis |
|----------|--------|-------|
| `/health` | GET | Zdravie API |
| `/query` | POST | Poslať správu |

### Použitie v kóde

```typescript
import { sendMessage } from "@/lib/agentApi";

const response = await sendMessage("Ahoj, ako sa máš?");
// response = { answer: "...", agent: "casual", language: "sk" }
```

### Environment Variables

```env
VITE_API_URL=https://i5nrun-ci2ahz-7777.proxy.runpod.net
```

## 🚀 Vývoj

```bash
# Inštalácia závislostí
pnpm install

# Vývojový server
pnpm dev

# Build pre produkciu
pnpm build
```

## 🌿 Git Workflow

| Vetva | Účel |
|-------|------|
| `main` | Produkcia - tvojton.online |
| `developer` | Preview - testovanie nových funkcií |

### Postup pre nové funkcie:
1. Vytvor branch z `developer`
2. Implementuj zmeny
3. Commit do `developer`
4. Otestuj na preview URL
5. Merge do `main` pre produkciu

## 🔧 Technológie

- **Frontend:** React 19, Vite, TailwindCSS, shadcn/ui
- **Backend:** Express, tRPC, Drizzle ORM
- **Database:** MySQL (PlanetScale)
- **Deploy:** Vercel
- **AI:** Ollama (gemma3:12b, qwen2.5:14b)

## 📋 Funkcie

- Landing page s kontaktným formulárom
- AI chat stránka (/agent) s Brand Twin asistentom
- Blog systém
- Admin panel
- Email notifikácie

## 👤 Brand Twin - AI Asistent

Brand Twin je AI asistent pre:
- E-shopy a malé firmy
- Komunikácia so zákazníkmi
- Písanie SEO blogov
- Generovanie obsahu
- Riešenie reklamácií

### Podporované jazyky
- Slovenčina (SK)
- Čeština (CZ)
- Chorvátčina (HR)
- Angličtina (EN)

### Osobnosť
- Priateľský, suchý humor
- Pri vážnych veciach profesionálny
- Odpovedá v jazyku používateľa

## 📝 Commity

| Commit | Popis |
|--------|-------|
| `a3525c7` | feat: Add full chat interface to Agent page |
| `dc1f808` | fix: Fix agent button links in Home.tsx |
| `cd26cf5` | feat: Add Tvojton AI Agent page |

---

**Posledná aktualizácia:** 2026-03-21 16:00 UTC
>>>>>>> developer
