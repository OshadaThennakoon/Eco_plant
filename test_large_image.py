import requests
import numpy as np
from PIL import Image
import io

# Create a large image to exceed 500KB
img = Image.fromarray(np.random.randint(0, 255, (2000, 2000, 3), dtype=np.uint8))
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='PNG')  # PNG is lossless, so 2000x2000 noise will be HUGE (12MB+)
img_byte_arr.seek(0)
print("Image size:", len(img_byte_arr.getvalue()) / 1024 / 1024, "MB")

url = 'http://127.0.0.1:5001/predict'
files = {'image': ('test.png', img_byte_arr, 'image/png')}
data = {'vegetable': 'bean'}

try:
    response = requests.post(url, files=files, data=data)
    print("Status:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Request failed:", e)
