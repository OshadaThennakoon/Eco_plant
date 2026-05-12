import os
import numpy as np
from PIL import Image
import shutil

# The 5 specific vegetables and their diseases
VEGETABLES_MAP = {
    'Tomato': ['Healthy', 'Early Blight', 'Late Blight'],
    'Chili': ['Healthy', 'Leaf Curl', 'Wilt'],
    'Brinjal': ['Healthy', 'Fruit Rot', 'Shoot Borer'],
    'Cassava': ['Healthy', 'Mosaic Disease', 'Brown Streak'],
    'Bean': ['Healthy', 'Rust', 'Angular Leaf Spot']
}

DATASET_DIR = 'dataset'

def create_dummy_images():
    # Clean up old dataset if exists
    if os.path.exists(DATASET_DIR):
        print(f"Cleaning up old '{DATASET_DIR}' directory...")
        shutil.rmtree(DATASET_DIR)
    
    os.makedirs(DATASET_DIR)
        
    for veg, diseases in VEGETABLES_MAP.items():
        veg_dir = os.path.join(DATASET_DIR, veg)
        os.makedirs(veg_dir)
        
        print(f"\n--- Generating dummy dataset for {veg} ---")
        for disease in diseases:
            disease_dir = os.path.join(veg_dir, disease)
            os.makedirs(disease_dir)
            
            print(f"  Generating 10 dummy images for {disease}...")
            for i in range(10):
                # Generate a random noise image
                random_pixels = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
                img = Image.fromarray(random_pixels)
                img.save(os.path.join(disease_dir, f"{disease.replace(' ', '_').lower()}_{i}.jpg"))

    print("\n✅ Dummy dataset created successfully for 5 vegetables!")
    print("You can now run 'python train_model.py' to train the 5 distinct models.")

if __name__ == '__main__':
    create_dummy_images()
