# Sprint Review — Refonte de l’automatisation QA SauceDemo

## 1. Contexte

Le projet `saucedemo-qa-automation` disposait déjà d’une première base de
tests Playwright et d’un audit de couverture fonctionnelle. La refonte avait
deux objectifs principaux :

1. reprendre l’architecture et les standards du projet modèle
   **French Companies Explorer** ;
2. compléter les tests manquants afin d’atteindre une couverture fonctionnelle
   exhaustive du périmètre déterministe.

La V1 disposait déjà d’un portail GitHub Pages donnant accès aux rapports
Allure, qualité et couverture. Le travail a donc consisté à reprendre et
refondre ce dispositif, à l’aligner visuellement sur French Companies Explorer
et à l’adapter à la nouvelle suite TypeScript.

### Références

- **V1 — JavaScript :**
  [saucedemo-qa-automation](https://github.com/maximejoannis/saucedemo-qa-automation)
- **V2 — TypeScript :**
  [saucedemo-playwright-automation](https://github.com/maximejoannis/saucedemo-playwright-automation)

## 2. Objectifs du sprint

- migrer la suite vers une architecture Playwright TypeScript homogène ;
- appliquer le Page Object Model et des fixtures personnalisées ;
- séparer les données, les pages, les helpers et les scénarios ;
- reprendre le référentiel QA existant sans perdre la traçabilité ;
- automatiser les cas déterministes manquants ;
- exécuter la suite sur Chromium, Firefox et WebKit ;
- produire les rapports Playwright, Allure, qualité et couverture ;
- construire un portail QA centralisé ;
- publier le portail avec GitHub Actions et GitHub Pages ;
- obtenir une quality gate stable et compréhensible.

## 3. Résultats obtenus

| Indicateur               |                           V1 |                       V2 |
| ------------------------ | ---------------------------: | -----------------------: |
| Langage                  |            JavaScript ES2023 |    **TypeScript strict** |
| Version du projet        |                        1.0.0 |                **2.0.0** |
| Cas déterministes inclus |                           44 |                       44 |
| Cas automatisés          |                           22 |                       44 |
| Cas non automatisés      |                           22 |                        0 |
| Couverture fonctionnelle |                         50 % |                **100 %** |
| Couverture P0            |                       69,6 % |                **100 %** |
| Couverture P1            |                       31,6 % |                **100 %** |
| Couverture P2            |                          0 % |                **100 %** |
| Organisation             |       5 ensembles techniques | **14 US tracées par TC** |
| Exécutions par campagne  | Non consolidées dans l’audit |                  **132** |
| Portail GitHub Pages     |                      Présent | **Refondu et harmonisé** |
| Contrôle de typage       |                       Absent |       **`tsc --noEmit`** |

La campagne complète produit actuellement :

- **129 exécutions réussies** ;
- **3 échecs attendus**, correspondant à `TC-044` sur les trois navigateurs ;
- un pipeline GitHub Actions au vert ;
- un portail QA regroupant les différentes preuves d’exécution.

## 4. Fonctionnalités couvertes

La suite couvre les parcours suivants :

- authentification valide et invalide ;
- comportements des différents profils SauceDemo ;
- affichage et intégrité du catalogue ;
- tri des produits ;
- consultation des fiches produit ;
- ajout et retrait d’articles ;
- compteur et contenu du panier ;
- saisie et validation des informations client ;
- récapitulatif, sous-total, taxe et total ;
- finalisation et annulation de commande ;
- déconnexion et sécurité de session ;
- navigation dans le menu ;
- réinitialisation de l’état de l’application.

## 5. Problèmes rencontrés

### 5.1. Migration de JavaScript vers TypeScript

La V1 utilisait JavaScript ES2023, une configuration
`playwright.config.js`, des fichiers `.spec.js` et des composants regroupés
dans `src/`. Elle possédait déjà un Page Object Model, des fixtures et des
données réutilisables, mais sans contrôle statique TypeScript.

La migration ne pouvait pas se limiter à renommer les extensions. Il fallait
typer les fixtures, les Page Objects, les produits, les utilisateurs et les
données client tout en conservant le comportement des tests.

#### Décision prise

La V2 utilise TypeScript strict, `tsc --noEmit` dans la quality gate et des
imports typés entre les différentes couches. Les erreurs de contrat entre les
tests, les données et les objets de page peuvent ainsi être détectées avant
l’exécution.

### 5.2. Architecture initiale différente du projet modèle

Le projet SauceDemo ne suivait pas complètement l’organisation de French
Companies Explorer. Les responsabilités étaient moins nettement séparées et
certaines fonctions réutilisables se trouvaient directement dans les fichiers
de tests.

Cette situation compliquait :

- la lecture des scénarios ;
- la maintenance des parcours communs ;
- la réutilisation des actions métier ;
- l’application uniforme des conventions de qualité.

#### Décision prise

La suite a été réorganisée autour de :

- `pages/` pour les Page Objects ;
- `fixtures/` pour l’injection des objets métier ;
- `test-data/` pour les utilisateurs, produits et données de checkout ;
- `tests/e2e/` pour les scénarios ;
- `tests/helpers/` pour les parcours réutilisables ;
- `reporting/` pour les scripts et le portail QA.

Les helpers ont été séparés en deux fichiers :

```text
tests/helpers/cart.helpers.ts
tests/helpers/checkout.helpers.ts
```

Cette séparation évite un fichier générique `helpers.ts` qui deviendrait
progressivement difficile à maintenir.

### 5.3. Deux systèmes de traçabilité dans la V1

La V1 faisait coexister les regroupements techniques `US01` à `US05`, les
quatorze User Stories fonctionnelles `US-001` à `US-014`, les identifiants
historiques `TC-USxx-ACxx-xx` et les cas d’audit `TC-001` à `TC-050`.

La documentation d’audit avait été reconstruite après la première
automatisation. Une correspondance fondée uniquement sur les noms de dossiers
aurait donc produit une traçabilité incorrecte.

#### Décision prise

La V2 utilise directement les identifiants `TC-nnn` dans les titres des tests
et associe chaque bloc à sa User Story d’audit. La preuve est lisible sans table
de conversion entre deux nomenclatures techniques.

### 5.4. Audit et numérotation non continus

Le référentiel contient des identifiants allant jusqu’à `TC-050`, mais tous
les identifiants ne font pas partie du périmètre déterministe automatisable.
Une lecture superficielle pouvait donc conduire à annoncer 50 cas attendus ou
à considérer certains cas comme manquants.

Les exclusions sont les suivantes :

- `TC-029` à `TC-031` : résultats attendus soumis à arbitrage produit ;
- `TC-048` et `TC-049` : contrôles comportant une part manuelle ;
- `TC-050` : performance sans budget ni environnement contrôlé définis.

#### Décision prise

Le dénominateur de couverture a été conservé à **44 cas déterministes**, comme
dans l’audit. La traçabilité explicite les exclusions afin d’éviter de confondre
un cas hors périmètre avec un défaut de couverture.

### 5.5. Couverture annoncée et couverture réellement démontrée

La V1 automatisait 22 cas sur les 44 cas déterministes. Certains
parcours principaux étaient testés, mais plusieurs contrôles précis restaient
sans preuve automatisée : intégrité des cartes produit, tri, détails du panier,
taxe, retours, sécurité de session, reset et menu.

#### Décision prise

Chaque cas manquant a été relié à :

- une User Story ;
- une priorité ;
- un scénario Playwright ;
- des assertions substantielles ;
- une preuve dans les rapports.

La couverture est ainsi passée de **50 % à 100 %** sans modifier artificiellement
le référentiel.

### 5.6. Différence entre cas de test et exécutions

La suite contient 44 cas techniques, mais une campagne complète affiche 132
résultats, car chaque cas est exécuté sur trois navigateurs.

Cette différence pouvait être interprétée comme un doublonnage ou comme une
incohérence du rapport.

#### Décision prise

Les indicateurs sont désormais distingués :

- **44 cas de test** ;
- **132 exécutions multi-navigateurs** ;
- **100 % de couverture fonctionnelle** ;
- **129 réussites et 3 échecs attendus**.

Ces métriques répondent à des questions différentes et ne doivent pas être
comparées comme si elles représentaient la même mesure.

### 5.7. Défaut fonctionnel détecté par TC-044

Le scénario `TC-044 — Reset App State` a échoué sur Chromium, Firefox et
WebKit. L’action vide bien le panier, mais les boutons **Add to cart** ne sont
pas restaurés immédiatement dans le DOM sans rechargement de la page.

Trois échecs identiques ne signifiaient donc pas que trois tests différents
étaient mal conçus. Ils constituaient la reproduction multi-navigateurs du même
défaut applicatif.

#### Première difficulté

Une simple annotation `defect` dans Allure documente l’anomalie, mais ne
change pas le statut Playwright. Le pipeline restait donc en échec.

#### Décision prise

Le test conserve les assertions qui décrivent le comportement attendu et
utilise `test.fail()` pour déclarer l’anomalie connue. Le résultat devient un
échec attendu :

- le défaut reste visible ;
- les assertions ne sont pas affaiblies ;
- un succès inattendu signalera que le comportement a changé ;
- la quality gate n’est pas bloquée par une anomalie déjà identifiée.

### 5.8. Portail QA non repris immédiatement pendant la refonte

La V1 possédait déjà un portail GitHub Pages. Toutefois, la première adaptation
de la V2 s’est concentrée sur l’architecture TypeScript et les tests, sans
reprendre immédiatement cette capacité existante.

#### Impact

Les tests de la V2 pouvaient être exécutés, mais le nouveau dépôt aurait
représenté une régression documentaire et opérationnelle par rapport à la V1.

#### Décision prise

Le portail de la V1 a servi de base fonctionnelle et celui de French Companies
Explorer de base visuelle. Le périmètre a été complété avec :

- un portail QA dédié à SauceDemo ;
- le même CSS et les mêmes principes visuels que le modèle ;
- un contenu fonctionnel spécifique à SauceDemo ;
- des liens vers Playwright, Allure, qualité et couverture ;
- une publication automatique sur GitHub Pages.

### 5.9. Adaptation de la chaîne de reporting

La V1 générait déjà Allure, un rapport qualité ESLint/Prettier et une couverture
fonctionnelle statique. La V2 ajoutait cependant de nouvelles contraintes :

- le contrôle du typage TypeScript ;
- de nouveaux chemins de rapports sous `reporting/` ;
- un rapport Playwright fonctionnel dédié ;
- une couverture portée à 100 % ;
- un portail conforme au design French Companies Explorer.

#### Décision prise

La chaîne a été reconstruite autour des scripts
`generate-quality-report.mjs` et `generate-coverage-report.mjs`. Le workflow
rassemble désormais toutes les sorties dans un même site GitHub Pages.

### 5.10. Pipeline GitHub Actions initialement au rouge

Lors de la première exécution sur GitHub, le job de génération et de validation
des rapports a échoué. Le déploiement du portail a été ignoré, puis la quality
gate finale a correctement placé le pipeline au rouge.

Plusieurs causes possibles devaient être distinguées :

- échec réel des tests ;
- anomalie connue non déclarée comme attendue ;
- rapport manquant ou mal généré ;
- configuration GitHub Pages ;
- différence entre l’environnement local et le runner Linux.

#### Décision prise

Le diagnostic a été effectué étape par étape :

1. contrôler les résultats Playwright ;
2. vérifier le traitement de `TC-044` ;
3. confirmer la génération de chaque rapport ;
4. valider les chemins utilisés par le portail ;
5. configurer GitHub Pages avec la source **GitHub Actions** ;
6. relancer le workflow complet.

Le pipeline est désormais vert et le portail est publiable automatiquement.

### 5.11. Mise en ligne manuelle du dépôt

Les fichiers ont été ajoutés manuellement dans le nouveau dépôt GitHub. Cette
méthode est possible, mais elle augmente le risque de :

- créer un fichier au mauvais emplacement ;
- oublier un fichier caché ou un dossier ;
- déposer une ancienne version d’un test ;
- modifier involontairement le formatage ;
- déclencher de nombreux commits partiels.

#### Décision prise

Une arborescence précise a été fournie et chaque emplacement sensible a été
contrôlé, notamment :

- `.github/workflows/playwright.yml` ;
- `tests/helpers/` ;
- `reporting/qa-portal/` ;
- les scripts de génération ;
- les documents d’audit.

Pour les prochaines itérations, un clone Git local ou un Codespace avec un
commit unique sera préférable.

### 5.12. Documentation du projet

Un README court ne suffisait pas à présenter une démarche QA de portfolio. Il
manquait notamment les indicateurs, les liens vers les rapports, l’explication
de `TC-044`, l’architecture et la distinction entre couverture et exécutions.

#### Décision prise

Le README a été aligné sur celui de French Companies Explorer tout en restant
fidèle aux capacités réelles du projet SauceDemo. Les sections non implémentées,
comme les tests API ou la régression visuelle, ne sont pas revendiquées.

## 6. Ce qui a bien fonctionné

- le projet modèle a fourni une architecture et une identité visuelle solides ;
- l’audit initial a permis de mesurer précisément le travail restant ;
- le Page Object Model a limité la duplication des interactions ;
- les fixtures ont simplifié la préparation des scénarios authentifiés ;
- les données centralisées ont rendu les tests plus lisibles ;
- l’exécution multi-navigateurs a confirmé la reproductibilité de `TC-044` ;
- Allure a amélioré la lecture fonctionnelle des résultats ;
- la quality gate a empêché la publication d’un portail incomplet ;
- GitHub Pages offre un point d’accès unique aux preuves QA.

## 7. Ce qui pourrait être amélioré

- intégrer le portail QA dès la définition initiale du périmètre ;
- préparer le dépôt Git avant l’ajout manuel des fichiers ;
- exécuter localement les mêmes commandes que la CI avant le premier push ;
- définir plus tôt la politique de gestion des défauts connus ;
- automatiser la mise à jour des badges et indicateurs du README ;
- ajouter une checklist de validation des chemins de rapports ;
- conserver un registre formel des anomalies avec statut et date de revue.

## 8. Leçons à retenir

### 8.1. La couverture doit partir d’un référentiel explicite

Un pourcentage n’a de valeur que si son dénominateur est connu. Les exclusions,
les arbitrages produit et les contrôles manuels doivent être documentés.

### 8.2. Un test en échec n’est pas nécessairement un mauvais test

Un test peut révéler un défaut réel. Avant de modifier l’assertion, il faut
comparer le résultat observé au comportement attendu et vérifier sa
reproductibilité.

### 8.3. Un défaut connu ne doit être ni masqué ni bloquant indéfiniment

`test.fail()` est utile lorsqu’un défaut est confirmé : il conserve
l’information, empêche de banaliser l’écart et évite de rendre la CI
inexploitable. Cette déclaration doit toutefois rester temporaire et suivie.

### 8.4. Le multi-navigateur multiplie les exécutions, pas la couverture

Exécuter un même cas sur trois moteurs renforce la compatibilité, mais ne crée
pas trois cas fonctionnels supplémentaires.

### 8.5. Le reporting fait partie du produit QA

Une suite sans restitution claire reste difficile à évaluer. Le portail, la
traçabilité et les rapports doivent être planifiés comme des livrables, pas
comme une finition optionnelle.

### 8.6. La CI doit reproduire les contrôles locaux

Les commandes de qualité, de test et de génération de rapports doivent être
exécutables localement. Cela réduit les écarts entre le poste du développeur et
GitHub Actions.

### 8.7. Les helpers doivent exprimer un parcours métier

Un helper est pertinent lorsqu’il simplifie une intention répétée, comme
ajouter plusieurs produits ou atteindre le récapitulatif de commande. Il ne
doit pas devenir un dossier fourre-tout.

### 8.8. La qualité d’un portfolio dépend aussi de sa documentation

Le README, la Sprint Review, l’audit et les rapports montrent la démarche de
raisonnement, pas uniquement le volume de code produit.

### 8.9. Une refonte doit préserver les acquis de la version précédente

La V1 contenait déjà des éléments solides : Page Object Model, fixtures,
rapports Allure, contrôles ESLint/Prettier, audit de couverture, GitHub Actions
et portail GitHub Pages. Une refonte réussie ne consiste pas à repartir de zéro,
mais à identifier ces acquis, les conserver et améliorer leurs limites.

La V2 apporte principalement le typage strict, une traçabilité directe par
`TC-nnn`, les 22 cas manquants, une couverture complète et une restitution
harmonisée avec le projet modèle.

## 9. Actions de suivi

| Action                                                | Priorité | Résultat attendu                                |
| ----------------------------------------------------- | -------- | ----------------------------------------------- |
| Revoir périodiquement `TC-044`                        | P0       | Détecter une correction de SauceDemo            |
| Arbitrer `TC-029` à `TC-031`                          | P1       | Rendre les oracles fonctionnels testables       |
| Formaliser les contrôles manuels `TC-048` et `TC-049` | P1       | Conserver une preuve d’accessibilité et de zoom |
| Définir un budget pour `TC-050`                       | P2       | Rendre le contrôle de performance mesurable     |
| Automatiser les indicateurs du README                 | P2       | Éviter les valeurs obsolètes                    |
| Ajouter un historique des campagnes                   | P2       | Visualiser les tendances de stabilité           |

## 10. Conclusion

La refonte a transformé une suite partielle en un projet QA complet,
maintenable et publiable. Le résultat ne se limite pas à une couverture de
100 % : il comprend une architecture cohérente, une traçabilité exploitable,
une anomalie documentée, une exécution multi-navigateurs, une quality gate et
un portail de preuves.

Le principal enseignement du sprint est qu’une automatisation réussie ne
consiste pas seulement à faire passer des tests. Elle doit également expliquer
ce qui est couvert, rendre visibles les défauts réels, distinguer les
indicateurs et produire des résultats compréhensibles par les parties
prenantes.

## Auteur

**Maxime Joannis — QA technico-fonctionnel et automaticien Playwright**
