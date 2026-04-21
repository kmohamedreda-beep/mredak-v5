import os, shutil, librosa, numpy as np, whisper, warnings
warnings.filterwarnings("ignore")

# Configuration du chemin exact
SOURCE_DIR = "/Volumes/Expansion/PORTFOLIO_TRIE_UNIQUE"
DEST_DIR = "/Volumes/Expansion/PORTFOLIO_TRIE_UNIQUE/top_30"
TARGET_COUNT = 30
EXTENSIONS = ('.mp3', '.wav')

print("--- Initialisation de l'IA sur GPU M4 ---")
# On force l'usage de MPS pour exploiter la puissance du M4
model = whisper.load_model("base", device="mps") 

def get_audio_score(file_path):
    try:
        # Analyse Technique (Clarté du signal)
        y, sr = librosa.load(file_path)
        noise_floor = np.mean(librosa.feature.rms(y=y))
        
        # Analyse de la fluidité vocale (Whisper IA)
        result = model.transcribe(file_path, language="ar")
        duration = librosa.get_duration(y=y, sr=sr)
        words = result['text'].split()
        wpm = len(words) / (duration / 60) if duration > 0 else 0
        
        # Le score privilégie un signal propre et une diction naturelle
        return (1.0 / (noise_floor + 0.001)) * (wpm / 150)
    except: return 0

if __name__ == "__main__":
    if not os.path.exists(SOURCE_DIR):
        print(f"Erreur : Le dossier '{SOURCE_DIR}' est introuvable.")
        print("Vérifiez le nom du dossier ou si le disque ' Expansion' comporte un espace au début.")
        exit()

    if not os.path.exists(DEST_DIR): os.makedirs(DEST_DIR)

    files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith(EXTENSIONS)]
    
    if len(files) == 0:
        print(f"Aucun fichier trouvé. Contenu du dossier : {os.listdir(SOURCE_DIR)[:5]}")
        exit()

    print(f"Analyse de {len(files)} fichiers dans PORTFOLIO_TRIE_UNIQUE...")
    scored = []
    for f in files:
        path = os.path.join(SOURCE_DIR, f)
        score = get_audio_score(path)
        scored.append((f, score))
        print(f"Analyse : {f} | Score: {score:.2f}")
    
    scored.sort(key=lambda x: x[1], reverse=True)
    for f, s in scored[:TARGET_COUNT]:
        shutil.copy(os.path.join(SOURCE_DIR, f), os.path.join(DEST_DIR, f))
    
    print(f"\nSuccès ! Les {len(scored[:TARGET_COUNT])} meilleurs sont dans {DEST_DIR}")
