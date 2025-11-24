from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.stock_movement import MovementType


class StockMovementBase(BaseModel):
    product_id: int
    movement_type: MovementType
    quantity: int
    reason: Optional[str] = None


class StockMovementCreate(StockMovementBase):
    pass


class StockMovementResponse(StockMovementBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
