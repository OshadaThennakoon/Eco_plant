from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
import os
import json

app = Flask(__name__)
# Enable CORS for the React Native Web app
CORS(app)

MODELS_DIR = 'models'
models = {}
class_mappings = {}

# Load class mappings
MAPPINGS_FILE = os.path.join(MODELS_DIR, 'class_mappings.json')
if os.path.exists(MAPPINGS_FILE):
    with open(MAPPINGS_FILE, 'r') as f:
        class_mappings = json.load(f)
else:
    print(f"Warning: {MAPPINGS_FILE} not found. Run train_model.py first.")

# Load models dynamically
SUPPORTED_VEGETABLES = ['tomato', 'chili', 'brinjal', 'cassava', 'bean']

for veg in SUPPORTED_VEGETABLES:
    model_name = f"{veg}_disease_model.h5"
    if veg == 'bean': model_name = "Bean_disease_model.h5"
    if veg == 'cassava': model_name = "Cassava_disease_model.h5"
    
    model_path = os.path.join(MODELS_DIR, model_name)
    if os.path.exists(model_path):
        models[veg] = load_model(model_path)
        print(f"Loaded {veg} model from {model_path}")
    else:
        print(f"Warning: Model for {veg} not found at {model_path}")

@app.route('/predict', methods=['POST'])
def predict():
    vegetable = request.form.get('vegetable', '').lower()
    
    if not vegetable or vegetable not in SUPPORTED_VEGETABLES:
        return jsonify({'error': f'Invalid or missing vegetable. Supported: {SUPPORTED_VEGETABLES}'}), 400

    if vegetable not in models or vegetable not in class_mappings:
        return jsonify({'error': f'Model for {vegetable} is not trained yet. Run train_model.py first.'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        image_file = request.files['image']
        image = Image.open(io.BytesIO(image_file.read())).convert('RGB')
        image = image.resize((150, 150))
        
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        # Predict using the specific vegetable model
        model = models[vegetable]
        prediction = model.predict(image_array, verbose=0)
        class_idx = str(np.argmax(prediction)) # json keys are strings
        
        # Get the actual disease name from the class mapping
        mapping = class_mappings[vegetable]
        predicted_disease = mapping.get(class_idx, "Unknown")
        
        # Reformat the name (e.g., "early_blight" -> "Early Blight")
        predicted_disease = predicted_disease.replace('_', ' ').title()

        confidence = float(np.max(prediction))

        return jsonify({
            'disease': predicted_disease,
            'confidence': confidence,
            'vegetable': vegetable.title()
        })
    except Exception as e:
        import traceback
        return jsonify({'error': traceback.format_exc()}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
