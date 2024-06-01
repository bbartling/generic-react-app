# generic-react-app
Generic react Typescript app with a Python aiohttp backend to make into other things. Uses Docker, self signed certs for tls with ngnix, and a login screen and JWT type authentication.

## project structure
```
generic-react-app/
├── app/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   └── build (Typescript React)
├── nginx/
│   ├── default.conf
│   └── self-signed.crt
│   └── self-signed.key
├── docker-compose.yml
└── Dockerfile
```


## Make sure Docker and Dockercompose are setup
Update on Ubuntu
```bash
sudo apt-get update
sudo apt-get upgrade
```
Check if Docker and docker compose plugin installed
```bash
docker --version
docker-compose --version
```
Else install docker per directions. Make sure docker compose is installed to be able to run as seperate commands like `docker-compose --version`.
* https://docs.docker.com/engine/install/ubuntu/
* https://docs.docker.com/compose/install/linux/


# install React and Typscript
```bash
npm install axios react-router-dom
npm install --save-dev @types/axios @types/react-router-dom
npm install typescript --save-dev
npm install react-bootstrap bootstrap

```
## Build the react app for production
Bash script
```bash
build_react.sh
```

## Make self signed certs
Bash script
```bash
generate_ssl.sh
```


## Add .env for jwt and admin username and password
```bash
touch .env
```

Set `Admin` username and password with the `.env` file and make unique and strong
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
JWT_SECRET_KEY=super_secret_jwt_key
```

## Remove Containers
```bash
docker-compose down

# Remove all unused images, containers, volumes, and networks
docker system prune -a --volumes
```

## Rebuild and Restart Containers
```bash
docker-compose build
docker-compose up
```

## (skip) Notes to bootstrap tsx react project with a dir named `frontend`
This is only notes to do this again if needed on another future project but `skip` otherwise.
```bash
npx create-react-app frontend --template typescript
```