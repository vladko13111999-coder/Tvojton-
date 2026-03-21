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
