import os, shutil, librosa, numpy as np, whisper, warnings
warnings.filterwarnings("ignore")

# Configuration des chemins sur le volume Expansion
SOURCE_DIR = "/Volumes/Expansion/PORTFOLIO_TRIE"
DEST_DIR = "/Volumes/Expansion/PORTFOLIO_TRIE/top_30"
TARGET_COUNT = 30

print("--- Initialisation de l'IA sur GPU M4 ---")
# Utilisation du GPU Metal (MPS) pour une analyse ultra-rapide
model = whisper.load_model("base", device="mps") 

def get_audio_score(file_path):
    try:
        # 1. Analyse Technique (Qualité du signal/bruit)
        y, sr = librosa.load(file_path)
        noise_floor = np.mean(librosa.feature.rms(y=y))
        
        # 2. Analyse de l'IA (Fluidité du débit en Arabe MSA)
        result = model.transcribe(file_path, language="ar")
        duration = librosa.get_duration(y=y, sr=sr)
        words = result['text'].split()
        wpm = len(words) / (duration / 60) if duration > 0 else 0
        
        # Le score privilégie un signal propre (Sennheiser MKH 416) 
        # et un débit naturel (130-160 mots/minute)
        return (1.0 / (noise_floor + 0.001)) * (wpm / 150)
    except Exception as e:
        return 0

if __name__ == "__main__":
    if not os.path.exists(SOURCE_DIR):
        print(f"Erreur : Le volume ou le dossier '{SOURCE_DIR}' est introuvable.")
        print("Vérifiez que votre disque 'Expansion' est bien branché.")
        exit()

    if not os.path.exists(DEST_DIR): 
        os.makedirs(DEST_DIR)

    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith('.mp3')]
    print(f"Analyse de {len(files)} fichiers sur le volume Expansion...")
    
    scored = []
    for f in files:
        path = os.path.join(SOURCE_DIR, f)
        score = get_audio_score(path)
        scored.append((f, score))
        print(f"Analyse : {f} | Score: {score:.2f}")
    
    # Tri et sélection des 30 perles rares
    scored.sort(key=lambda x: x[1], reverse=True)
    top_files = scored[:TARGET_COUNT]
    
    for f, s in top_files:
        shutil.copy(os.path.join(SOURCE_DIR, f), os.path.join(DEST_DIR, f))
        
    print(f"\nSuccès ! Les 30 meilleurs fichiers sont dans : {DEST_DIR}")
