import requests
import numpy as np
from PIL import Image
import io

# Create a valid dummy image
img = Image.fromarray(np.zeros((150, 150, 3), dtype=np.uint8))
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
img_byte_arr.seek(0)

url = 'http://127.0.0.1:5001/predict'
files = {'image': ('test.jpg', img_byte_arr, 'image/jpeg')}
data = {'vegetable': 'bean'}

try:
    response = requests.post(url, files=files, data=data)
    print("Status:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Request failed:", e)
