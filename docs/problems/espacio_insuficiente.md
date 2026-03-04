## 1. Espacio que ocupa docker sin usar 

## Síntoma: 

Esto ocurre porque Docker almacena en disco **todas** las imágenes,
contenedores detenidos, volúmenes huérfanos y caché de construcción.
Con el tiempo, este espacio se acumula silenciosamente aunque ya no
estés usando esos recursos.

También puede fallar incluso si `df -h` muestra espacio libre, porque
Docker puede agotar los **inodes** del sistema de archivos — cada archivo
y directorio consume un inode, y si se agotan, el sistema no puede crear
nuevos archivos aunque haya gigabytes disponibles.

### Señales de alerta

| Síntoma                                      | Causa probable              |
|----------------------------------------------|-----------------------------|
| `no space left on device`                    | Disco lleno                 |
| Imágenes que fallan a mitad de descarga      | Disco lleno o inodes agotados |
| `docker compose up` se congela sin error claro | Inodes agotados            |
| Servicios que arrancan y mueren inmediatamente | Sin espacio para logs      |

## **Diagnóstico:**
```bash
df -h                            # Ver espacio del disco
df -i                            # Ver inodes disponibles por que aunque haya espacio en el servidor si no hay inodes dispnibles docker no podra funcionar
sudo du -sh /var/lib/docker      # Cuánto ocupa Docker
sudo du -sh /var/lib/containerd  # Cuánto ocupan los contenedores
docker system df                 # Resumen de uso de Docker
```
---
## **Solución:**
```bash
# Eliminar imágenes, contenedores y volúmenes sin uso
docker system prune -a

# Solo limpiar contenedores detenidos
docker container prune

# Solo limpiar imágenes sin usar
docker image prune -a
```