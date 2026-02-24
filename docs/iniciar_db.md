## Instalar el git
sudo apt update
sudo apt install -y git
mkdir -p ~/.ssh
chmod 700 ~/.ssh
## Crear SSH Keys
ssh-keygen -t ed25519 -C "ec2-deploy" -f ~/.ssh/id_ed25519
# Ver SSH Key
cat ~/.ssh/id_ed25519.pub
## User ssh key en github
Repo->Settings->Deploy Keys->Add Key->Copy Key 
## Instalar docker y docker compose en servidor 
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${VERSION_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update

sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

## GIT Clone
Clonar el repo mediate ssh
## Creacion de .env
nano .env


