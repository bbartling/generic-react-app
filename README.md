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

3. Run py side server:
```bash
python main.py
```

## Getting front end side settup

1. cd into react project
```bash
cd ../frontend/my-app
```
2. Install the required packages:
```bash
npm install
```
3. Build the React app for production:
```bash
npm run build
```

## Set Up Caddy for Proxy Management

1. Install Caddy
```bash
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo apt-key add -
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/repos/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

2. Generate Self-Signed Certificates
```bash
mkdir -p /etc/caddy/certs
cd /etc/caddy/certs

# Generate a private key
openssl genrsa -out selfsigned.key 2048

# Generate a certificate signing request (CSR)
openssl req -new -key selfsigned.key -out selfsigned.csr

# Generate the self-signed certificate
openssl x509 -req -days 365 -in selfsigned.csr -signkey selfsigned.key -out selfsigned.crt
```
When prompted for information during the CSR generation, you can fill it in or leave it blank. For Common Name (CN), use `localhost` if you're setting this up for local development.


3. Edit the Caddyfile
```bash
sudo nano /etc/caddy/Caddyfile
```
Add the following configuration:

```bash
localhost {
    tls /etc/caddy/certs/selfsigned.crt /etc/caddy/certs/selfsigned.key

    reverse_proxy /api/* http://localhost:8080
    reverse_proxy / http://localhost:3000
}

192.168.1.100 {
    tls /etc/caddy/certs/selfsigned.crt /etc/caddy/certs/selfsigned.key

    reverse_proxy /api/* http://192.168.1.100:8080
    reverse_proxy / http://192.168.1.100:3000
}

```
Replace `192.168.1.100` with the actual IP address of your server if you want to access it via IP. Keep `localhost` for local development.

Explanation
* `localhost`: This block allows you to access your application via https://localhost.
* `192.168.1.100`: This block allows you to access your application via the specified IP address (192.168.1.100 in this case). Adjust this IP to match your actual server's IP.

Starting and Enabling Caddy
```bash
sudo systemctl start caddy
```

Enable Caddy to Start on Boot:
```bash
sudo systemctl enable caddy
```

Check Caddy status:
```bash
sudo systemctl status caddy
```

Check Caddy logs for any errors:
```bash
sudo journalctl -u caddy
```
