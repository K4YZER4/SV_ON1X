# Expandir Volumen EBS en AWS EC2

## ¿Por qué hacerlo?
Cuando el disco raíz supera el 85% de uso, Docker, PostgreSQL y otros
servicios pueden fallar o corromperse por falta de espacio.

## Pasos en la Consola AWS

1. Ir a **EC2 → Elastic Block Store → Volúmenes**
2. Seleccionar el volumen de la instancia
3. Click en **Acciones → Modificar volumen**
4. Cambiar el tamaño (ej. de `8 GB` a `15 GB`)
5. Click en **Modificar** → Confirmar

> ⚠️ Este cambio no requiere apagar la instancia.

## Comandos en la Terminal

### 1. Expandir la partición
```bash
sudo growpart /dev/nvme0n1 1
