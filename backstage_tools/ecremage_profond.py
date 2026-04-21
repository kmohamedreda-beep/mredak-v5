import os, shutil, librosa, numpy as np, whisper, warnings
from pathlib import Path
warnings.filterwarnings("ignore")

SOURCE_DIR = "/Volumes/Expansion/PORTFOLIO_FINAL"
DEST_DIR = "/Volumes/Expansion/PORTFOLIO_FINAL/top_30"
TARGET_COUNT = 30
EXTENSIONS = ('.mp3', '.wav', '.MP3', '.WAV')

if not os.path.exists(SOURCE_DIR):
    print(f"Erreur : Dossier {SOURCE_DIR} introuvable.")
    exit()

print("--- Initialisation de l'IA sur GPU M4 ---")
model = whisper.load_model("base", device="mps") 

def get_audio_score(file_path):
    try:
        y, sr = librosa.load(file_path)
        noise_floor = np.mean(librosa.feature.rms(y=y))
        result = model.transcribe(str(file_path), language="ar")
        duration = librosa.get_duration(y=y, sr=sr)
        wpm = len(result['text'].split()) / (duration / 60) if duration > 0 else 0
        return (1.0 / (noise_floor + 0.001)) * (wpm / 150)
    except: return 0

if __name__ == "__main__":
    if not os.path.exists(DEST_DIR): os.makedirs(DEST_DIR)

    # RECHERCHE PROFONDE : on scanne tous les sous-dossiers
    print(f"Recherche de fichiers dans {SOURCE_DIR}...")
    all_audio_files = []
    for ext in EXTENSIONS:
        all_audio_files.extend(Path(SOURCE_DIR).rglob(f"*{ext}"))
    
    # On ignore les fichiers qui sont déjà dans le dossier top_30
    files_to_analyze = [f for f in all_audio_files if "top_30" not in str(f)]

    if len(files_to_analyze) == 0:
        print("Aucun fichier trouvé, même dans les sous-dossiers.")
        exit()

    print(f"Analyse de {len(files_to_analyze)} fichiers trouvés...")
    scored = []
    for path in files_to_analyze:
        score = get_audio_score(path)
        scored.append((path, score))
        print(f"Analyse : {path.name} | Score: {score:.2f}")
    
    scored.sort(key=lambda x: x[1], reverse=True)
    for path, s in scored[:TARGET_COUNT]:
        shutil.copy(path, os.path.join(DEST_DIR, path.name))
        
    print(f"\nSuccès ! Les {len(scored[:TARGET_COUNT])} perles sont isolées dans : {DEST_DIR}")
