import os
import shutil

# CONFIGURATION
SOURCE_DIR = "/Volumes/Expansion/Archives_VO"
DEST_DIR = "./public/demos"

# On simplifie les catégories pour le script
CATS = {
    'pub': ['Publicité', 'Pub'],
    'inst': ['Corporate', 'Institutionnel'],
    'doc': ['Medical', 'Santé', 'Sante']
}
LANGS = {'Arabic': 'ar', 'Algerian_DZ': 'dz', 'French': 'fr', 'English': 'en'}

def run():
    print(f"--- Scan de {SOURCE_DIR} ---")
    if not os.path.exists(SOURCE_DIR):
        print("❌ Disque Expansion introuvable !")
        return

    for f_name, code in LANGS.items():
        src = os.path.join(SOURCE_DIR, f_name)
        if not os.path.exists(src): continue
        
        out_dir = os.path.join(DEST_DIR, code)
        os.makedirs(out_dir, exist_ok=True)

        for c_key, words in CATS.items():
            match = [f for f in os.listdir(src) if any(w.lower() in f.lower() for w in words)]
            if match:
                match.sort(key=lambda x: os.path.getmtime(os.path.join(src, x)), reverse=True)
                shutil.copy2(os.path.join(src, match[0]), os.path.join(out_dir, f"{c_key}.mp3"))
                print(f"✅ {code.upper()} : {c_key}.mp3 extrait")

    print("--- Terminé ! ---")

if __name__ == "__main__":
    run()