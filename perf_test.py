import requests
import time

url = "http://localhost:8000/analyze"
file_path = "Split_Data/TSIS1_03_Visible.nc"

with open(file_path, "rb") as f:
    files = [("files", ("TSIS1_03_Visible.nc", f, "application/x-netcdf"))]
    t0 = time.time()
    print("Sending request...")
    response = requests.post(url, files=files)
    t1 = time.time()
    
    print(f"Status Code: {response.status_code}")
    print(f"Time Taken: {t1 - t0:.2f} seconds")
    if response.status_code != 200:
        print(response.text)
    else:
        print("Success!")
