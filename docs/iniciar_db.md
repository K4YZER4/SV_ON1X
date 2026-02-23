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
