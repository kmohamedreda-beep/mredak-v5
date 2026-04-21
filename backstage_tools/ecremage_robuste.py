import os, shutil, librosa, numpy as np, whisper, warnings, csv, torch, gc
from pathlib import Path
warnings.filterwarnings("ignore")

SOURCE_DIR = "/Volumes/Expansion/PORTFOLIO_FINAL"
DEST_DIR = "/Volumes/Expansion/PORTFOLIO_FINAL/top_30"
PROGRESS_FILE = "scores_progression.csv"
TARGET_COUNT = 30
EXTENSIONS = ('.mp3', '.wav', '.MP3', '.WAV')

print("--- Initialisation de l'IA sur GPU M4 ---")
model = whisper.load_model("base", device="mps")

def get_audio_score(file_path):
    try:
        y, sr = librosa.load(file_path, sr=16000) # Downsampling pour économiser la RAM
        noise_floor = np.mean(librosa.feature.rms(y=y))
        result = model.transcribe(str(file_path), language="ar")
        duration = librosa.get_duration(y=y, sr=sr)
        wpm = len(result['text'].split()) / (duration / 60) if duration > 0 else 0
        score = (1.0 / (noise_floor + 0.001)) * (wpm / 150)
        
        # Nettoyage mémoire agressif
        del y, result
        gc.collect()
        torch.mps.empty_cache()
        
        return score
    except: return 0

if __name__ == "__main__":
    if not os.path.exists(DEST_DIR): os.makedirs(DEST_DIR)

    # Charger les scores déjà calculés
    scored_data = {}
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            reader = csv.reader(f)
            scored_data = {rows[0]: float(rows[1]) for rows in reader}
        print(f"Reprise : {len(scored_data)} fichiers déjà analysés.")

    print(f"Recherche de fichiers dans {SOURCE_DIR}...")
    all_files = []
    for ext in EXTENSIONS:
        all_files.extend(Path(SOURCE_DIR).rglob(f"*{ext}"))
    
    files_to_analyze = [f for f in all_files if "top_30" not in str(f) and str(f) not in scored_data]
    print(f"Reste à analyser : {len(files_to_analyze)} fichiers.")

    with open(PROGRESS_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        for i, path in enumerate(files_to_analyze):
            score = get_audio_score(path)
            scored_data[str(path)] = score
            writer.writerow([str(path), score])
            f.flush() # Sauvegarde immédiate sur le disque
            print(f"[{i+1}/{len(files_to_analyze)}] {path.name} | Score: {score:.2f}")

    # Tri final et sélection
    print("\n--- Sélection des 30 perles ---")
    final_list = sorted(scored_data.items(), key=lambda x: x[1], reverse=True)
    for path_str, s in final_list[:TARGET_COUNT]:
        p = Path(path_str)
        shutil.copy(p, os.path.join(DEST_DIR, p.name))
        
    print(f"Terminé ! Les 30 meilleurs sont dans {DEST_DIR}")
