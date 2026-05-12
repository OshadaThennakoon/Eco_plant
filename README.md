# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

---

## 🤖 Machine Learning Pipeline (Plant Disease Recognition)

This project includes a built-in image classification model pipeline built with TensorFlow/Keras and Flask. The model predicts 5 classes of plant diseases from images.

### 1. Setup

Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

### 2. Prepare the Dataset

To train your own model, organize your plant images into the `dataset/` directory. The folder structure should look exactly like this:

```text
dataset/
├── Tomato Blight/
│   ├── image1.jpg
│   └── image2.jpg
├── Chili Wilt/
├── Brinjal Rot/
├── Cassava Mosaic/
└── Bean Rust/
```

> **Tip:** If you just want to test the script without real images, you can generate a dummy dataset by running:
> ```bash
> python create_dummy_dataset.py
> ```

### 3. Train the Model

Once your dataset is ready, run the training script. This script uses **MobileNetV2** (transfer learning) for fast and lightweight training:

```bash
python train_model.py
```
This will train the model and save it as `vegetable_disease_model.h5` in the root directory.

### 4. Run the Prediction Server

To start the Flask backend API for your React Native app:

```bash
python app.py
```
The server will run on `http://localhost:5000` and expose the `/predict` endpoint (supports CORS).

---

## 🔐 Demo Credentials

To bypass authentication and access the app for testing or demonstration purposes, you can use the following hardcoded credentials:
- **Email:** `admin@eco.com`
- **Password:** `admin123`
