import os
import numpy as np
from typing import Tuple
from tensorflow import keras
from tensorflow.keras import layers
from ..config import settings

MODEL_PATH = None

def _model_path() -> str:
    global MODEL_PATH
    if MODEL_PATH is None:
        os.makedirs(settings.model_dir, exist_ok=True)
        MODEL_PATH = os.path.join(settings.model_dir, "dyslexia_model.keras")
    return MODEL_PATH


def _build_model(input_dim: int = 3) -> keras.Model:
    model = keras.Sequential([
        layers.Input(shape=(input_dim,)),
        layers.Dense(8, activation="relu"),
        layers.Dense(4, activation="relu"),
        layers.Dense(1, activation="sigmoid"),
    ])
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
    return model


def _synthetic_dataset(n: int = 2000) -> Tuple[np.ndarray, np.ndarray]:
    # features: [letters_acc, words_acc, arrange_acc] in [0,1]
    rng = np.random.default_rng(42)
    X = rng.uniform(0.0, 1.0, size=(n, 3)).astype("float32")
    # Heuristic label: risk if low accuracy
    y = ((X.mean(axis=1) < 0.6) | ((X[:,0] < 0.55) & (X[:,1] < 0.55))).astype("float32")
    return X, y


def ensure_model():
    path = _model_path()
    if os.path.exists(path):
        return keras.models.load_model(path)
    # Train cold-start on synthetic data
    X, y = _synthetic_dataset()
    model = _build_model(input_dim=X.shape[1])
    model.fit(X, y, epochs=10, batch_size=64, verbose=0)
    model.save(path)
    return model


def predict_score(letters_acc: float, words_acc: float, arrange_acc: float) -> Tuple[float, str]:
    model = ensure_model()
    x = np.array([[letters_acc, words_acc, arrange_acc]], dtype="float32")
    prob = float(model.predict(x, verbose=0)[0][0])
    # Map to recommendation text
    if prob >= 0.7:
        rec = "Risiko tinggi: rujuk evaluasi profesional; mulai modul huruf dasar dan ejaan pelan dengan panduan audio."
    elif prob >= 0.4:
        rec = "Risiko sedang: fokuskan latihan ejaan interaktif dan permainan susun kata level dasar."
    else:
        rec = "Risiko rendah: lanjutkan latihan bertahap dan pemantauan konsistensi."
    return prob, rec