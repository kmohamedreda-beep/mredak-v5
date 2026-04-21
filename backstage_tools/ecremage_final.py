import os, shutil, librosa, numpy as np, whisper, warnings
warnings.filterwarnings("ignore")

# Configuration du chemin sur le volume Expansion
# On utilise une liste pour tester les variations courantes du nom du volume
possible_paths = [
    "/Volumes/Expansion/PORTFOLIO_FINAL",
    "/Volumes/ Expansion/PORTFOLIO_FINAL",
    "/Volumes/Expansion 1/PORTFOLIO_FINAL"
]

SOURCE_DIR = next((p for p in possible_paths if os.path.exists(p)), None)
DEST_DIR = os.path.join(SOURCE_DIR, "top_30") if SOURCE_DIR else None
TARGET_COUNT = 30
EXTENSIONS = ('.mp3', '.wav')

if not SOURCE_DIR:
    print("Erreur : Impossible de localiser 'PORTFOLIO_FINAL' sur le volume Expansion.")
    print("Vérifiez que le disque est bien branché.")
    exit()

print(f"--- Dossier détecté : {SOURCE_DIR} ---")
print("--- Initialisation de l'IA sur GPU M4 ---")
model = whisper.load_model("base", device="mps") 

def get_audio_score(file_path):
    try:
        y, sr = librosa.load(file_path)
        # Analyse du rapport signal/bruit (Sennheiser MKH 416)
        noise_floor = np.mean(librosa.feature.rms(y=y))
        # Analyse de la fluidité (Arabe MSA) via Whisper
        result = model.transcribe(file_path, language="ar")
        duration = librosa.get_duration(y=y, sr=sr)
        wpm = len(result['text'].split()) / (duration / 60) if duration > 0 else 0
        return (1.0 / (noise_floor + 0.001)) * (wpm / 150)
    except: return 0

if __name__ == "__main__":
    if not os.path.exists(DEST_DIR): os.makedirs(DEST_DIR)

    files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith(EXTENSIONS)]
    print(f"Analyse de {len(files)} fichiers (MP3/WAV)...")
    
    scored = []
    for f in files:
        path = os.path.join(SOURCE_DIR, f)
        score = get_audio_score(path)
        scored.append((f, score))
        print(f"Analyse : {f} | Score: {score:.2f}")
    
    scored.sort(key=lambda x: x[1], reverse=True)
    for f, s in scored[:TARGET_COUNT]:
        shutil.copy(os.path.join(SOURCE_DIR, f), os.path.join(DEST_DIR, f))
        
    print(f"\nTerminé ! Les 30 perles sont dans : {DEST_DIR}")
