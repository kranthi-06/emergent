import urllib.request
import json

url = "http://127.0.0.1:8000/api/sensors"
data = {
    "temperature": 25.5,
    "humidity": 60.0,
    "soil_moisture": 45.0,
    "pump_status": "OFF"
}

req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        response_body = response.read().decode('utf-8')
        print("Response Raw:", response_body)
        
        # Verify JSON
        resp_json = json.loads(response_body)
        print("\n--- Parsed Response ---")
        print(f"ID: {resp_json.get('id')}")
        print(f"Command: {resp_json.get('command')}")
        print(f"Source: {resp_json.get('source')}")
        print(f"Validity: {resp_json.get('valid_for_sec')} seconds")
        
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(e)
