import os
import cv2
import librosa
import numpy as np
import csv
import glob
from pathlib import Path

# On teste plusieurs variantes du nom pour être sûr
paths = [
    "/Volumes/Expansion/sorting_bin_MP4",
    "/Volumes/Expansion/sorting_bin_MP4 ",
    "/Volumes/Expansion/sorting_bin"
]

SOURCE_DIR = None
for p in paths:
    if os.path.exists(p):
        SOURCE_DIR = p
        break

if not SOURCE_DIR:
    print("❌ Dossier introuvable sur Expansion.")
    print("Contenu du disque :", os.listdir("/Volumes/Expansion"))
    exit()

CSV_FILE = "progression_video_scores.csv"

def score_video(path):
    try:
        y, sr = librosa.load(str(path), sr=None, duration=5)
        rms = np.sqrt(np.mean(y**2)) if len(y) > 0 else 0
        cap = cv2.VideoCapture(str(path))
        v_score = 0
        if cap.isOpened():
            ret, frame = cap.read()
            if ret: v_score = np.var(frame)
        cap.release()
        return round((rms * 100) + (v_score / 1000), 2  except:
        return 0

print(f"🎯 Cible détectée : {SOURCE_DIR}")
video_files = []
for root, dirs, files in os.walk(SOURCE_DIR):
    for file in files:
        if file.lower().endswith(('.mp4', '.mov', '.avi')):
            video_files.append(Path(root) / file)

if not video_files:
    print("❓ Aucune vidéo trouvée.")
else:
    print(f"🎬 Analyse de {len(video_files)} vidéos...")
    with open(CSV_FILE, "w", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["Fichier", "Score"])
        for i, v_path in enumerate(video_files):
            score = score_video(v_path)
            writer.writerow([v_path.name, score])
            print(f"✅ [{i+1}/{len(video_files)}] {v_path.name} | Score: {score}")
