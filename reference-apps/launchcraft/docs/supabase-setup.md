# Raccorder LaunchCraft à son projet Supabase

LaunchCraft doit utiliser un projet Supabase distinct de celui d’AI Academy. N’utilisez jamais les URL, clés ou tables de la plateforme de formation.

## 1. Créer le projet

1. Ouvrez [Supabase](https://supabase.com/dashboard) dans votre navigateur.
2. Cliquez sur **New project**.
3. Donnez un nom explicite comme `launchcraft-dev`, créez un mot de passe de base solide et choisissez une région proche.
4. Attendez que le projet soit prêt. Ne copiez aucune valeur provenant du projet AI Academy.

## 2. Récupérer les deux valeurs publiques

Dans **Project Settings → API** (ou **Connect**, selon l’interface), copiez l’URL du projet et la **Publishable key** publique.

LaunchCraft n’utilise aucune `service_role` key. La protection réelle repose sur l’authentification et la RLS.

## 3. Créer `.env.local`

Dans `reference-apps/launchcraft`, copiez `.env.example` vers `.env.local`, puis remplacez les exemples :

```dotenv
NEXT_PUBLIC_LAUNCHCRAFT_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_LAUNCHCRAFT_SUPABASE_PUBLISHABLE_KEY=votre-publishable-key
```

`.env.local` est ignoré par Git. Ne placez jamais ces valeurs dans le projet principal ni dans une capture pédagogique.

## 4. Exécuter la migration manuellement

1. Ouvrez **SQL Editor** dans le nouveau projet LaunchCraft.
2. Ouvrez localement `supabase/migrations/202608220001_initial_launchcraft.sql`.
3. Copiez tout le SQL dans un nouvel éditeur Supabase.
4. Vérifiez une dernière fois que le projet sélectionné est LaunchCraft, puis cliquez sur **Run**.

La migration crée uniquement `profiles`, `projects`, `objectives` et `tasks`, leurs contraintes, index, triggers et politiques RLS. Elle ne crée aucune donnée.

## 5. Configurer les URL d’authentification

Dans **Authentication → URL Configuration** :

- **Site URL** : `http://localhost:3200`
- **Redirect URLs** : ajoutez `http://localhost:3200/auth/callback`

Si la confirmation par email est active, l’utilisateur reviendra par cette route après avoir cliqué sur le lien reçu.

## 6. Redémarrer LaunchCraft

Après toute modification de `.env.local`, arrêtez le serveur avec `Ctrl + C`, puis relancez `npm run dev`. Ouvrez ensuite `http://localhost:3200/inscription`.

## 7. Tester le parcours complet

1. Créez un premier compte avec une adresse de test contrôlée.
2. Confirmez l’email si nécessaire.
3. Connectez-vous et créez un projet, un objectif et une tâche.
4. Vérifiez le dashboard, le calendrier, le profil et la déconnexion.
5. Ouvrez une fenêtre privée et créez un second compte.

## 8. Vérifier l’isolation entre deux comptes

Avec le second compte, le dashboard doit être vide et aucune donnée du premier compte ne doit apparaître. Ouvrir directement le slug du premier projet doit afficher « Projet introuvable ». Les mutations visant un identifiant appartenant au premier compte doivent modifier zéro ligne grâce aux filtres serveur et à la RLS.

Dans le Table Editor, vous pouvez constater que les lignes possèdent des `user_id` différents. Ne désactivez jamais la RLS pour simplifier un test.

## Contrôles locaux

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Les tests locaux vérifient la validation, l’absence de `user_id` provenant des formulaires, les politiques RLS attendues et les calculs métier. Les tests de session réelle, d’envoi d’email et d’isolation effective nécessitent le futur projet Supabase configuré.
