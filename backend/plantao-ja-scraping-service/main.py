from fastapi import FastAPI
from api.routers.health_router import router as health_router
from api.routers.processo_router import router as processo_router

app = FastAPI(title="API de Scraping do Plantão Já", version="1.0.0")

app.include_router(health_router)
app.include_router(processo_router)