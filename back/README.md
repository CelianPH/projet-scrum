# API de Gestion de Stock - Backend FastAPI

Backend pour l'application de gestion de stock de magasin de vêtements.

## Technologies utilisées

- **FastAPI** - Framework web moderne et rapide
- **SQLAlchemy** - ORM pour la gestion de la base de données
- **SQLite** - Base de données légère
- **JWT** - Authentification par tokens
- **Pydantic** - Validation des données
- **Uvicorn** - Serveur ASGI

## Fonctionnalités

- Authentification JWT avec deux rôles (admin et gestionnaire)
- Gestion des catégories de produits
- Gestion des produits (CRUD complet)
- Gestion des mouvements de stock (entrées, sorties, ajustements)
- Alertes de stock faible
- Documentation API automatique (Swagger)

## Structure du projet

```
back/
├── app/
│   ├── core/
│   │   ├── config.py          # Configuration de l'application
│   │   ├── database.py        # Configuration de la base de données
│   │   └── security.py        # Fonctions de sécurité et JWT
│   ├── models/
│   │   ├── user.py            # Modèle utilisateur
│   │   ├── category.py        # Modèle catégorie
│   │   ├── product.py         # Modèle produit
│   │   └── stock_movement.py  # Modèle mouvement de stock
│   ├── schemas/
│   │   ├── user.py            # Schémas Pydantic pour utilisateurs
│   │   ├── category.py        # Schémas Pydantic pour catégories
│   │   ├── product.py         # Schémas Pydantic pour produits
│   │   └── stock_movement.py  # Schémas Pydantic pour mouvements
│   └── routers/
│       ├── auth.py            # Routes d'authentification
│       ├── categories.py      # Routes des catégories
│       ├── products.py        # Routes des produits
│       └── stock_movements.py # Routes des mouvements de stock
├── main.py                    # Point d'entrée de l'application
├── seed_data.py               # Script de génération de données de test
├── requirements.txt           # Dépendances Python
└── .env.example              # Exemple de fichier d'environnement
```

## Installation

### Prérequis

- Python 3.8 ou supérieur
- pip

### Étapes d'installation

1. Créer un environnement virtuel :
```bash
cd back
python -m venv venv
```

2. Activer l'environnement virtuel :
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Installer les dépendances :
```bash
pip install -r requirements.txt
```

4. Créer le fichier `.env` :
```bash
cp .env.example .env
```

5. (Optionnel) Modifier les variables d'environnement dans `.env` selon vos besoins

## Démarrage

### 1. Générer les données de test

```bash
python seed_data.py
```

Cela créera :
- 2 utilisateurs (admin et gestionnaire)
- 6 catégories de produits
- 22 produits variés
- Quelques mouvements de stock

**Comptes de test créés :**
- Admin : `admin` / `admin123`
- Gestionnaire : `gestionnaire` / `gestionnaire123`

### 2. Lancer le serveur

```bash
uvicorn main:app --reload
```

Le serveur démarre sur `http://localhost:8000`

## Documentation de l'API

Une fois le serveur lancé, accédez à :

- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

## Endpoints principaux

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Obtenir les infos de l'utilisateur connecté

### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie
- `GET /api/categories/{id}` - Détails d'une catégorie
- `PUT /api/categories/{id}` - Modifier une catégorie
- `DELETE /api/categories/{id}` - Supprimer une catégorie

### Produits
- `GET /api/products` - Liste des produits (filtres disponibles)
- `POST /api/products` - Créer un produit
- `GET /api/products/{id}` - Détails d'un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

**Filtres disponibles :**
- `?category_id=1` - Filtrer par catégorie
- `?low_stock=true` - Afficher uniquement les produits en alerte de stock

### Mouvements de stock
- `GET /api/stock-movements` - Liste des mouvements
- `POST /api/stock-movements` - Créer un mouvement de stock
- `GET /api/stock-movements/{id}` - Détails d'un mouvement

**Types de mouvements :**
- `in` - Entrée de stock (ajout)
- `out` - Sortie de stock (vente, perte)
- `adjustment` - Ajustement (correction)

## Exemples d'utilisation

### Se connecter

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

Réponse :
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "admin@stockmanager.com",
    "username": "admin",
    "role": "admin"
  }
}
```

### Lister les produits en alerte de stock

```bash
curl -X GET "http://localhost:8000/api/products?low_stock=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Créer un mouvement de stock (entrée)

```bash
curl -X POST "http://localhost:8000/api/stock-movements" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "movement_type": "in",
    "quantity": 20,
    "reason": "Réapprovisionnement"
  }'
```

## Développement

### Réinitialiser la base de données

```bash
# Supprimer la base de données
rm stock_management.db

# Recréer avec les données de test
python seed_data.py
```

### Lancer en mode développement

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Sécurité

- Les mots de passe sont hashés avec bcrypt
- L'authentification utilise JWT (JSON Web Tokens)
- Les tokens expirent après 30 minutes par défaut
- CORS configuré pour autoriser le frontend

## Notes importantes

- La base de données SQLite est stockée dans `stock_management.db`
- Les tokens JWT doivent être inclus dans le header `Authorization: Bearer TOKEN`
- Tous les endpoints (sauf `/api/auth/login` et `/api/auth/register`) nécessitent une authentification
- Le rôle admin peut créer d'autres utilisateurs, le gestionnaire a accès en lecture/écriture sur les produits

## Prochaines améliorations possibles

- [ ] Pagination pour les listes
- [ ] Export de données (CSV, Excel)
- [ ] Statistiques et tableaux de bord
- [ ] Notifications par email pour les alertes de stock
- [ ] Historique complet des modifications
- [ ] Gestion des fournisseurs
- [ ] Gestion des commandes
- [ ] Upload d'images pour les produits

## Support

Pour toute question ou problème, consultez la documentation Swagger à `/docs` ou contactez l'équipe de développement.
