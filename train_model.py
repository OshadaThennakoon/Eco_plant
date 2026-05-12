import os
import json
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam

# ==========================================
# Configuration
# ==========================================
DATASET_DIR = 'dataset'
IMG_SIZE = (224, 224)
BATCH_SIZE = 8  # Small batch size for testing/dummy data
EPOCHS = 3      # Small epochs for quick testing
MODELS_DIR = 'models'

if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

if not os.path.exists(DATASET_DIR):
    print(f"Error: Dataset directory '{DATASET_DIR}' not found!")
    print("Please run 'python create_dummy_dataset.py' first.")
    exit(1)

# Ensure class mapping is saved so the backend knows the indices
class_mappings = {}

# ==========================================
# Training Loop
# ==========================================
# Look through the dataset directory for vegetables
vegetables = [d for d in os.listdir(DATASET_DIR) if os.path.isdir(os.path.join(DATASET_DIR, d))]

for veg in vegetables:
    print(f"\n{'='*50}")
    print(f"Training Model for: {veg}")
    print(f"{'='*50}")
    
    veg_dataset_dir = os.path.join(DATASET_DIR, veg)
    model_save_path = os.path.join(MODELS_DIR, f"{veg.lower()}_model.h5")
    
    # 1. Data Loading
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        horizontal_flip=True,
        validation_split=0.2
    )

    train_generator = datagen.flow_from_directory(
        veg_dataset_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    val_generator = datagen.flow_from_directory(
        veg_dataset_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    num_classes = len(train_generator.class_indices)
    
    # Save the class indices mapping for this vegetable
    inv_map = {v: k for k, v in train_generator.class_indices.items()}
    class_mappings[veg.lower()] = inv_map
    
    print(f"Classes for {veg}:", train_generator.class_indices)

    # 2. Build Model
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(64, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer=Adam(learning_rate=0.001), loss='categorical_crossentropy', metrics=['accuracy'])

    # 3. Train Model
    print(f"Starting training for {veg}...")
    model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator
    )

    # 4. Save Model
    print(f"Saving {veg} model to {model_save_path}...")
    model.save(model_save_path)
    print(f"✅ {veg} model saved!")

# Save the class mappings for the backend to use
with open(os.path.join(MODELS_DIR, 'class_mappings.json'), 'w') as f:
    json.dump(class_mappings, f, indent=4)
    
print("\n🎉 All 5 models have been trained and saved successfully in the 'models/' directory!")
