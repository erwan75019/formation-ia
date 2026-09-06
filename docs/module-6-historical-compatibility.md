# Compatibilité historique du module 6

Le parcours canonique « Créer un site web de A à Z » contient désormais douze leçons, accessibles sous `/formation/site-web/01` à `/formation/site-web/12`.

- Les anciennes URL `/formation/python/**` sont redirigées définitivement vers leur équivalent `/formation/site-web/**` et conservent les paramètres de recherche.
- Les anciennes leçons numérotées 13 à 20, y compris leurs sous-routes `exercice` et `qcm`, sont redirigées définitivement vers `/formation/site-web/12`.
- Les anciens `lesson_id` restent intacts dans `lesson_progress` afin de préserver l’historique. Ils ne font plus partie du catalogue officiel, ne sont plus acceptés par la validation et ne comptent plus pour la progression ou les certificats.
- Aucune redirection historique n’écrit dans `lesson_progress`.

Les autorités utilisées pour rédiger progressivement les douze leçons sont :

- `reference-apps/propertymatch/` pour l’application finale exécutable ;
- `reference-apps/propertymatch/docs/final-application-map.md` pour la cartographie fonctionnelle ;
- `docs/design/propertymatch-design-spec.md` pour la direction visuelle.
