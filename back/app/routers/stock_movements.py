from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import update
from app.core.database import get_db
from app.core.security import get_current_user, get_current_manager_or_admin
from app.models.stock_movement import StockMovement, MovementType
from app.models.product import Product
from app.models.user import User
from app.schemas.stock_movement import StockMovementCreate, StockMovementResponse

router = APIRouter(prefix="/stock-movements", tags=["Stock Movements"])


@router.get("/", response_model=List[StockMovementResponse])
def get_stock_movements(
    skip: int = 0,
    limit: int = 100,
    product_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(StockMovement)

    if product_id:
        query = query.filter(StockMovement.product_id == product_id)

    movements = query.order_by(StockMovement.created_at.desc()).offset(skip).limit(limit).all()
    return movements


@router.get("/{movement_id}", response_model=StockMovementResponse)
def get_stock_movement(
    movement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    movement = db.query(StockMovement).filter(StockMovement.id == movement_id).first()
    if not movement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock movement not found"
        )
    return movement


@router.post("/", response_model=StockMovementResponse, status_code=status.HTTP_201_CREATED)
def create_stock_movement(
    movement_data: StockMovementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager_or_admin)  # Gestionnaires et admins
):
    """
    Créer un mouvement de stock avec opérations atomiques (Gestionnaire ou Admin)

    - IN: Ajouter du stock
    - OUT: Retirer du stock
    - ADJUSTMENT: Ajuster le stock à une valeur exacte
    """
    # Vérifier que le produit existe
    product = db.query(Product).filter(Product.id == movement_data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Mettre à jour la quantité du produit avec une opération atomique
    result = None

    if movement_data.movement_type == MovementType.IN:
        # Ajouter du stock (opération atomique)
        result = db.execute(
            update(Product)
            .where(Product.id == movement_data.product_id)
            .values(quantity=Product.quantity + movement_data.quantity)
        )

    elif movement_data.movement_type == MovementType.OUT:
        # Retirer du stock (opération atomique avec vérification)
        result = db.execute(
            update(Product)
            .where(
                Product.id == movement_data.product_id,
                Product.quantity >= movement_data.quantity
            )
            .values(quantity=Product.quantity - movement_data.quantity)
        )

        if result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock"
            )

    elif movement_data.movement_type == MovementType.ADJUSTMENT:
        # Ajuster le stock à une valeur exacte
        if movement_data.quantity < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity cannot be negative"
            )

        result = db.execute(
            update(Product)
            .where(Product.id == movement_data.product_id)
            .values(quantity=movement_data.quantity)
        )

    # Créer le mouvement de stock
    new_movement = StockMovement(**movement_data.model_dump())
    db.add(new_movement)

    db.commit()
    db.refresh(new_movement)
    return new_movement
