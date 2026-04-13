import requests

url = "http://localhost:8000/analyze"
files = [
    ('files', ('test.nc', b'dummy content', 'application/x-netcdf')),
]

response = requests.post(url, files=files)
print(response.status_code)
print(response.json())
