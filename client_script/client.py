import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# Suppress only the single InsecureRequestWarning from urllib3 needed for self-signed certificates
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# API endpoints
BASE_URL = 'https://10.200.200.223'
LOGIN_URL = f'{BASE_URL}/login'
DASHBOARD_URL = f'{BASE_URL}/dashboard'

# Credentials for login
credentials = {
    "username": "py",
    "password": "py"  # Credentials i created on the front end ahead of time
}

# Login and retrieve JWT token
def get_jwt_token():
    response = requests.post(LOGIN_URL, json=credentials, verify=False)
    if response.status_code == 200:
        return response.json()['token']
    else:
        raise Exception(f"Failed to login: {response.json().get('message', 'No error message')}")

# Fetch the dashboard data using the JWT token
def fetch_financials(jwt_token):
    headers = {'Authorization': f'Bearer {jwt_token}'}
    response = requests.get(DASHBOARD_URL, headers=headers, verify=False)
    if response.status_code == 200:
        return response.json()['data']['financials']
    else:
        raise Exception(f"Failed to fetch dashboard data: {response.json().get('message', 'No error message')}")

if __name__ == "__main__":
    try:
        token = get_jwt_token()
        financial_data = fetch_financials(token)
        print("Financial Data:", financial_data)
    except Exception as e:
        print(e)
