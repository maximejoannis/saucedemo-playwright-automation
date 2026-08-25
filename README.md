# SauceDemo — Playwright QA Automation

[![QA CI and Reports](https://github.com/maximejoannis/saucedemo-playwright-automation/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/maximejoannis/saucedemo-playwright-automation/actions/workflows/playwright.yml)
[![QA Portal](https://img.shields.io/badge/QA_Portal-online-22c55e?logo=githubpages&logoColor=white)](https://maximejoannis.github.io/saucedemo-playwright-automation/)
[![Tests](https://img.shields.io/badge/tests-129_passed_%7C_3_expected_failures-22c55e?logo=playwright&logoColor=white)](https://maximejoannis.github.io/saucedemo-playwright-automation/allure/)
[![Functional Coverage](https://img.shields.io/badge/functional_coverage-100%25-22c55e)](https://maximejoannis.github.io/saucedemo-playwright-automation/coverage/)
[![P0 Coverage](https://img.shields.io/badge/P0_coverage-100%25-22c55e)](https://maximejoannis.github.io/saucedemo-playwright-automation/coverage/)

[![Playwright](https://img.shields.io/badge/Playwright-1.62-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Allure](https://img.shields.io/badge/Allure_Report-enabled-f97316)](https://maximejoannis.github.io/saucedemo-playwright-automation/allure/)
[![ESLint](https://img.shields.io/badge/ESLint-passing-4B32C3?logo=eslint&logoColor=white)](https://maximejoannis.github.io/saucedemo-playwright-automation/quality/)
[![Prettier](https://img.shields.io/badge/Prettier-passing-F7B93E?logo=prettier&logoColor=black)](https://maximejoannis.github.io/saucedemo-playwright-automation/quality/)
[![Browsers](https://img.shields.io/badge/browsers-Chromium%20%7C%20Firefox%20%7C%20WebKit-2563eb)](https://maximejoannis.github.io/saucedemo-playwright-automation/functional/)
[![Traceability](https://img.shields.io/badge/traceability-ISTQB-7c3aed)](./docs/qa-audit/07-matrice-tracabilite.md)

Projet d’automatisation des tests de l’application
[SauceDemo](https://www.saucedemo.com/), réalisé avec Playwright et TypeScript.

L’objectif est de démontrer une démarche QA complète : analyse fonctionnelle,
stratégie de test, automatisation E2E multi-navigateurs, traçabilité ISTQB,
mesure de la couverture fonctionnelle, gestion explicite des anomalies et
publication continue des preuves d’exécution.

## Sommaire

- [Portail QA](#portail-qa)
- [Périmètre automatisé](#périmètre-automatisé)
- [Architecture](#architecture)
- [Principes appliqués](#principes-appliqués)
- [Traçabilité ISTQB](#traçabilité-istqb)
- [Installation locale](#installation-locale)
- [Exécution des tests](#exécution-des-tests)
- [Vérifications de qualité](#vérifications-de-qualité)
- [Couverture fonctionnelle](#couverture-fonctionnelle)
- [Rapports Allure](#rapports-allure)
- [Intégration continue](#intégration-continue)
- [Anomalie mise en évidence](#anomalie-mise-en-évidence)
- [Améliorations prévues](#améliorations-prévues)
- [Auteur](#auteur)

## Portail QA

Le portail centralise les preuves d’exécution et les indicateurs qualité :

### [Ouvrir le portail QA](https://maximejoannis.github.io/saucedemo-playwright-automation/)

Il donne accès aux rapports suivants :

- rapport consolidé Allure ;
- rapport Playwright fonctionnel ;
- rapport de qualité ESLint, Prettier et TypeScript ;
- rapport de couverture fonctionnelle automatisée `US → CA → TC` ;
- documentation de l’audit QA.

## Périmètre automatisé

| Domaine          | Objectif                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| Authentification | Vérifier les connexions valides, invalides et les profils spécifiques           |
| Catalogue        | Contrôler les produits, les images, les prix, les tris et les fiches détaillées |
| Panier           | Valider l’ajout, le retrait, le compteur et la conservation des articles        |
| Checkout         | Vérifier les données client, le récapitulatif, les taxes et la finalisation     |
| Session et menu  | Contrôler la déconnexion, la sécurité des routes, le reset et la navigation     |
| Qualité du code  | Vérifier le formatage, le lint et le typage TypeScript                          |

État actuel de la suite :

- **44 cas de test techniques**, identifiés de `TC-001` à `TC-047`, avec exclusions documentées ;
- **132 exécutions automatisées** lors d’une campagne complète ;
- **3 moteurs de navigateur** : Chromium, Firefox et WebKit ;
- **129 exécutions réussies** ;
- **3 échecs attendus** associés au défaut connu `TC-044` ;
- **44 cas déterministes couverts sur 44**, soit **100 %** ;
- **100 % des cas P0, P1 et P2 couverts**.

Le nombre de cas techniques, le nombre d’exécutions multi-navigateurs, le taux
de réussite et la couverture fonctionnelle sont des indicateurs distincts.

## Architecture

```text
.
├── .github/workflows/playwright.yml
├── docs/
│   ├── qa-audit/
│   │   ├── 01-cartographie-fonctionnelle.md
│   │   ├── 02-user-stories-criteres-acceptation.md
│   │   ├── 03-scenarios-gherkin.md
│   │   ├── 04-strategie-de-test.md
│   │   ├── 05-plan-de-test.md
│   │   ├── 06-cas-de-test.md
│   │   ├── 07-matrice-tracabilite.md
│   │   └── 08-rapport-final-couverture-automatisation.md
│   ├── 10-rapport-couverture-apres-refonte.md
│   ├── business-rules.md
│   ├── functional-map.md
│   ├── glossary.md
│   └── user-stories.md
├── fixtures/test.fixture.ts
├── pages/
│   ├── cart.page.ts
│   ├── checkout.page.ts
│   ├── inventory.page.ts
│   └── login.page.ts
├── reporting/
│   ├── coverage/
│   ├── qa-portal/
│   └── scripts/
├── test-data/
│   ├── checkout.ts
│   ├── products.ts
│   └── users.ts
├── tests/
│   ├── e2e/
│   │   ├── authentication.spec.ts
│   │   ├── cart.spec.ts
│   │   ├── catalogue.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── session-menu.spec.ts
│   └── helpers/
│       ├── cart.helpers.ts
│       └── checkout.helpers.ts
├── eslint.config.mjs
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Principes appliqués

- Page Object Model pour centraliser les interactions avec l’interface ;
- fixtures Playwright personnalisées pour injecter les pages métier ;
- données de test séparées du code des scénarios ;
- helpers spécialisés pour les parcours panier et checkout ;
- locators stables fondés sur les attributs de l’application ;
- assertions auto-réessayées avec `expect` ;
- isolation des scénarios et remise à zéro de l’état ;
- exécution multi-navigateurs avec Chromium, Firefox et WebKit ;
- traces, captures et vidéos collectées selon la stratégie Playwright ;
- métadonnées Allure associées aux User Stories et aux priorités ;
- génération automatique des rapports dans la CI ;
- quality gate finale après la production des preuves d’exécution.

## Traçabilité ISTQB

Chaque test utilise un identifiant `TC-XXX` issu du référentiel QA :

```text
User Story → Critère d’acceptation → Cas de test → Test automatisé → Rapport
```

Les métadonnées Playwright et Allure associent chaque exécution à sa User Story,
son cas de test, sa priorité, sa fonctionnalité, son navigateur et son
éventuelle anomalie.

Documents du projet :

- [Cartographie fonctionnelle](./docs/qa-audit/01-cartographie-fonctionnelle.md)
- [User Stories et critères d’acceptation](./docs/qa-audit/02-user-stories-criteres-acceptation.md)
- [Scénarios Gherkin](./docs/qa-audit/03-scenarios-gherkin.md)
- [Stratégie de test](./docs/qa-audit/04-strategie-de-test.md)
- [Plan de test](./docs/qa-audit/05-plan-de-test.md)
- [Cas de test](./docs/qa-audit/06-cas-de-test.md)
- [Matrice de traçabilité](./docs/qa-audit/07-matrice-tracabilite.md)
- [Audit initial de couverture](./docs/qa-audit/08-rapport-final-couverture-automatisation.md)
- [Rapport de couverture après refonte](./docs/10-rapport-couverture-apres-refonte.md)
- [Règles métier](./docs/business-rules.md)
- [Carte fonctionnelle](./docs/functional-map.md)
- [Glossaire](./docs/glossary.md)
- [User Stories synthétiques](./docs/user-stories.md)

## Installation locale

### Prérequis

- Node.js 24 ;
- npm ;
- Git.

```bash
git clone https://github.com/maximejoannis/saucedemo-playwright-automation.git
cd saucedemo-playwright-automation
npm ci
npx playwright install --with-deps
```

## Exécution des tests

Suite complète :

```bash
npm test
```

Commandes ciblées :

```bash
npm run test:e2e
npm run test:smoke
npm run test:headed
npm run test:ui
npm run test:list
```

Exécution avec deux workers :

```powershell
$env:PW_WORKERS = "2"
npm test
```

```bash
PW_WORKERS=2 npm test
```

Utilisation d’une URL cible différente :

```bash
BASE_URL=https://www.saucedemo.com npm test
```

## Vérifications de qualité

Vérifications indépendantes :

```bash
npm run format:check
npm run lint
npm run typecheck
```

Quality gate et rapport local :

```bash
npm run quality
npm run quality:report
```

Le rapport généré est disponible dans `quality-report/index.html`.

[Consulter le rapport publié](https://maximejoannis.github.io/saucedemo-playwright-automation/quality/)

## Couverture fonctionnelle

La couverture est calculée selon la chaîne :

```text
User Story → Critère d’acceptation → Cas de test → Preuve automatisée
```

| Indicateur                     |          Résultat |
| ------------------------------ | ----------------: |
| User Stories couvertes         |         **14/14** |
| Cas déterministes de référence |            **44** |
| Cas couverts                   |            **44** |
| Cas non couverts               |             **0** |
| Couverture globale             |         **100 %** |
| Couverture P0                  | **23/23 — 100 %** |
| Couverture P1                  | **19/19 — 100 %** |
| Couverture P2                  |   **2/2 — 100 %** |
| Tests techniques               |            **44** |
| Exécutions multi-navigateurs   |           **132** |

Génération locale :

```bash
npm run coverage:report
```

Le rapport est disponible dans `coverage-report/index.html`.

Le taux de couverture fonctionnelle est distinct du taux de réussite, du
nombre d’exécutions multi-navigateurs et de la couverture du code source.

Les cas `TC-029` à `TC-031` sont exclus du référentiel déterministe car leur
oracle fonctionnel n’a pas été arbitré. `TC-048` et `TC-049` comportent une
part manuelle ; `TC-050` nécessite un budget de performance et un
environnement contrôlé.

[Consulter le rapport publié](https://maximejoannis.github.io/saucedemo-playwright-automation/coverage/)

## Rapports Allure

```bash
npm run allure:generate
npm run allure:open
```

Commandes disponibles :

```bash
npm run allure:clean
npm run allure:generate
npm run allure:open
npm run allure:serve
```

Allure présente les fonctionnalités, navigateurs, priorités, User Stories,
statuts et traces vers les cas `TC-XXX`.

[Consulter le rapport Allure publié](https://maximejoannis.github.io/saucedemo-playwright-automation/allure/)

## Intégration continue

Le workflow GitHub Actions est déclenché sur :

- chaque push sur `main` ;
- chaque pull request vers `main` ;
- un lancement manuel avec `workflow_dispatch`.

Le pipeline :

1. récupère le dépôt et installe les dépendances ;
2. vérifie TypeScript, ESLint et Prettier ;
3. génère les rapports qualité et couverture ;
4. installe les navigateurs Playwright ;
5. exécute les tests sur Chromium, Firefox et WebKit ;
6. génère les rapports Playwright et Allure ;
7. valide la présence et la cohérence des rapports ;
8. assemble et publie le portail QA sur GitHub Pages ;
9. applique la quality gate finale.

Les rapports restent également disponibles comme artefacts GitHub Actions.

## Anomalie mise en évidence

`TC-044` confirme un défaut reproductible sur les trois navigateurs :

- **Reset App State** vide correctement le panier ;
- les boutons **Add to cart** ne sont pas restaurés immédiatement dans le DOM ;
- un rechargement est nécessaire pour retrouver leur état attendu.

Le test conserve ses assertions et utilise `test.fail()`. Les trois
exécutions sont donc répertoriées comme échecs attendus sans rendre le pipeline
instable.

## Améliorations prévues

- arbitrer les résultats attendus de `TC-029` à `TC-031` ;
- compléter les validations manuelles d’accessibilité et de zoom ;
- définir un budget et un environnement de performance ;
- automatiser la mise à jour des indicateurs du README ;
- suivre l’évolution historique des campagnes ;
- réévaluer `TC-044` après une éventuelle correction de SauceDemo.

## Auteur

**Maxime Joannis — QA technico-fonctionnel et automaticien Playwright**

Projet personnel réalisé dans une démarche de portfolio, d’apprentissage
continu et d’application des bonnes pratiques de test logiciel.
