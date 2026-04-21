import os
import shutil

# Configuration basée sur tes captures d'écran
SOURCE_DIR = "/Volumes/Expansion"
DEST_DIR = "./public/demos"

# Mapping exact avec les noms de tes dossiers sur le disque
LANGS = {
    'ARABE_FUSHA': 'ar',
    'ALGERIEN_DZ': 'dz',
    'FRANCAIS': 'fr',
    'ANGLAIS': 'en'
}

# Mots-clés pour tes catégories
CATS = {
    'pub': ['Pub', 'Publicité'],
    'inst': ['Corporate', 'Inst', 'Institutionnel'],
    'doc': ['Medical', 'Santé', 'Sante', 'E-learning']
}

def run():
    print(f"--- SCAN DU VOLUME : {SOURCE_DIR} ---")
    if not os.path.exists(SOURCE_DIR):
        print("❌ Erreur : Le volume Expansion n'est pas accessible.")
        return

    for folder_name, lang_code in LANGS.items():
        src_path = os.path.join(SOURCE_DIR, folder_name)
        
        if not os.path.exists(src_path):
            print(f"⚠️ Dossier '{folder_name}' non trouvé sur le disque.")
            continue

        target_dir = os.path.join(DEST_DIR,       os.makedirs(target_dir, exist_ok=True)
        
        files = os.listdir(src_path)
        for cat_key, keywords in CATS.items():
            # Recherche des fichiers mp3/wav contenant les mots-clés
            matches = [f for f in files if any(k.lower() in f.lower() for k in keywords) and f.endswith(('.mp3', '.wav'))]
            
            if matches:
                # On prend le plus récent
                matches.sort(key=lambda x: os.path.getmtime(os.path.join(src_path, x)), reverse=True)
                best_file = matches[0]
                
                shutil.copy2(os.path.join(src_path, best_file), os.path.join(target_dir, f"{cat_key}.mp3"))
                print(f"✅ {lang_code.upper()} : {best_file} -> {cat_key}.mp3")

    print("\n--- TERMINÉ : Tes démos sont prêtes dans public/demos ! ---")

if __name__ == "__main__":
    run()
