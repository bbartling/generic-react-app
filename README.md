# generic-react-app
Generic react Typescript app to make into other things. Uses Docker, self signed certs for tls with ngnix, and a login screen and JWT type authentication.

## Make sure Docker and Dockercompose are setup
```bash
docker --version
docker-compose --version
```

## (skip) Notes to bootstrap tsx react project with a dir named `frontend`
This is only notes to do this again if needed on another future project but `skip` otherwise.
```bash
npx create-react-app frontend --template typescript

npm install axios react-router-dom
npm install --save-dev @types/axios @types/react-router-dom

```
## Build the react app for production

If on linux run bash script
```bash
build_react.sh
```

else on Windows to build react projects
```bash
cd frontend
npm run build
```

## Make self signed certs
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/self-signed.key -out nginx/self-signed.crt
```

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

## Add .env for jwt and admin username and password
```bash
touch .env
```

## Edit .env file for custom passwords, etc..
```bash
ADMIN_USERNAME=me
ADMIN_PASSWORD=1234
JWT_SECRET_KEY=super_secret_jwt_key
```

## Remove Containers
```bash
docker-compose down
```

## Rebuild and Restart Containers
```bash
docker-compose build
docker-compose up
```

