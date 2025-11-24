"""
Script pour générer des données de test pour l'application de gestion de stock
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash
from app.models import User, Category, Product, StockMovement
from app.models.user import UserRole
from app.models.stock_movement import MovementType
from app.core.database import Base


def create_test_data():
    # Créer les tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Vérifier si des données existent déjà
        if db.query(User).first():
            print("Des données existent déjà dans la base de données")
            return

        print("Création des utilisateurs...")
        # Créer des utilisateurs
        admin_user = User(
            email="admin@stockmanager.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            full_name="Administrateur Principal"
        )
        gestionnaire_user = User(
            email="gestionnaire@stockmanager.com",
            username="gestionnaire",
            hashed_password=get_password_hash("gestionnaire123"),
            role=UserRole.GESTIONNAIRE,
            full_name="Gestionnaire de Stock"
        )
        db.add(admin_user)
        db.add(gestionnaire_user)
        db.commit()
        print("OK - Utilisateurs crees")

        print("Création des catégories...")
        # Créer des catégories
        categories_data = [
            {"name": "T-shirts", "description": "T-shirts et tops"},
            {"name": "Pantalons", "description": "Pantalons et jeans"},
            {"name": "Robes", "description": "Robes et jupes"},
            {"name": "Vestes", "description": "Vestes et manteaux"},
            {"name": "Chaussures", "description": "Chaussures et baskets"},
            {"name": "Accessoires", "description": "Accessoires et bijoux"}
        ]

        categories = []
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.add(category)
            categories.append(category)
        db.commit()
        print("OK - Categories creees")

        print("Création des produits...")
        # Créer des produits
        products_data = [
            # T-shirts
            {"name": "T-shirt Basic Blanc", "sku": "TS-WHT-001", "price": 19.99, "category_id": 1, "size": "M", "color": "Blanc", "quantity": 50, "min_stock_threshold": 10, "description": "T-shirt basique en coton"},
            {"name": "T-shirt Basic Noir", "sku": "TS-BLK-001", "price": 19.99, "category_id": 1, "size": "M", "color": "Noir", "quantity": 45, "min_stock_threshold": 10, "description": "T-shirt basique en coton"},
            {"name": "T-shirt Col V Bleu", "sku": "TS-BLU-002", "price": 24.99, "category_id": 1, "size": "L", "color": "Bleu", "quantity": 30, "min_stock_threshold": 10, "description": "T-shirt col V en coton premium"},
            {"name": "T-shirt Rayé", "sku": "TS-STR-003", "price": 29.99, "category_id": 1, "size": "S", "color": "Rayé", "quantity": 8, "min_stock_threshold": 10, "description": "T-shirt à rayures marinière"},

            # Pantalons
            {"name": "Jean Slim Bleu", "sku": "JN-BLU-001", "price": 59.99, "category_id": 2, "size": "32", "color": "Bleu", "quantity": 25, "min_stock_threshold": 8, "description": "Jean slim fit délavé"},
            {"name": "Jean Straight Noir", "sku": "JN-BLK-002", "price": 64.99, "category_id": 2, "size": "34", "color": "Noir", "quantity": 20, "min_stock_threshold": 8, "description": "Jean coupe droite"},
            {"name": "Pantalon Chino Beige", "sku": "PN-BEG-001", "price": 49.99, "category_id": 2, "size": "32", "color": "Beige", "quantity": 15, "min_stock_threshold": 8, "description": "Pantalon chino élégant"},
            {"name": "Pantalon Jogging Gris", "sku": "PN-GRY-002", "price": 39.99, "category_id": 2, "size": "M", "color": "Gris", "quantity": 6, "min_stock_threshold": 10, "description": "Pantalon de jogging confortable"},

            # Robes
            {"name": "Robe d'été Fleurie", "sku": "RB-FLR-001", "price": 79.99, "category_id": 3, "size": "M", "color": "Multicolore", "quantity": 12, "min_stock_threshold": 5, "description": "Robe légère à motif floral"},
            {"name": "Robe Cocktail Noire", "sku": "RB-BLK-002", "price": 129.99, "category_id": 3, "size": "S", "color": "Noir", "quantity": 8, "min_stock_threshold": 5, "description": "Robe élégante pour soirée"},
            {"name": "Jupe Plissée Bleue", "sku": "JP-BLU-001", "price": 44.99, "category_id": 3, "size": "M", "color": "Bleu", "quantity": 4, "min_stock_threshold": 5, "description": "Jupe midi plissée"},

            # Vestes
            {"name": "Veste en Jean", "sku": "VJ-BLU-001", "price": 89.99, "category_id": 4, "size": "M", "color": "Bleu", "quantity": 18, "min_stock_threshold": 6, "description": "Veste en jean classique"},
            {"name": "Blouson Cuir Noir", "sku": "BL-BLK-001", "price": 199.99, "category_id": 4, "size": "L", "color": "Noir", "quantity": 10, "min_stock_threshold": 4, "description": "Blouson en cuir synthétique"},
            {"name": "Manteau Long Gris", "sku": "MT-GRY-001", "price": 149.99, "category_id": 4, "size": "M", "color": "Gris", "quantity": 7, "min_stock_threshold": 5, "description": "Manteau d'hiver élégant"},

            # Chaussures
            {"name": "Baskets Blanches", "sku": "BS-WHT-001", "price": 79.99, "category_id": 5, "size": "42", "color": "Blanc", "quantity": 22, "min_stock_threshold": 10, "description": "Baskets urbaines confortables"},
            {"name": "Baskets Noires Sport", "sku": "BS-BLK-002", "price": 89.99, "category_id": 5, "size": "43", "color": "Noir", "quantity": 18, "min_stock_threshold": 10, "description": "Baskets de sport running"},
            {"name": "Bottines Chelsea", "sku": "BT-BRN-001", "price": 119.99, "category_id": 5, "size": "41", "color": "Marron", "quantity": 5, "min_stock_threshold": 6, "description": "Bottines Chelsea en cuir"},
            {"name": "Sandales d'été", "sku": "SD-BEG-001", "price": 39.99, "category_id": 5, "size": "38", "color": "Beige", "quantity": 3, "min_stock_threshold": 8, "description": "Sandales légères pour l'été"},

            # Accessoires
            {"name": "Ceinture Cuir Noir", "sku": "AC-BLK-001", "price": 34.99, "category_id": 6, "size": "95cm", "color": "Noir", "quantity": 15, "min_stock_threshold": 8, "description": "Ceinture classique en cuir"},
            {"name": "Écharpe Laine Grise", "sku": "AC-GRY-002", "price": 29.99, "category_id": 6, "size": "OneSize", "color": "Gris", "quantity": 9, "min_stock_threshold": 10, "description": "Écharpe chaude en laine"},
            {"name": "Casquette Baseball", "sku": "AC-BLU-003", "price": 24.99, "category_id": 6, "size": "OneSize", "color": "Bleu", "quantity": 12, "min_stock_threshold": 8, "description": "Casquette style baseball"},
            {"name": "Sac à Main Noir", "sku": "AC-BLK-004", "price": 69.99, "category_id": 6, "size": "OneSize", "color": "Noir", "quantity": 6, "min_stock_threshold": 5, "description": "Sac à main élégant"}
        ]

        products = []
        for prod_data in products_data:
            product = Product(**prod_data)
            db.add(product)
            products.append(product)
        db.commit()
        print("OK - Produits crees")

        print("Création des mouvements de stock...")
        # Créer quelques mouvements de stock
        movements_data = [
            {"product_id": 1, "movement_type": MovementType.IN, "quantity": 50, "reason": "Réapprovisionnement initial"},
            {"product_id": 1, "movement_type": MovementType.OUT, "quantity": 5, "reason": "Vente en magasin"},
            {"product_id": 2, "movement_type": MovementType.IN, "quantity": 50, "reason": "Réapprovisionnement initial"},
            {"product_id": 3, "movement_type": MovementType.IN, "quantity": 30, "reason": "Réapprovisionnement initial"},
            {"product_id": 5, "movement_type": MovementType.OUT, "quantity": 3, "reason": "Vente en ligne"},
            {"product_id": 10, "movement_type": MovementType.OUT, "quantity": 2, "reason": "Vente en magasin"},
        ]

        for mov_data in movements_data:
            movement = StockMovement(**mov_data)
            db.add(movement)
        db.commit()
        print("OK - Mouvements de stock crees")

        print("\n=== Données de test créées avec succès! ===\n")
        print("Utilisateurs de test:")
        print("  - Admin: admin / admin123")
        print("  - Gestionnaire: gestionnaire / gestionnaire123")
        print(f"\nNombre de produits créés: {len(products_data)}")
        print(f"Nombre de catégories créées: {len(categories_data)}")
        print("\nProduits en alerte de stock faible:")
        low_stock = db.query(Product).filter(Product.quantity <= Product.min_stock_threshold).all()
        for prod in low_stock:
            print(f"  - {prod.name}: {prod.quantity} unités (seuil: {prod.min_stock_threshold})")

    except Exception as e:
        print(f"Erreur lors de la création des données: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_test_data()
