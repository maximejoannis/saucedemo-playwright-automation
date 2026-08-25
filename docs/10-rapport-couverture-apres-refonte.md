# Rapport de couverture après refonte

## Résultat

| Indicateur               |  Avant |       Après |
| ------------------------ | -----: | ----------: |
| Cas déterministes inclus |     44 |          44 |
| Cas automatisés          |     22 |          44 |
| Cas non automatisés      |     22 |           0 |
| Couverture               | 50,0 % | **100,0 %** |

Tous les écarts identifiés dans `qa-audit/08-rapport-final-couverture-automatisation.md` disposent désormais d'un test avec assertions substantielles : images et cartes catalogue, intégrité après tri, fiches produit, panier détaillé, récapitulatif et taxe, annulations, sécurité de session, reset et menu.

## Hors périmètre

- `TC-029` à `TC-031` : oracle fonctionnel non arbitré.
- `TC-048` et `TC-049` : contrôles comportant une part manuelle.
- `TC-050` : budget de performance et environnement contrôlé non définis.

Ces exclusions reprennent strictement la règle de calcul de l'audit initial et ne masquent aucun cas déterministe manquant.

## Anomalie confirmée à l’exécution

`TC-044` met en évidence un défaut reproductible sur Chromium, Firefox et WebKit : l’action **Reset App State** vide le panier, mais les boutons **Add to cart** ne sont pas restaurés immédiatement dans le DOM sans rechargement. Le test reste volontairement en échec afin de ne pas masquer cet écart au résultat attendu du référentiel.
