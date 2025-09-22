from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import os
import json
from datetime import datetime
from typing import List, Optional

# Try to import TensorFlow, fallback to simple scoring if not available
try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers, callbacks
    TENSORFLOW_AVAILABLE = True
    print("[OK] TensorFlow loaded successfully")
except ImportError as e:
    TENSORFLOW_AVAILABLE = False
    print(f"[WARN] TensorFlow not available: {e}")
    print("Using fallback scoring")

app = FastAPI(title="BinaKata ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = None
MODEL_PATH = "models/dyslexia_model_v2.keras"
META_PATH = "models/meta.json"
DATASET_PATH = "models/dataset.jsonl"

class PredictRequest(BaseModel):
    letters_accuracy: float
    words_accuracy: float
    arrange_accuracy: float
    speech_accuracy: Optional[float] = None
    image_accuracy: Optional[float] = None
    avg_reaction_time: Optional[float] = None

class PredictResponse(BaseModel):
    risk_score: float
    recommendation: str

class TrainSample(BaseModel):
    letters_accuracy: float
    words_accuracy: float
    arrange_accuracy: float
    speech_accuracy: Optional[float] = None
    image_accuracy: Optional[float] = None
    avg_reaction_time: Optional[float] = None
    label: float  # 0.0 (low risk) .. 1.0 (high risk)

class TrainRequest(BaseModel):
    samples: List[TrainSample]
    epochs: int = 30

class TrainResponse(BaseModel):
    samples_added: int
    trained_at: str
    model_path: str

def _feature_vector(sample):
    """Extract feature vector from sample"""
    sa = sample.speech_accuracy if sample.speech_accuracy is not None else 0.5
    ia = sample.image_accuracy if sample.image_accuracy is not None else 0.5
    rt = sample.avg_reaction_time if sample.avg_reaction_time is not None else 2.0
    # Normalize reaction time to 0..1 with 0s = 1.0, 5s = 0.0 (clipped)
    rt_norm = max(0.0, min(1.0, 1.0 - (rt / 5.0)))
    vec = np.array([
        float(sample.letters_accuracy),
        float(sample.words_accuracy),
        float(sample.arrange_accuracy),
        float(sa),
        float(ia),
        float(rt_norm)
    ], dtype="float32")
    return vec

def build_model(input_dim: int = 6):
    """Build neural network model"""
    if not TENSORFLOW_AVAILABLE:
        return None
    
    inputs = layers.Input(shape=(input_dim,))
    x = layers.Dense(32, activation='relu')(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.2)(x)
    x = layers.Dense(16, activation='relu')(x)
    x = layers.Dense(8, activation='relu')(x)
    outputs = layers.Dense(1, activation='sigmoid')(x)
    model = keras.Model(inputs, outputs)
    model.compile(optimizer=keras.optimizers.Adam(learning_rate=1e-3),
                  loss='binary_crossentropy', metrics=['accuracy'])
    return model

def advanced_scoring(sample: PredictRequest, model_config: dict) -> float:
    """Advanced statistical scoring with adaptive thresholds"""
    weights = model_config["weights"]
    
    # Extract features
    letters_acc = sample.letters_accuracy
    words_acc = sample.words_accuracy
    arrange_acc = sample.arrange_accuracy
    speech_acc = sample.speech_accuracy if sample.speech_accuracy is not None else 0.5
    reaction_time = sample.avg_reaction_time if sample.avg_reaction_time is not None else 2.0
    
    # Compute weighted accuracy score (higher is better)
    accuracy_score = (
        letters_acc * weights["letters_accuracy"] +
        words_acc * weights["words_accuracy"] + 
        arrange_acc * weights["arrange_accuracy"] +
        speech_acc * weights["speech_accuracy"]
    )
    
    # Reaction time penalty (slower = higher risk)
    time_penalty = max(0, (reaction_time - 2.0) / 3.0) * weights["reaction_time"]
    
    # Consistency penalty (high variance across modules indicates issues)
    accuracies = [letters_acc, words_acc, arrange_acc, speech_acc]
    variance_penalty = np.std(accuracies) * 0.1
    
    # Calculate risk score (0 = low risk, 1 = high risk)
    risk_score = (1.0 - accuracy_score) + time_penalty + variance_penalty
    risk_score = max(0.0, min(1.0, risk_score))
    
    return risk_score

def fallback_scoring(sample: PredictRequest) -> float:
    """Simple rule-based scoring when TensorFlow is not available"""
    letters_acc = sample.letters_accuracy
    words_acc = sample.words_accuracy
    arrange_acc = sample.arrange_accuracy
    speech_acc = sample.speech_accuracy if sample.speech_accuracy is not None else 0.5
    reaction_time = sample.avg_reaction_time if sample.avg_reaction_time is not None else 2.0
    
    # Weighted average of accuracies (lower accuracy = higher risk)
    accuracy_score = (
        letters_acc * 0.3 +
        words_acc * 0.3 + 
        arrange_acc * 0.25 +
        speech_acc * 0.15
    )
    
    # Reaction time factor (slower = higher risk)
    time_factor = min(1.0, reaction_time / 5.0)  # Normalize to 0-1, 5s = max
    
    # Calculate risk score (0 = low risk, 1 = high risk)
    risk_score = (1.0 - accuracy_score) * 0.8 + time_factor * 0.2
    risk_score = max(0.0, min(1.0, risk_score))
    
    return risk_score

def synthetic_dataset(n_samples: int = 1000):
    """Generate synthetic training dataset"""
    if not TENSORFLOW_AVAILABLE:
        return None, None
        
    X, y = [], []
    
    for _ in range(n_samples):
        # Generate realistic assessment scores
        letters_accuracy = np.random.normal(0.7, 0.2)
        words_accuracy = np.random.normal(0.65, 0.25)
        arrange_accuracy = np.random.normal(0.6, 0.3)
        speech_accuracy = np.random.normal(0.75, 0.2)
        image_accuracy = np.random.normal(0.6, 0.25)
        reaction_time = np.random.exponential(2.0)
        
        # Clip values to realistic ranges
        letters_accuracy = np.clip(letters_accuracy, 0, 1)
        words_accuracy = np.clip(words_accuracy, 0, 1)
        arrange_accuracy = np.clip(arrange_accuracy, 0, 1)
        speech_accuracy = np.clip(speech_accuracy, 0, 1)
        image_accuracy = np.clip(image_accuracy, 0, 1)
        reaction_time = np.clip(reaction_time, 0.5, 10)
        
        # Normalize reaction time to 0-1 scale (0s = 1.0, 5s = 0.0)
        rt_norm = max(0.0, min(1.0, 1.0 - (reaction_time / 5.0)))
        
        features = [
            letters_accuracy,
            words_accuracy,
            arrange_accuracy,
            speech_accuracy,
            image_accuracy,
            rt_norm
        ]
        
        # Calculate risk score based on weighted combination
        risk_score = (
            (1 - letters_accuracy) * 0.25 +
            (1 - words_accuracy) * 0.25 +
            (1 - arrange_accuracy) * 0.20 +
            (1 - speech_accuracy) * 0.15 +
            (1 - image_accuracy) * 0.10 +
            (1 - rt_norm) * 0.05
        )
        
        # Add some noise and clip
        risk_score += np.random.normal(0, 0.05)
        risk_score = np.clip(risk_score, 0, 1)
        
        # Binary label: 1 for high risk (>0.6), 0 for low risk
        label = 1 if risk_score > 0.6 else 0
        
        X.append(features)
        y.append(label)
    
    return np.array(X, dtype='float32'), np.array(y, dtype='float32')

def ensure_model():
    """Load or create ML model"""
    global MODEL
    os.makedirs("models", exist_ok=True)
    
    if MODEL is not None:
        return MODEL
    
    if not TENSORFLOW_AVAILABLE:
        print("Using fallback scoring instead of ML model")
        return None
        
    if os.path.exists(MODEL_PATH):
        try:
            MODEL = keras.models.load_model(MODEL_PATH)
            print("[OK] Loaded existing model")
            return MODEL
        except Exception as e:
            print(f"Error loading model: {e}")
    
    # Train on synthetic data if no model exists
    print("[INFO] Training new model on synthetic data...")
    X, y = synthetic_dataset()
    if X is None:
        return None
        
    MODEL = build_model(input_dim=X.shape[1])
    es = callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    MODEL.fit(X, y, epochs=30, batch_size=64, validation_split=0.2, verbose=1, callbacks=[es])
    MODEL.save(MODEL_PATH)
    
    with open(META_PATH, 'w') as f:
        json.dump({
            "trained_at": datetime.utcnow().isoformat(),
            "model_type": "neural_network",
            "synthetic_data": True
        }, f)
    
    print("[OK] Model trained and saved")
    return MODEL

@app.on_event("startup")
def startup():
    """Initialize model on startup"""
    ensure_model()
    print("[READY] ML Service ready!")

@app.get("/")
def root():
    trained_at = None
    model_type = "fallback"
    
    if os.path.exists(META_PATH):
        try:
            meta = json.load(open(META_PATH))
            trained_at = meta.get("trained_at")
            model_type = meta.get("model_type", "neural_network")
        except Exception:
            trained_at = None
            
    return {
        "service": "BinaKata ML Service", 
        "status": "ready",
        "tensorflow_available": TENSORFLOW_AVAILABLE,
        "model_type": model_type,
        "trained_at": trained_at,
        "version": "2.0.0"
    }

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    """Predict dyslexia risk"""
    model = ensure_model()
    
    if TENSORFLOW_AVAILABLE and model is not None:
        # Use neural network model
        x = _feature_vector(req)[None, :]
        risk_score = float(model.predict(x, verbose=0)[0][0])
        model_used = "neural_network"
    else:
        # Use fallback scoring
        risk_score = fallback_scoring(req)
        model_used = "fallback"
    
    if risk_score >= 0.7:
        recommendation = (
            "Risiko tinggi: rujuk evaluasi profesional; fokus modul huruf dasar, ejaan pelan dengan audio, "
            "dan latihan pengenalan gambar tingkat dasar."
        )
    elif risk_score >= 0.4:
        recommendation = (
            "Risiko sedang: latihan ejaan interaktif, permainan susun kata, dan latihan gambar berpasangan."
        )
    else:
        recommendation = "Risiko rendah: lanjutkan latihan bertahap dan pemantauan konsistensi."

    # Save prediction for future training (anonymized)
    prediction_data = {
        "features": _feature_vector(req).tolist(),
        "risk_score": risk_score,
        "model_used": model_used,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Append to dataset for future retraining
    try:
        with open(DATASET_PATH, 'a') as f:
            f.write(json.dumps(prediction_data) + "\n")
    except Exception:
        pass  # Don't fail if we can't save

    return PredictResponse(risk_score=risk_score, recommendation=recommendation)

@app.post("/train", response_model=TrainResponse)
def train(req: TrainRequest):
    """Retrain model with new data"""
    if not TENSORFLOW_AVAILABLE:
        return TrainResponse(
            samples_added=0,
            trained_at=datetime.utcnow().isoformat(),
            model_path="fallback_model"
        )
    
    os.makedirs("models", exist_ok=True)
    
    # Append samples to dataset file
    added = 0
    with open(DATASET_PATH, 'a') as f:
        for s in req.samples:
            record = s.model_dump()
            f.write(json.dumps(record) + "\n")
            added += 1

    # Load all training data
    X_list, y_list = [], []
    try:
        with open(DATASET_PATH, 'r') as f:
            for line in f:
                if line.strip():
                    obj = json.loads(line)
                    if 'label' in obj:  # Training sample
                        sample = TrainSample(**obj)
                        X_list.append(_feature_vector(sample))
                        y_list.append(float(sample.label))
    except Exception as e:
        print(f"Error loading training data: {e}")
        # Fall back to synthetic data
        X, y = synthetic_dataset()
        if X is not None:
            X_list = X.tolist()
            y_list = y.tolist()

    if len(X_list) < 10:
        return TrainResponse(
            samples_added=added,
            trained_at=datetime.utcnow().isoformat(),
            model_path="insufficient_data"
        )

    X = np.array(X_list, dtype='float32')
    y = np.array(y_list, dtype='float32')

    # Train model
    global MODEL
    MODEL = build_model(input_dim=X.shape[1])
    es = callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    MODEL.fit(X, y, epochs=req.epochs, batch_size=64, validation_split=0.2, verbose=1, callbacks=[es])
    MODEL.save(MODEL_PATH)
    
    meta = {
        "trained_at": datetime.utcnow().isoformat(), 
        "n_samples": len(y),
        "model_type": "neural_network",
        "synthetic_data": False
    }
    with open(META_PATH, 'w') as f:
        json.dump(meta, f)

    return TrainResponse(
        samples_added=added,
        trained_at=meta["trained_at"],
        model_path=MODEL_PATH
    )

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BinaKata ML Service",
        "tensorflow_available": TENSORFLOW_AVAILABLE,
        "model_loaded": MODEL is not None,
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    print(f"[START] Starting BinaKata ML Service on port {port}")
    print(f"[INFO] TensorFlow Available: {TENSORFLOW_AVAILABLE}")
    uvicorn.run(app, host="0.0.0.0", port=port)