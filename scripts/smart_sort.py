#!/usr/bin/env python3
"""
smart_sort.py — Tri intelligent de fichiers audio ET vidéo vers les catégories du projet.

Usage:
    python scripts/smart_sort.py --audio <source_audio> --video <source_video> [--dry-run] [--verbose]
    python scripts/smart_sort.py --audio <source_audio> [--dry-run] [--verbose]
    python scripts/smart_sort.py --video <source_video> [--dry-run] [--verbose]

Options:
    --dry-run   Simulation sans déplacer aucun fichier.
    --verbose   Affiche chaque fichier traité, pas seulement le résumé.

Règles de tri (insensible à la casse, appliquées dans l'ordre) :
    medical       : med, pharma, sante, tanibizu, careveo, car-t, mezigdomide,
                    patient, doctor, hopital, sanofi, novartis, rnib, cataracts,
                    health, healthcare
    corporate     : corpo, entrep, general, institutionnel, ong, sustainability,
                    rapport, interne, manifesto
    elearning     : learning, formation, cours, tutorial, tuto, mooc, module
    gaming        : game, gaming, monopoly, exile, spins, character, voix-off-jeu
    luxury        : chapelle, affinity, mika, paris, relato, lifestyle, luxe
    documentary   : hajj, fisherman, guardian, limadha, women, doc, histoire
    narration     : vo, voix, narr, male, accent, demo, reference, ref
    ads           : pub, ads, tv, radio, announcement, store, crm, carloc,
                    toyota, avast, smartpower
    international : arabic, ar_, en_, fr_, podcast, dz, algerie, dzx
    sorting_bin   : tout le reste (à revoir manuellement)
"""

import argparse
import shutil
import sys
from pathlib import Path
from collections import defaultdict

# ── Configuration ────────────────────────────────────────────────────────────

PROJECT_ROOT = Path(__file__).resolve().parent.parent
AUDIO_BASE   = PROJECT_ROOT / "public" / "audio"
VIDEO_BASE   = PROJECT_ROOT / "public" / "video"

RULES = [
    ("medical",       ["med", "pharma", "sante", "tanibizu", "careveo", "car-t",
                        "mezigdomide", "patient", "doctor", "hopital", "sanofi",
                        "novartis", "rnib", "cataracts", "health", "healthcare"]),
    ("corporate",     ["corpo", "entrep", "general", "institutionnel", "ong",
                        "sustainability", "rapport", "interne", "manifesto"]),
    ("elearning",     ["learning", "formation", "cours", "tutorial", "tuto", "mooc", "module"]),
    ("gaming",        ["game", "gaming", "monopoly", "exile", "spins", "character", "voix-off-jeu"]),
    ("luxury",        ["chapelle", "affinity", "mika", "paris", "relato", "lifestyle", "luxe"]),
    ("documentary",   ["hajj", "fisherman", "guardian", "limadha", "women", "doc", "histoire"]),
    ("narration",     ["vo", "voix", "narr", "male", "accent", "demo", "reference", "ref"]),
    ("ads",           ["pub", "ads", "tv", "radio", "announcement", "store", "crm",
                        "carloc", "toyota", "avast", "smartpower"]),
    ("international", ["arabic", "ar_", "en_", "fr_", "podcast", "dz", "algerie", "dzx"]),
]

