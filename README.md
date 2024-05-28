# generic-react-app
generic react app for Pen Testing with JWT login. 


## Getting server side settup
1. After cloning repo:
```bash
cd server
python3 -m venv venv
source venv/bin/activate

```
2. Install py packages:
```bash
pip install aiohttp aiohttp-cors pyjwt cryptography
```

3. Optional you can test the py side server that is runs okay:
```bash
python main.py
```

## Getting front end side settup

Run this bash script that builds the react app for production:

```bash
build_react.sh
```

## Set Up Caddy for Proxy Management

1. Install Caddy
```bash
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo apt-key add -
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/repos/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

2. Generate Self-Signed Certificates from inside root of the project directory
```bash
mkdir -p cert
cd certs

# Generate a private key
openssl genrsa -out selfsigned.key 2048

# Generate a certificate signing request (CSR)
openssl req -new -key selfsigned.key -out selfsigned.csr

# Generate the self-signed certificate
openssl x509 -req -days 365 -in selfsigned.csr -signkey selfsigned.key -out selfsigned.crt
```
When prompted for information during the CSR generation, you can fill it in or leave it blank. For Common Name (CN), use `localhost` if you're setting this up for local development.


3. Make and Edit the Caddyfile
```bash
mkdir -p caddy
cd caddy
sudo nano /Caddyfile
```
Add the following configuration which **requires modification** on replacing `/home/ben/generic-react-app` with the actual path to your project directory. Also replace `192.168.1.100` with the actual IP address of your server if you want to access it via IP. Keep `localhost` for local development.:

```bash
localhost {
    tls /home/ben/generic-react-app/certs/selfsigned.crt /home/ben/generic-react-app/certs/selfsigned.key

    reverse_proxy /api/* http://localhost:8080
    reverse_proxy / http://localhost:3000
}

192.168.1.100 {
    tls /home/ben/generic-react-app/certs/selfsigned.crt /home/ben/generic-react-app/certs/selfsigned.key

    reverse_proxy /api/* http://192.168.1.100:8080
    reverse_proxy / http://192.168.1.100:3000
}

```


Explanation
* `localhost`: This block allows you to access your application via https://localhost.
* `192.168.1.100`: This block allows you to access your application via the specified IP address (192.168.1.100 in this case). Adjust this IP to match your actual server's IP.

## Run app from Caddy:

```bash
start_all.sh
```

## Stop app:

```bash
stop_all.sh
```

Troubleshooting Caddy if app needs to be restarted or not working:
```bash
sudo caddy stop
ps aux | grep caddy
sudo pkill caddy
ps aux | grep caddy
```
Restart
```bash
sudo caddy stop
sudo caddy start --config /home/ben/generic-react-app/caddy/Caddyfile
```


