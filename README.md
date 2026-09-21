# Thyroid Diagnosis DSS

Système d'aide à la décision clinique (Clinical Decision Support System) dédié au dépistage et à la classification des troubles thyroïdiens. L'application repose sur un raisonnement sémantique combinant une ontologie OWL 2, le raisonneur Pellet (SWRL) et une interface web moderne bilingue.

---

## Architecture globale

* **Frontend :** Next.js (App Router), TypeScript, Tailwind CSS
* **Backend :** FastAPI, Pydantic, Uvicorn
* **Ingénierie des connaissances :** Owlready2, Jena/Pellet, OWL 2 (`thyroid_model.owl`)
* **Stockage de données :** Persistance tabulaire sur fichier Excel (`dataset_thyroid.xlsx`) avec déduplication par identifiant patient

---

## Fonctionnalités principales

* **Interface bilingue & multi-thème :** Support complet Français / Anglais avec thèmes clair et sombre adaptés aux standards cliniques.
* **Formulaire médical modulaire :**
  * Données démographiques (identifiant, âge, sexe biologique).
  * Dosages hormonaux (TSH, T3 libre, TT4, T4U, FTI) avec support des valeurs non mesurées.
  * Facteurs de risque et historique clinique (grossesse, traitements Lithium/Iode 131, goitre, antécédents chirurgicaux).
* **Raisonnement hybride :** Évaluation des règles cliniques basée sur l'ontologie et le raisonneur sémantique Pellet.
* **Persistance automatisée :** Écriture et mise à jour dynamique (*upsert*) des profils patients dans `dataset_thyroid.xlsx` selon le schéma de données de l'ontologie.

---

## Prérequis

* **Python :** 3.10 ou version ultérieure
* **Node.js :** 18.x ou version ultérieure
* **Java :** JRE / JDK 8 ou version ultérieure (requis pour l'exécution du moteur Pellet via Owlready2)

---

## Installation et lancement

### 1. Backend (FastAPI)

1. Installe les dépendances Python :
   ```bash
   pip3 install -r requirements.txt
   ```

2. Vérifie la présence du fichier d'ontologie `thyroid_model.owl` à la racine du backend.

3. Démarre l'API :
   ```bash
   uvicorn server:app --reload --port 8000
   ```
   L'API sera accessible sur `http://127.0.0.1:8000` (documentation Swagger sur `/docs`).

---

### 2. Frontend (Next.js)

1. Ouvre un second terminal et place-toi dans le dossier du frontend :
   ```bash
   cd thyroid-frontend
   ```

2. Installe les dépendances Node.js :
   ```bash
   npm install
   ```

3. Lance le serveur de développement :
   ```bash
   npm run dev
   ```
   L'interface web sera accessible sur `http://localhost:3000`.

---

