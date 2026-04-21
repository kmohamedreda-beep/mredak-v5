import os, shutil, librosa, numpy as np, whisper, warnings
warnings.filterwarnings("ignore")

SOURCE_DIR = "public/audio/ar"
DEST_DIR = "public/audio/top_30"
TARGET_COUNT = 30

print("--- Initialisation de l'IA sur GPU M4 ---")
# Utilisation du GPU Metal (MPS) pour une vitesse maximale
model = whisper.load_model("base", device="mps") 

def get_audio_score(file_path):
    try:
        y, sr = librosa.load(file_path)
        # Analyse de la clarté technique (bruit de fond)
        noise_floor = np.mean(librosa.feature.rms(y=y))
        # Analyse de la fluidité (débit de mots) via l'IA
        result = model.transcribe(file_path, language="ar")
        duration = librosa.get_duration(y=y, sr=sr)
        words = result['text'].split()
        wpm = len(words) / (duration / 60) if duration > 0 else 0
        # Score : Favorise un signal propre et un débit naturel (130-160 wpm)
        return (1.0 / (noise_floor + 0.001)) * (wpm / 150)
    except: return 0

if __name__ == "__main__":
    if not os.path.exists(DEST_DIR): os.makedirs(DEST_DIR)
    if not os.path.exists(SOURCE_DIR):
        print(f"Erreur : Dossier {SOURCE_DIR} introuvable.")
        exit()
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith('.mp3')]
    print(f"Analyse de {len(files)} fichiers en cours...")
    scored = []
    for f in files:
        path = os.path.join(SOURCE_DIR, f)
        score = get_audio_score(path)
        scored.append((f, score))
        print(f"Fichier : {f} | Score : {score:.2f}")
    scored.sort(key=lambda x: x[1], reverse=True)
    for f, s in scored[:TARGET_COUNT]:
        shutil.copy(os.path.join(SOURCE_DIR, f), os.path.join(DEST_DIR, f))
    print(f"\nSuccès ! Les 30 meilleurs sont dans {DEST_DIR}")
