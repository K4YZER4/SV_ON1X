**Síntoma:** `docker compose up` falla, no puede descargar imágenes o el espacio del servidor es insuficiente para alguna otra tarea debido a archivos que ya no se usan de docker.

**Diagnóstico:**
```bash
df -h                            # Ver espacio del disco
df -i                            # Ver inodes disponibles
sudo du -sh /var/lib/docker      # Cuánto ocupa Docker
sudo du -sh /var/lib/containerd  # Cuánto ocupa containerd
docker system df                 # Resumen de uso de Docker
```

**Solución:**
```bash
# Eliminar imágenes, contenedores y volúmenes sin uso
docker system prune -a

# Solo limpiar contenedores detenidos
docker container prune

# Solo limpiar imágenes sin usar
docker image prune -a
```