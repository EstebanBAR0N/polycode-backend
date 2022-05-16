#!/bin/bash

# init ssh connection
ssh esteban@162.38.112.131

# update polycode-backend repo
cd ~esteban/polycode/polycode-backend
git pull --rebase

# deploy with docker compose file
sudo su -
cd ~esteban/polycode
docker compose --env-file ./config/.env.prod up -d --build

# back to esteban user
exit

# close ssh connection
exit 