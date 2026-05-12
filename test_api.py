import requests

url = 'http://127.0.0.1:5001/predict'
files = {'image': ('test.jpg', b'dummy_image_data', 'image/jpeg')}
data = {'vegetable': 'bean'}

try:
    response = requests.post(url, files=files, data=data)
    print(response.status_code)
    print(response.json())
except Exception as e:
    print("Error:", e)
