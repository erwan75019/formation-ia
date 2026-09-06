# LaunchCraft — application de référence

LaunchCraft est une application de gestion de lancement construite comme référence indépendante pour le module 7 d’AI Academy. Elle utilise son propre projet Supabase pour les comptes et les données métier.

## Technologies

- Next.js 16 et App Router
- React 19
- TypeScript strict
- Tailwind CSS 4 et CSS global
- Supabase Auth, Postgres et Row Level Security
- `node:test` pour les calculs métier

## Installation et lancement

```bash
npm install
npm run dev
```

Copier `.env.example` vers `.env.local`, renseigner le projet Supabase LaunchCraft séparé, puis ouvrir <http://localhost:3200>. Le guide complet se trouve dans `docs/supabase-setup.md`.

## Vérifications

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Données et sécurité

Les écritures utilisent des Server Actions qui récupèrent toujours `user.id` depuis la session. Les quatre tables activent la RLS. LaunchCraft n’utilise aucune service-role key, aucune table AI Academy, aucune IA, aucun paiement et aucune API externe.
