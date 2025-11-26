from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    sku = Column(String, unique=True, nullable=False, index=True)
    price = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    size = Column(String, nullable=True)
    color = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False, default=0)
    min_stock_threshold = Column(Integer, nullable=False, default=10)
    location = Column(String, nullable=True)

    # Relations
    category = relationship("Category", back_populates="products")
    stock_movements = relationship("StockMovement", back_populates="product")
