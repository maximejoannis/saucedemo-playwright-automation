# SauceDemo QA Automation

Suite Playwright refondue sur l'architecture du projet **French Companies Explorer** : TypeScript strict, Page Objects, fixtures personnalisées, traçabilité Allure, exécution multi-navigateurs et outillage qualité homogène.

## Couverture

Les **44 cas déterministes du référentiel** (`TC-001` à `TC-047`, hors `TC-029`, `TC-030` et `TC-031`) sont automatisés. La couverture fonctionnelle du périmètre automatisable audité passe ainsi de **22/44 (50 %) à 44/44 (100 %)**.

Les cas transverses `TC-048` à `TC-050` restent hors du dénominateur de l'audit d'origine : navigation clavier et zoom nécessitent une part manuelle, tandis que la performance requiert un budget et un environnement contrôlé.

## Installation et exécution

```bash
npm ci
npx playwright install --with-deps
npm test
```

Commandes utiles :

```bash
npm run test:smoke
npm run test:list
npm run quality
npm run report
```

La cible peut être remplacée avec `BASE_URL`. Le nombre de workers est configurable avec `PW_WORKERS`.

## Architecture

```text
fixtures/       fixtures Playwright et métadonnées Allure
pages/          Page Objects TypeScript
test-data/      utilisateurs, produits et données checkout
tests/e2e/      scénarios fonctionnels traçables par identifiant TC
docs/qa-audit/  audit fonctionnel d'origine
reporting/      scripts et portail qualité repris du projet modèle
```

## Portail QA GitHub Pages

Le workflow `.github/workflows/playwright.yml` reproduit la chaîne de publication du projet French Companies Explorer. À chaque push sur `main`, il génère puis rassemble :

- le rapport Playwright fonctionnel ;
- le rapport consolidé Allure ;
- le rapport de qualité TypeScript, ESLint et Prettier ;
- le rapport de couverture fonctionnelle à 100 % ;
- le portail QA, avec le même CSS et le même design que le projet modèle.

Le site assemblé est publié automatiquement dans l’environnement `github-pages`. GitHub Pages doit utiliser la source **GitHub Actions** dans les paramètres du dépôt.

## Traçabilité

Chaque test porte l'identifiant exact `TC-nnn`, la priorité `@p0`, `@p1` ou `@p2`, et une annotation de user story. Les cas `TC-029` à `TC-031` ne sont pas automatisés car leurs résultats attendus restent soumis à arbitrage produit, conformément à l'audit.
