# AvadaPay — infrastructure de phase 1

Cette phase cohabite avec Stripe et ne crée aucun paiement réel. Aucun fichier Stripe ni écran de paiement existant n’est modifié.

## Variables serveur prévues

```dotenv
AVADAPAY_API_URL=
AVADAPAY_PUBLIC_ID=
AVADAPAY_MERCHANT_ID=
AVADAPAY_SECRET_KEY=
```

Aucune de ces variables ne doit commencer par `NEXT_PUBLIC_`. Les valeurs réelles restent exclusivement dans `.env.local` et dans l’environnement serveur de production.

## Autorités

- Le navigateur pourra demander uniquement un plan et un opérateur reconnus.
- Le serveur récupérera l’utilisateur depuis la session Supabase.
- Le serveur déterminera le montant, la devise, le `provider_id`, l’identifiant de commande et les douze mois d’accès.
- Un callback authentifié et idempotent devra confirmer le statut réellement payé avant toute activation.
- Cette phase ne contient volontairement ni route de création AvadaPay ni callback, car le contrat d’API et la méthode de signature doivent encore être confirmés.

## Accès futur

Une activation confirmée devra réutiliser `profiles.plan`, `profiles.subscription_status` et `profiles.current_period_end`. L’accès sera valide uniquement avec un plan connu, le statut exact `active` et une date `current_period_end` strictement future. Le helper `hasCurrentPaidAccess` formalise ce contrat sans modifier les contrôles Stripe actuels.

## Idempotence future

Le callback devra réserver ou retrouver `payment_events(provider, event_id)`, synchroniser la commande dans une transaction serveur, puis renseigner `processed_at` seulement après réussite. Un événement dupliqué devra retourner un succès sans prolonger l’accès une seconde fois.
