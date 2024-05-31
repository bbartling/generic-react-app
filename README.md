# generic-react-app
generic react Typescript based app to make into other things. 

## Bootstrap tsx react project
```bash
npx create-react-app frontend --template typescript

npm install axios react-router-dom
npm install --save-dev @types/axios @types/react-router-dom

```
## Build the react app for production
```bash
build_react.sh
```

## Make certs
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
│   └── my-app
│        └── build (react)
├── nginx/
│   ├── default.conf
│   └── self-signed.crt
│   └── self-signed.key
├── docker-compose.yml
└── Dockerfile
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

