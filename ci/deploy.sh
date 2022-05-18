#!/bin/bash

# init ssh connection
ssh -tt -o StrictHostKeyChecking=no esteban@162.38.112.131 << EOF

# update polycode-backend repo
cd ~esteban/polycode/polycode-backend
git pull --rebase

# deploy with docker compose file
cd ~esteban/polycode
docker compose --env-file ./config/.env.prod up -d --build

# close ssh connection
exit 

EOF
