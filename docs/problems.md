# Problemas conocidos y soluciones

Registro de errores encontrados durante la creación y mantenimiento del servidor.

---

## 1. Espacio insuficiente — no levanta imágenes Docker

**Síntoma:** `docker compose up` falla, no puede descargar imágenes.

**Diagnóstico:**
df -h                            # Ver espacio del disco
df -i                            # Ver inodes disponibles
sudo du -sh /var/lib/docker      # Cuánto ocupa Docker
sudo du -sh /var/lib/containerd  # Cuánto ocupa containerd
docker system df                 # Resumen de uso de Docker
Solución:

bash
# Eliminar imágenes, contenedores y volúmenes sin uso
docker system prune -a

# Solo limpiar contenedores detenidos
docker container prune

# Solo limpiar imágenes sin usar
docker image prune -a
