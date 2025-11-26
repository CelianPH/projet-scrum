from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import update
from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user, get_current_manager_or_admin
from app.models.product import Product
from app.models.user import User
from app.models.stock_movement import StockMovement, MovementType
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, StockAdjustment

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = Query(None),
    low_stock: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Product)

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if low_stock:
        query = query.filter(Product.quantity <= Product.min_stock_threshold)

    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)  # Seuls les admins peuvent créer
):
    """Créer un nouveau produit (Admin seulement)"""
    # Vérifier si le SKU existe déjà
    if db.query(Product).filter(Product.sku == product_data.sku).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU already exists"
        )

    new_product = Product(**product_data.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)  # Seuls les admins peuvent modifier
):
    """Modifier un produit (Admin seulement)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)  # Seuls les admins peuvent supprimer
):
    """Supprimer un produit (Admin seulement)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()
    return None


@router.post("/{product_id}/increment-stock", response_model=ProductResponse)
def increment_stock(
    product_id: int,
    adjustment: StockAdjustment,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin)
):
    """
    Incrémenter le stock d'un produit (Gestionnaire ou Admin)

    Utilise une opération atomique pour éviter les race conditions.
    """
    if adjustment.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be positive"
        )

    # Vérifier que le produit existe
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Opération atomique pour incrémenter
    result = db.execute(
        update(Product)
        .where(Product.id == product_id)
        .values(quantity=Product.quantity + adjustment.quantity)
    )

    # Créer un mouvement de stock pour tracer l'opération
    movement = StockMovement(
        product_id=product_id,
        movement_type=MovementType.IN,
        quantity=adjustment.quantity,
        reason=adjustment.reason or f"Ajout de stock par {current_user.username}"
    )
    db.add(movement)

    db.commit()
    db.refresh(product)
    return product


@router.post("/{product_id}/decrement-stock", response_model=ProductResponse)
def decrement_stock(
    product_id: int,
    adjustment: StockAdjustment,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin)
):
    """
    Décrémenter le stock d'un produit (Gestionnaire ou Admin)

    Utilise une opération atomique pour éviter les race conditions.
    Vérifie que le stock est suffisant avant de décrémenter.
    """
    if adjustment.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be positive"
        )

    # Vérifier que le produit existe
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Opération atomique pour décrémenter avec vérification de stock suffisant
    result = db.execute(
        update(Product)
        .where(
            Product.id == product_id,
            Product.quantity >= adjustment.quantity
        )
        .values(quantity=Product.quantity - adjustment.quantity)
    )

    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Current stock: {product.quantity}, requested: {adjustment.quantity}"
        )

    # Créer un mouvement de stock pour tracer l'opération
    movement = StockMovement(
        product_id=product_id,
        movement_type=MovementType.OUT,
        quantity=adjustment.quantity,
        reason=adjustment.reason or f"Retrait de stock par {current_user.username}"
    )
    db.add(movement)

    db.commit()
    db.refresh(product)
    return product