AUDIO_EXTENSIONS = {".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac", ".wma"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv"}

# ── Helpers ───────────────────────────────────────────────────────────────────

def classify(filename: str) -> str:
    """Retourne la catégorie cible pour un nom de fichier donné."""
    stem = filename.lower()
    for category, keywords in RULES:
        if any(kw in stem for kw in keywords):
            return category
    return "sorting_bin"


def resolve_destination(dest_dir: Path, filename: str) -> Path:
    """Évite les collisions en ajoutant un suffixe numérique si nécessaire."""
    dest = dest_dir / filename
    if not dest.exists():
        return dest
    stem = Path(filename).stem
    suffix = Path(filename).suffix
    counter = 1
    while dest.exists():
        dest = dest_dir / f"{stem}_{counter}{suffix}"
        counter += 1
    return dest


def move_file(src: Path, dest: Path, dry_run: bool) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dry_run:
        shutil.move(str(src), str(dest))


def process_source(source: Path, base: Path, extensions: set,
                   media_type: str, dry_run: bool, verbose: bool):
    """Scanne un dossier source, classe et déplace les fichiers."""
    sorting_bin = base / "sorting_bin"

    all_files = [
        f for f in source.rglob("*")
        if f.is_file() and f.suffix.lower() in extensions
    ]

    if not all_files:
        print(f"  Aucun fichier {media_type} trouvé dans : {source}")
        return defaultdict(int), [], 0

    print(f"Fichiers {media_type} détectés : {len(all_files)}")

    counts  = defaultdict(int)
    errors  = []
    skipped = 0

    for src in all_files:
        category = classify(src.name)
        dest_dir = sorting_bin if category == "sorting_bin" else base / category
        dest     = resolve_destination(dest_dir, src.name)

        if src.parent.resolve() == dest_dir.resolve():
            skipped += 1
            if verbose:
                print(f"  [SKIP]  {src.name}  →  déjà dans {category}/")
            continue

        if verbose:
            label = "[DRY]" if dry_run else "[OK] "
            collision = f"  (renommé → {dest.name})" if dest.name != src.name else ""
            print(f"  {label} {src.name}  →  {category}/{dest.name}{collision}")

        try:
            move_file(src, dest, dry_run=dry_run)
            counts[category] += 1
        except Exception as exc:
            errors.append((src, str(exc)))
            print(f"  [ERR]  {src.name} : {exc}", file=sys.stderr)

    return counts, errors, skipped


def print_summary(counts: dict, errors: list, skipped: int,
                  base: Path, media_type: str, dry_run: bool):
    """Affiche le résumé pour un type de média."""
    sorting_bin = base / "sorting_bin"
    total = sum(counts.values())
    action = "à déplacer" if dry_run else "déplacés"

    print(f"\n{'─' * 58}")
    print(f"  RÉSUMÉ — {media_type.upper():<46}")
    print(f"{'─' * 58}")
    for cat, n in sorted(counts.items()):
        dest_path = sorting_bin if cat == "sorting_bin" else base / cat
        try:
            rel = dest_path.relative_to(PROJECT_ROOT)
        except ValueError:
            rel = dest_path
        print(f"  {cat:<15} {n:>5} fichier(s)  →  {rel}")
    if skipped:
        print(f"  {'(déjà en place)':<15} {skipped:>5} fichier(s)")
    if errors:
        print(f"  {'ERREURS':<15} {len(errors):>5}")
    print(f"{'─' * 58}")
    print(f"  Total {action} : {total}  |  Ignorés : {skipped}  |  Erreurs : {len(errors)}")
    print(f"{'─' * 58}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Tri intelligent de fichiers audio et vidéo vers les catégories du projet."
    )
    parser.add_argument("--audio",   metavar="DIR", help="Dossier source audio")
    parser.add_argument("--video",   metavar="DIR", help="Dossier source vidéo")
    parser.add_argument("--dry-run", action="store_true", help="Simulation sans déplacer de fichiers")
    parser.add_argument("--verbose", action="store_true", help="Affiche chaque fichier traité")
    args = parser.parse_args()

    if not args.audio and not args.video:
        parser.error("Spécifiez au moins --audio <dir> ou --video <dir>")

    if args.dry_run:
        print("── MODE DRY-RUN (aucun fichier ne sera déplacé) ──────────────────\n")

    grand_total = 0
    grand_errors = 0

    if args.audio:
        source = Path(args.audio).resolve()
        if not source.is_dir():
            print(f"[ERREUR] Dossier audio introuvable : {source}", file=sys.stderr)
            sys.exit(1)
        counts, errors, skipped = process_source(
            source, AUDIO_BASE, AUDIO_EXTENSIONS, "audio", args.dry_run, args.verbose
        )
        print_summary(counts, errors, skipped, AUDIO_BASE, "audio", args.dry_run)
        grand_total  += sum(counts.values())
        grand_errors += len(errors)

    if args.video:
        source = Path(args.video).resolve()
        if not source.is_dir():
            print(f"[ERREUR] Dossier vidéo introuvable : {source}", file=sys.stderr)
            sys.exit(1)
        counts, errors, skipped = process_source(
            source, VIDEO_BASE, VIDEO_EXTENSIONS, "vidéo", args.dry_run, args.verbose
        )
        print_summary(counts, errors, skipped, VIDEO_BASE, "vidéo", args.dry_run)
        grand_total  += sum(counts.values())
        grand_errors += len(errors)

    if args.audio and args.video:
        action = "à déplacer" if args.dry_run else "déplacés"
        print(f"\n  TOTAL GLOBAL — {grand_total} fichier(s) {action}, {grand_errors} erreur(s)")

    if args.dry_run:
        print("\nRelancez sans --dry-run pour appliquer les déplacements.")


if __name__ == "__main__":
    main()
