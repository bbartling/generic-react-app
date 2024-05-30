# generic-react-app
generic react app for Pen Testing with JWT login. 

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

## Rebuild and Restart Containers
```bash
docker-compose down
docker-compose build
docker-compose up
```