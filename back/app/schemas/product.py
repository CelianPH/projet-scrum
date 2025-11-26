from pydantic import BaseModel, ConfigDict
from typing import Optional


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    sku: str
    price: float
    category_id: int
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: int = 0
    min_stock_threshold: int = 10
    location: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: Optional[int] = None
    min_stock_threshold: Optional[int] = None
    location: Optional[str] = None


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
