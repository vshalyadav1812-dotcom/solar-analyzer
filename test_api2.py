import requests

url = "http://localhost:8000/analyze"
files = [
    ('files', ('test.nc', b'dummy content', 'application/x-netcdf')),
]

response = requests.post(url, files=files)
print("ONE FILE:", response.status_code)

files_multi = [
    ('files', ('test1.nc', b'dummy content', 'application/x-netcdf')),
    ('files', ('test2.nc', b'dummy content', 'application/x-netcdf')),
]
response_multi = requests.post(url, files=files_multi)
print("MULTI FILE:", response_multi.status_code)
