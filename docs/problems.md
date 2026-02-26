## Espacio en el servidor  incapaz de levantar imagenes docker
# Ver espacio del servidor
df -h
df -i
sudo du -sh /var/lib/docker
sudo du -sh /var/lib/containerd
# Ver consumo de espacio de docker
docker system df
