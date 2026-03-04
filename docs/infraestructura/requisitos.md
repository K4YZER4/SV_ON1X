# Requisitos del Servidor — AWS EC2

## Instancia Usada
**t3.large** — 2 vCPU / 8 GB RAM

## Especificaciones Actuales

| Recurso        | Valor              | Estado     |
|----------------|--------------------|------------|
| Instancia      | t3.large           | ✅          |
| vCPU           | 2 núcleos          | ✅          |
| RAM            | 7.6 GB             | ✅          |
| Almacenamiento | 15 GB SSD (gp3)    | ✅          |
| Sistema Oper.  | Ubuntu 22.04 LTS   | ✅          |

## Requisitos Mínimos Recomendados

| Recurso        | Mínimo (Dev)       | Producción         |
|----------------|--------------------|--------------------|
| Instancia      | t2.micro           | t3.medium          |
| vCPU           | 1                  | 2                  |
| RAM            | 1 GB               | 4 GB               |
| Almacenamiento | 10 GB SSD (gp3)    | 30 GB SSD (gp3)    |
| Sistema Oper.  | Ubuntu 22.04 LTS   | Ubuntu 22.04 LTS   |
| Puertos        | 80, 443, 3000, 22  | 80, 443, 3000, 22  |

## Stack que corre en el servidor
- Node.js / Express (API REST)
- PostgreSQL + PostGIS
- Docker / Docker Compose