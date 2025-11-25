from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.core.config import settings
from app.routers import auth, categories, products, stock_movements, users

# Créer les tables de la base de données
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stock Management API",
    description="API de gestion de stock pour magasin de vêtements",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(stock_movements.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Bienvenue sur l'API de gestion de stock",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
